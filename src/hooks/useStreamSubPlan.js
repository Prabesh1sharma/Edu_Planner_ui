import { useState, useRef, useCallback } from 'react';
import { createStructuredSubPlansStream } from '../api/plansApi';

export function useStreamSubPlan() {
    const [state, setState] = useState({
        isStreaming: false,
        status: '',
        submodules: [],
        error: null,
    });

    const submodulesRef = useRef([]);
    const doneRef = useRef(false);
    const callbacksRef = useRef(null);

    const finish = useCallback((totalFromPayload) => {
        if (doneRef.current) return;
        doneRef.current = true;

        const submodules = submodulesRef.current;
        const total = totalFromPayload ?? submodules.length;

        setState(s => ({
            ...s,
            isStreaming: false,
            status: `Done — ${total} submodules`,
        }));

        if (callbacksRef.current) {
            callbacksRef.current.onCompleted(submodules, total);
        }
    }, []);

    const start = useCallback(async (payload, callbacks) => {
        callbacksRef.current = callbacks;

        submodulesRef.current = [];
        doneRef.current = false;
        setState({
            isStreaming: true,
            status: 'Starting...',
            submodules: [],
            error: null,
        });

        await createStructuredSubPlansStream(payload, {
            onMessage: (raw) => {
                if (!raw.trim()) return;

                console.log('[stream] Raw message received:', raw);

                // Strip all leading "data:" prefixes (server is sending double: "data: data: {...}")
                let normalized = raw.trim();
                while (normalized.startsWith('data:')) {
                    normalized = normalized.slice(5).trim();
                }
                
                // Strip any literal "\n" or "\r" suffix (server sends stringified "\n\n" at the end)
                while (normalized.endsWith('\\n') || normalized.endsWith('\\r')) {
                    normalized = normalized.slice(0, -2).trim();
                }

                console.log('[stream] Normalized message:', normalized);

                let parsed;
                try {
                    parsed = JSON.parse(normalized);
                    console.log('[stream] Parsed JSON:', parsed);
                } catch (err) {
                    console.warn('[stream] Failed to parse JSON:', err, 'from normalized string:', normalized);
                    return; // non-JSON heartbeat
                }

                if (parsed.error) {
                    console.error('[stream] Server error in stream:', parsed.error);
                    setState(s => ({ ...s, isStreaming: false, error: parsed.error }));
                    callbacks.onError(parsed.error);
                    return;
                }

                if (parsed.status && parsed.status !== 'completed') {
                    const msg = parsed.message || parsed.status;
                    setState(s => ({ ...s, status: msg }));
                }

                if (parsed.type === 'submodule' && parsed.data) {
                    const sub = parsed.data;
                    submodulesRef.current = submodulesRef.current.concat(sub);
                    const snapshot = submodulesRef.current.slice();
                    setState(s => ({ ...s, submodules: snapshot }));
                }

                if (parsed.status === 'completed') {
                    finish(parsed.total_submodules);
                }
            },

            onComplete: () => {
                finish();
            },

            onError: (err) => {
                const msg = err.message || 'Stream error';
                setState(s => ({ ...s, isStreaming: false, error: msg }));
                callbacks.onError(msg);
            },
        });
    }, [finish]);

    return { state, start };
}
