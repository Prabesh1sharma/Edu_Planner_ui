'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SubPlanDetail from '../../../../../components/SubPlanDetail';
import NotesSection from '../../../../../components/NotesSection';
import RecommendationsSection from '../../../../../components/RecommendationsSection';
import Navbar from '../../../../../components/navbar';
import { getSubPlanDetail } from '../../../../../api/plansApi';

interface SubPlanData {
    title: string;
    description: string;
    type: string;
    key_activities: string[];
    learning_outcomes: string[];
}

export default function SubPlanDetailPage() {
    const params = useParams();
    const courseId = params.planid as string;
    const planId = params.subplanid as string;
    const subplanId = params.subplandetailid as string;

    const [subplan, setSubplan] = useState<SubPlanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!courseId || !planId || !subplanId) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                const data = await getSubPlanDetail(courseId, planId, subplanId) as Record<string, unknown>;
                
                // Exclude the IDs and map 'name' to 'title' for the UI component
                setSubplan({
                    title: data.name as string,
                    description: data.description as string,
                    type: data.type as string,
                    key_activities: data.key_activities as string[],
                    learning_outcomes: data.learning_outcomes as string[],
                });
                setError(null);
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Failed to fetch subplan details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [courseId, planId, subplanId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    if (error || !subplan) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center py-20 px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Details</h2>
                        <p className="text-gray-600 mb-6">{error || 'Subplan not found'}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:ml-16">
            <Navbar />
            <div className="max-w-5xl mx-auto space-y-8 mt-10 px-4">
                <SubPlanDetail subplan={subplan} />
                <NotesSection 
                    courseId={courseId} 
                    topicId={planId} 
                    subplanId={subplanId} 
                />
                <RecommendationsSection 
                    courseId={courseId} 
                    planId={planId} 
                    subplanId={subplanId} 
                />
            </div>
        </div>
    );
}
