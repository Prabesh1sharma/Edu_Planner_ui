'use client'
import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useStreamPlan, StreamModule } from '../app/create-plan/useStreamPlan';

export type GeneratedPlan = {
    description: string;
    topics: string[];
    estimateDate: string;
};

type EduPlanFormProps = {
    onGenerate: (plan: GeneratedPlan) => void;
};

const MODULE_TYPE_CONFIG = {
    basic:        { color: '#22c55e', bg: '#f0fdf4', label: 'Basic',        icon: '◆' },
    intermediate: { color: '#3b82f6', bg: '#eff6ff', label: 'Intermediate', icon: '◈' },
    advanced:     { color: '#a855f7', bg: '#faf5ff', label: 'Advanced',     icon: '◉' },
    project:      { color: '#f59e0b', bg: '#fffbeb', label: 'Project',      icon: '◎' },
};

// ─── Module card ──────────────────────────────────────────────────────────────
function ModuleCard({ mod, isNew }: { mod: StreamModule; isNew: boolean }) {
    const cfg = MODULE_TYPE_CONFIG[mod.type] ?? MODULE_TYPE_CONFIG.basic;
    return (
        <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '10px 12px', background: '#fff',
            border: `1.5px solid ${isNew ? cfg.color : '#e5e7eb'}`,
            borderRadius: 10,
            animation: isNew ? 'slideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
            boxShadow: isNew ? `0 0 0 3px ${cfg.color}22` : 'none',
            transition: 'border-color 1.5s ease, box-shadow 1.5s ease',
        }}>
            <div style={{
                minWidth: 26, height: 26, borderRadius: '50%',
                background: cfg.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
                {mod.module_number}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{mod.name}</span>
                    <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                        color: cfg.color, background: cfg.bg,
                        borderRadius: 4, padding: '1px 6px', textTransform: 'uppercase',
                    }}>
                        {cfg.label}
                    </span>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                    {mod.start_date} → {mod.end_date} · {mod.estimated_hours}h
                </div>
            </div>
        </div>
    );
}

// ─── Streaming panel ──────────────────────────────────────────────────────────
function StreamingPanel({ modules, status, isStreaming, debugLog }: {
    modules: StreamModule[];
    status: string;
    isStreaming: boolean;
    debugLog: string[];
}) {
    const [showDebug, setShowDebug] = useState(false);
    if (!isStreaming && modules.length === 0 && debugLog.length === 0) return null;

    return (
        <div style={{
            background: '#fafafa', border: '1px solid #e5e7eb',
            borderRadius: 14, overflow: 'hidden', marginTop: 16,
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: isStreaming
                    ? 'linear-gradient(90deg,#4f46e5,#7c3aed)'
                    : 'linear-gradient(90deg,#059669,#0d9488)',
                color: '#fff',
            }}>
                {isStreaming
                    ? <span style={{ display: 'flex', gap: 3 }}>
                        {[0,1,2].map(i => (
                            <span key={i} style={{
                                width: 5, height: 5, borderRadius: '50%', background: '#fff',
                                animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite`,
                            }}/>
                        ))}
                    </span>
                    : <span>✓</span>
                }
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                    {status || (isStreaming ? 'Generating...' : 'Done')}
                </span>
                {modules.length > 0 && (
                    <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 20, padding: '2px 8px',
                    }}>
                        {modules.length} module{modules.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Module list */}
            {modules.length > 0 && (
                <div style={{
                    maxHeight: 300, overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: 6, padding: 10,
                }}>
                    {modules.map((m, i) => (
                        <ModuleCard
                            key={m.id || `${m.module_number}-${i}`}
                            mod={m}
                            isNew={i === modules.length - 1 && isStreaming}
                        />
                    ))}
                </div>
            )}

            {/* Summary footer */}
            {!isStreaming && modules.length > 0 && (
                <div style={{
                    display: 'flex', gap: 12, padding: '7px 14px', flexWrap: 'wrap',
                    borderTop: '1px solid #e5e7eb', background: '#f9fafb',
                }}>
                    {(Object.entries(MODULE_TYPE_CONFIG) as [string, typeof MODULE_TYPE_CONFIG['basic']][]).map(([type, cfg]) => {
                        const count = modules.filter(m => m.type === type).length;
                        if (!count) return null;
                        return <span key={type} style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.icon} {count} {cfg.label}</span>;
                    })}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7280' }}>
                        ~{modules.reduce((s, m) => s + (m.estimated_hours ?? 0), 0).toFixed(0)}h total
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export default function EduPlanForm({ onGenerate }: EduPlanFormProps) {
    const [mode, setMode] = useState<'manual' | 'ai'>('manual');
    const [name, setName] = useState('');
    const [estimateDate, setEstimateDate] = useState('');
    const [description, setDescription] = useState('');
    const [topics, setTopics] = useState<string[]>(['']);
    const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [timeCommitmentHours, setTimeCommitmentHours] = useState('');

    const { showSuccess, showError } = useToast();
    const { state: stream, start: startStream } = useStreamPlan();

    const handleTopicChange = (idx: number, value: string) => {
        setTopics(prev => { const n = [...prev]; n[idx] = value; return n; });
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'manual') {
            onGenerate({
                description: description || `A comprehensive plan for ${name}`,
                topics: topics.filter(Boolean),
                estimateDate,
            });
            return;
        }

        // Capture form values NOW — passed directly to startStream, no closure capture needed
        const formSnapshot = { name, description, difficultyLevel, timeCommitmentHours, estimateDate };

        await startStream(
            {
                topic: formSnapshot.name,
                estimation_end_date: formSnapshot.estimateDate,
                description: formSnapshot.description,
                difficulty_level: formSnapshot.difficultyLevel,
                time_commitment_hours_per_week: Number(formSnapshot.timeCommitmentHours),
            },
            {
                onCompleted: (modules, total) => {
                    if (modules.length > 0) {
                        onGenerate({
                            description: formSnapshot.description || `AI-generated ${formSnapshot.difficultyLevel} plan for ${formSnapshot.name}`,
                            topics: modules.map(m => m.name),
                            estimateDate: formSnapshot.estimateDate,
                        });
                        showSuccess(`🎉 Plan generated! ${modules.length} modules ready.`);
                    } else if (total > 0) {
                        onGenerate({
                            description: formSnapshot.description || `AI-generated plan for ${formSnapshot.name}`,
                            topics: Array.from({ length: total }, (_, i) => `Module ${i + 1}`),
                            estimateDate: formSnapshot.estimateDate,
                        });
                        showSuccess(`🎉 Plan generated! ${total} modules ready.`);
                    } else {
                        showError('Stream completed but no modules received. Please try again.');
                    }
                },
                onError: (msg) => showError(msg),
            }
        );
    };

    // Shared styles
    const inputStyle: React.CSSProperties = {
        width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10,
        padding: '11px 14px', fontSize: 14, outline: 'none', background: '#fff',
        boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit',
    };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
        marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
    };

    return (
        <>
            <style>{`
                @keyframes slideIn {
                    from { opacity:0; transform:translateY(-8px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }
                @keyframes pulse {
                    0%,100% { opacity:0.3; transform:scale(0.8); }
                    50%     { opacity:1; transform:scale(1.2); }
                }
                .edu-input:focus {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
            `}</style>

            <form onSubmit={handleGenerate} style={{
                background: '#fff', borderRadius: 18,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: 28, maxWidth: 560, margin: '32px auto',
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
            }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{
                        margin: 0, fontSize: 22, fontWeight: 700,
                        background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>Create EduPlan</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>Build a structured learning journey</p>
                </div>

                {/* Mode switcher */}
                <div style={{
                    display: 'flex', gap: 6, padding: 4,
                    background: '#f3f4f6', borderRadius: 12, marginBottom: 22,
                }}>
                    {(['manual', 'ai'] as const).map(m => (
                        <button key={m} type="button" onClick={() => setMode(m)} style={{
                            flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 13,
                            fontWeight: 600, cursor: 'pointer', border: 'none',
                            background: mode === m ? '#fff' : 'transparent',
                            color: mode === m ? '#4f46e5' : '#6b7280',
                            boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s',
                        }}>
                            {m === 'manual' ? '✏️ Manual' : '✨ AI Generate'}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Plan Name</label>
                        <input className="edu-input" style={inputStyle} type="text"
                            value={name} required placeholder="e.g. Full Stack Developer Journey"
                            onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label style={labelStyle}>Estimated Completion Date</label>
                        <input className="edu-input" style={inputStyle} type="date"
                            value={estimateDate} required onChange={e => setEstimateDate(e.target.value)} />
                    </div>
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea className="edu-input" style={{ ...inputStyle, resize: 'vertical', minHeight: 76 }}
                            value={description} rows={3} placeholder="Briefly describe your plan..."
                            onChange={e => setDescription(e.target.value)} />
                    </div>

                    {mode === 'ai' && (<>
                        <div>
                            <label style={labelStyle}>Difficulty Level</label>
                            <select className="edu-input" style={inputStyle}
                                value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value as any)}>
                                <option value="beginner">🌱 Beginner</option>
                                <option value="intermediate">⚡ Intermediate</option>
                                <option value="advanced">🔥 Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Hours per Week</label>
                            <input className="edu-input" style={inputStyle} type="number"
                                value={timeCommitmentHours} required min="1" max="168" placeholder="e.g. 10"
                                onChange={e => setTimeCommitmentHours(e.target.value)} />
                        </div>
                    </>)}

                    {mode === 'manual' && (
                        <div>
                            <label style={labelStyle}>Topics</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {topics.map((topic, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 8 }}>
                                        <input className="edu-input" style={{ ...inputStyle, flex: 1 }}
                                            type="text" value={topic} placeholder={`Topic ${idx + 1}`}
                                            onChange={e => handleTopicChange(idx, e.target.value)} />
                                        {topics.length > 1 && (
                                            <button type="button"
                                                onClick={() => setTopics(p => p.filter((_, i) => i !== idx))}
                                                style={{
                                                    border: '1px solid #fca5a5', borderRadius: 8,
                                                    background: '#fff5f5', color: '#ef4444',
                                                    padding: '0 12px', cursor: 'pointer', fontSize: 13,
                                                }}>✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => setTopics(p => [...p, ''])} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#6366f1', fontWeight: 600, fontSize: 13,
                                    textAlign: 'left', padding: '4px 0',
                                }}>+ Add Topic</button>
                            </div>
                        </div>
                    )}
                </div>

                {mode === 'ai' && (
                    <StreamingPanel
                        modules={stream.modules}
                        status={stream.status}
                        isStreaming={stream.isStreaming}
                        debugLog={stream.debugLog}
                    />
                )}

                {stream.error && (
                    <div style={{
                        marginTop: 12, padding: '10px 14px', borderRadius: 10,
                        background: '#fef2f2', border: '1px solid #fca5a5',
                        color: '#dc2626', fontSize: 13,
                    }}>
                        ⚠️ {stream.error}
                    </div>
                )}

                <button type="submit" disabled={stream.isStreaming} style={{
                    marginTop: 20, width: '100%', padding: '14px 0',
                    borderRadius: 12, border: 'none',
                    cursor: stream.isStreaming ? 'not-allowed' : 'pointer',
                    background: stream.isStreaming
                        ? '#c7d2fe'
                        : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    color: '#fff', fontWeight: 700, fontSize: 15,
                    transition: 'all 0.2s', letterSpacing: '0.01em',
                }}>
                    {mode === 'manual'
                        ? '→ Create Plan Manually'
                        : stream.isStreaming
                            ? `⟳ Generating... (${stream.modules.length} modules)`
                            : '✨ Generate Plan with AI'}
                </button>
            </form>
        </>
    );
}