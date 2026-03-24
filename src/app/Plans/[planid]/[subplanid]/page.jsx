'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../../components/navbar';
import AddSubPlanModal from '../../../../components/AddSubPlanModal';
import { getPlanDetails, getCourseSubPlans, toggleSubPlanCompletion, manualCreateSubPlan } from '../../../../api/plansApi';
import { useToast } from '../../../../context/ToastContext';
import { useStreamSubPlan } from '../../../../hooks/useStreamSubPlan';

// ─── Submodule type config ────────────────────────────────────────────────────
const SUBMODULE_TYPE_CONFIG = {
    reading:  { color: '#3b82f6', bg: '#eff6ff', label: 'Reading',  icon: '📖' },
    practice: { color: '#22c55e', bg: '#f0fdf4', label: 'Practice', icon: '💪' },
    exercise: { color: '#f59e0b', bg: '#fffbeb', label: 'Exercise', icon: '✏️' },
    review:   { color: '#8b5cf6', bg: '#faf5ff', label: 'Review',   icon: '🔄' },
    quiz:     { color: '#ef4444', bg: '#fef2f2', label: 'Quiz',     icon: '📝' },
    project:  { color: '#ec4899', bg: '#fdf2f8', label: 'Project',  icon: '🚀' },
};

// ─── Streaming submodule card ─────────────────────────────────────────────────
function SubmoduleCard({ sub, isNew }) {
    const cfg = SUBMODULE_TYPE_CONFIG[sub.type] ?? SUBMODULE_TYPE_CONFIG.reading;
    return (
        <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '10px 12px', background: '#fff',
            border: `1.5px solid ${isNew ? cfg.color : '#e5e7eb'}`,
            borderRadius: 10,
            animation: isNew ? 'subSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
            boxShadow: isNew ? `0 0 0 3px ${cfg.color}22` : 'none',
            transition: 'border-color 1.5s ease, box-shadow 1.5s ease',
        }}>
            <div style={{
                minWidth: 26, height: 26, borderRadius: '50%',
                background: cfg.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
                {sub.submodule_number}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{sub.name}</span>
                    <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                        color: cfg.color, background: cfg.bg,
                        borderRadius: 4, padding: '1px 6px', textTransform: 'uppercase',
                    }}>
                        {cfg.icon} {cfg.label}
                    </span>
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                    {sub.description}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                    {sub.start_date} → {sub.end_date} · {sub.estimated_hours}h · {sub.duration_days}d
                </div>
            </div>
        </div>
    );
}

// ─── Streaming panel ──────────────────────────────────────────────────────────
function StreamingPanel({ submodules, status, isStreaming }) {
    if (!isStreaming && submodules.length === 0) return null;

    return (
        <div style={{
            background: '#fafafa', border: '1px solid #e5e7eb',
            borderRadius: 14, overflow: 'hidden', marginBottom: 24,
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
                                animation: `subPulse 1.2s ease-in-out ${i*0.2}s infinite`,
                            }}/>
                        ))}
                    </span>
                    : <span>✓</span>
                }
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                    {status || (isStreaming ? 'Generating...' : 'Done')}
                </span>
                {submodules.length > 0 && (
                    <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 20, padding: '2px 8px',
                    }}>
                        {submodules.length} submodule{submodules.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Submodule list */}
            {submodules.length > 0 && (
                <div style={{
                    maxHeight: 350, overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: 6, padding: 10,
                }}>
                    {submodules.map((s, i) => (
                        <SubmoduleCard
                            key={s.id || `${s.submodule_number}-${i}`}
                            sub={s}
                            isNew={i === submodules.length - 1 && isStreaming}
                        />
                    ))}
                </div>
            )}

            {/* Summary footer */}
            {!isStreaming && submodules.length > 0 && (
                <div style={{
                    display: 'flex', gap: 12, padding: '7px 14px', flexWrap: 'wrap',
                    borderTop: '1px solid #e5e7eb', background: '#f9fafb',
                }}>
                    {Object.entries(SUBMODULE_TYPE_CONFIG).map(([type, cfg]) => {
                        const count = submodules.filter(s => s.type === type).length;
                        if (!count) return null;
                        return <span key={type} style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.icon} {count} {cfg.label}</span>;
                    })}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7280' }}>
                        ~{submodules.reduce((s, m) => s + (m.estimated_hours ?? 0), 0).toFixed(1)}h total
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SubPlanPage() {
    const { planid: courseId, subplanid: planId } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subPlans, setSubPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { showSuccess, showError } = useToast();

    const { state: stream, start: startStream } = useStreamSubPlan();

    const handleToggleComplete = async (subPlan) => {
        try {
            const newStatus = !subPlan.completed;
            // Optimistically update
            setSubPlans(prev => prev.map(s => s.id === subPlan.id ? { ...s, completed: newStatus } : s));
            
            const response = await toggleSubPlanCompletion(subPlan.id, planId, newStatus);
            if (response.status === 'error' || response.error) {
                // Revert on logical error
                setSubPlans(prev => prev.map(s => s.id === subPlan.id ? { ...s, completed: subPlan.completed } : s));
                showError(response.message || 'Error updating submodule completion status');
            } else {
                showSuccess(response.message || "Submodule completion status updated successfully");
            }
        } catch (error) {
            // Revert on error
            setSubPlans(prev => prev.map(s => s.id === subPlan.id ? { ...s, completed: subPlan.completed } : s));
            showError(error.message || 'Error updating submodule completion status');
        }
    };

    useEffect(() => {
        const fetchPlanData = async () => {
            if (!courseId || !planId) return;
            
            try {
                setLoading(true);
                const [data, subplansData] = await Promise.all([
                    getPlanDetails(courseId, planId),
                    getCourseSubPlans(courseId, planId)
                ]);
                
                setPlan({
                    name: data.name,
                    description: data.description,
                    startDate: data.start_date,
                    endDate: data.end_date,
                    completed: data.completed
                });
                
                if (subplansData && subplansData.subplans) {
                    setSubPlans(subplansData.subplans.map(sub => ({
                        id: sub.id,
                        submodule_number: sub.submodule_number,
                        name: sub.name,
                        description: sub.description,
                        estimatedEndDate: sub.end_date,
                        completed: sub.completed,
                        type: sub.type,
                    })));
                } else {
                    setSubPlans([]);
                }

                setError(null);
            } catch (err) {
                console.error('Failed to fetch plan data:', err);
                setError(err.message || 'Failed to load plan details.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlanData();
    }, [courseId, planId]);

    const handleGenerateSubPlan = async () => {
        await startStream(
            { topic_id: courseId, module_id: planId },
            {
                onCompleted: (submodules) => {
                    setSubPlans(submodules.map(sub => ({
                        id: sub.id,
                        submodule_number: sub.submodule_number,
                        name: sub.name,
                        description: sub.description,
                        estimatedEndDate: sub.end_date,
                        completed: sub.completed,
                        type: sub.type,
                    })));
                },
                onError: (msg) => {
                    console.error('Sub plan generation error:', msg);
                },
            }
        );
    };

    const handleAddSubPlan = async (subPlanData) => {
        try {
            const nextSubmoduleNumber = subPlans.length > 0 
                ? Math.max(...subPlans.map(s => s.submodule_number || 0)) + 1 
                : 1;

            const payload = {
                course_id: courseId,
                module_id: planId,
                submodule_number: nextSubmoduleNumber,
                name: subPlanData.name,
                description: subPlanData.description,
                start_date: subPlanData.start_date,
                end_date: subPlanData.end_date
            };

            const result = await manualCreateSubPlan(payload);
            showSuccess(result.message || "Subplan created successfully!");

            const newSub = {
                id: result.submodule_id || Date.now(),
                submodule_number: nextSubmoduleNumber,
                name: subPlanData.name,
                description: subPlanData.description,
                estimatedEndDate: subPlanData.end_date,
                completed: false,
                type: 'reading' // Default type
            };
            setSubPlans([...subPlans, newSub]);
            setShowModal(false);
        } catch (error) {
            showError(error.message || "Failed to create subplan");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Navbar />
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading subplan details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Navbar />
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Subplan</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <Navbar />

            {/* Animations for streaming */}
            <style>{`
                @keyframes subSlideIn {
                    from { opacity:0; transform:translateY(-8px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }
                @keyframes subPulse {
                    0%,100% { opacity:0.3; transform:scale(0.8); }
                    50%     { opacity:1; transform:scale(1.2); }
                }
            `}</style>

            {/* Plan Topic and Description */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-extrabold text-gray-900">{plan.name}</h1>
                    <button
                        onClick={handleGenerateSubPlan}
                        disabled={stream.isStreaming}
                        className={`font-semibold px-4 py-2 rounded-lg transition ${
                            stream.isStreaming
                                ? 'bg-indigo-300 cursor-not-allowed text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        {stream.isStreaming
                            ? `⟳ Generating... (${stream.submodules.length})`
                            : 'Generate Sub Plan'}
                    </button>
                </div>
                <p className="text-gray-600">{plan.description}</p>
            </div>

            {/* Streaming Panel */}
            <div className="max-w-3xl mx-auto">
                <StreamingPanel
                    submodules={stream.submodules}
                    status={stream.status}
                    isStreaming={stream.isStreaming}
                />
            </div>

            {/* Stream error */}
            {stream.error && (
                <div className="max-w-3xl mx-auto mb-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                        ⚠️ {stream.error}
                    </div>
                </div>
            )}

            {/* Sub Plans Table */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Sub Plans</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                    >
                        + Add Sub Plan
                    </button>
                </div>
                {subPlans.length === 0 && !stream.isStreaming ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-3">📋</div>
                        <p className="font-medium">No sub plans yet</p>
                        <p className="text-sm mt-1">Click &quot;Generate Sub Plan&quot; to create them automatically</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="text-left text-sm font-semibold text-gray-700">Sub Plan</th>
                                    <th className="text-left text-sm font-semibold text-gray-700">Estimated End Date</th>
                                    <th className="text-center text-sm font-semibold text-gray-700">Completed</th>
                                    <th className="text-center text-sm font-semibold text-gray-700">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subPlans.map((sub) => (
                                    <tr key={sub.id} className="bg-gray-50 rounded-lg shadow-sm">
                                        <td className="py-3 px-4 font-medium text-gray-800" title={sub.name}>
                                            {sub.name?.length > 39 ? `${sub.name.substring(0, 39)}...` : sub.name}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{sub.estimatedEndDate}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleToggleComplete(sub)}
                                                className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                                                title={sub.completed ? "Mark as incomplete" : "Mark as completed"}
                                            >
                                                {sub.completed ? (
                                                    <CheckSquare className="text-green-500 w-5 h-5 mx-auto hover:text-green-600 transition-colors" />
                                                ) : (
                                                    <Square className="text-gray-300 w-5 h-5 mx-auto hover:text-gray-400 transition-colors" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Link
                                                href={`/Plans/${courseId}/${planId}/${sub.id}`}
                                                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <AddSubPlanModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAddSubPlan}
            />
        </div>
    );
}
