import { useState, useRef, useCallback } from 'react';
import { createStructuredPlanStream } from './createPlanApi';

export type StreamModule = {
    id: string;
    module_number: number;
    name: string;
    description: string;
    type: 'basic' | 'intermediate' | 'advanced' | 'project';
    start_date: string;
    end_date: string;
    estimated_hours: number;
};

export type StreamState = {
    isStreaming: boolean;
    status: string;
    modules: StreamModule[];
    debugLog: string[];
    error: string | null;
};

export type StreamCallbacks = {
    onCompleted: (modules: StreamModule[], totalFromPayload: number) => void;
    onError: (msg: string) => void;
};

export function useStreamPlan() {
    const [state, setState] = useState<StreamState>({
        isStreaming: false,
        status: '',
        modules: [],
        debugLog: [],
        error: null,
    });

    // Single source of truth — never read state inside callbacks, only these refs
    const modulesRef = useRef<StreamModule[]>([]);
    const doneRef = useRef(false);
    const callbacksRef = useRef<StreamCallbacks | null>(null);

    const appendLog = (msg: string) => {
        const ts = new Date().toISOString().slice(11, 23);
        const line = `${ts} ${msg}`;
        console.log('[stream]', line);
        setState(s => ({ ...s, debugLog: [...s.debugLog.slice(-49), line] }));
    };

    const finish = useCallback((totalFromPayload?: number) => {
        if (doneRef.current) {
            console.log('[stream] finish() called again — ignored');
            return;
        }
        doneRef.current = true;

        const modules = modulesRef.current;
        const total = totalFromPayload ?? modules.length;

        appendLog(`finish(): ${modules.length} modules in ref, total=${total}`);

        setState(s => ({
            ...s,
            isStreaming: false,
            status: `Done — ${total} modules`,
        }));

        if (callbacksRef.current) {
            callbacksRef.current.onCompleted(modules, total);
        }
    }, []);

    const start = useCallback(async (
        payload: {
            topic: string;
            estimation_end_date: string;
            description: string;
            difficulty_level: 'beginner' | 'intermediate' | 'advanced';
            time_commitment_hours_per_week: number;
        },
        callbacks: StreamCallbacks
    ) => {
        // Store callbacks in ref so finish() can always access them
        callbacksRef.current = callbacks;

        // Hard reset — clear everything synchronously before opening stream
        modulesRef.current = [];
        doneRef.current = false;
        setState({
            isStreaming: true,
            status: 'Starting...',
            modules: [],
            debugLog: [],
            error: null,
        });

        appendLog('Stream opened');

        await createStructuredPlanStream(payload, {
            onMessage: (raw: string) => {
                // Skip empty lines (SSE double-newline separators)
                if (!raw.trim()) return;

                appendLog(`MSG: ${raw.slice(0, 80)}`);

                // Some SSE clients may still include the "data:" prefix; normalize it away
                let normalized = raw.trim();
                while (normalized.startsWith('data:')) {
                    normalized = normalized.slice(5).trim();
                }

                // Strip any literal "\n" or "\r" suffix just in case the server stringifies it inside the payload
                while (normalized.endsWith('\\n') || normalized.endsWith('\\r')) {
                    normalized = normalized.slice(0, -2).trim();
                }

                let parsed: any;
                try {
                    parsed = JSON.parse(normalized);
                } catch {
                    return; // non-JSON heartbeat, skip
                }

                if (parsed.error) {
                    appendLog(`Server error: ${parsed.error}`);
                    setState(s => ({ ...s, isStreaming: false, error: parsed.error }));
                    callbacks.onError(parsed.error);
                    return;
                }

                if (parsed.status && parsed.status !== 'completed') {
                    const msg = parsed.message || parsed.status;
                    appendLog(`Status: ${msg}`);
                    setState(s => ({ ...s, status: msg }));
                }

                if (parsed.type === 'module' && parsed.data) {
                    const mod = parsed.data as StreamModule;
                    // Mutate ref directly — no closure capture issues
                    modulesRef.current = modulesRef.current.concat(mod);
                    appendLog(`Module ${mod.module_number} added — ref total: ${modulesRef.current.length}`);
                    // Copy to state for rendering
                    const snapshot = modulesRef.current.slice();
                    setState(s => ({ ...s, modules: snapshot }));
                }

                if (parsed.status === 'completed') {
                    appendLog(`Completed event — ref: ${modulesRef.current.length}, payload total: ${parsed.total_modules}`);
                    finish(parsed.total_modules);
                }
            },

            onComplete: () => {
                appendLog(`onComplete — doneRef: ${doneRef.current}, ref: ${modulesRef.current.length}`);
                // Fallback: if 'completed' event already called finish(), this is a no-op
                finish();
            },

            onError: (err: Error) => {
                const msg = err.message || 'Stream error';
                appendLog(`Error: ${msg}`);
                setState(s => ({ ...s, isStreaming: false, error: msg }));
                callbacks.onError(msg);
            },
        });
    }, [finish]);

    return { state, start };
}