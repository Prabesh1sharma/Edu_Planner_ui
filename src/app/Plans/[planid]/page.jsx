'use client';
import TopicDetails from '../../../components/TopicDetails';
import Navbar from '../../../components/navbar';
import TopicMetrics from '../../../components/topicMetrics';
import PlanList from '../../../components/PlanList';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCourseDetail, getCoursePlans } from '../../../api/plansApi';

const initialPlans = [];

export default function PlanPage() {
    const { planid } = useParams();
    const [topic, setTopic] = useState(null);
    const [planList, setPlanList] = useState(initialPlans);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!planid) return;

            try {
                setLoading(true);

                // Fetch course details and plans in parallel
                const [detailData, plansData] = await Promise.all([
                    getCourseDetail(planid),
                    getCoursePlans(planid)
                ]);

                setTopic({
                    name: detailData.topic,
                    description: detailData.description,
                    createdDate: detailData.start_date,
                    estimatedEndDate: detailData.end_date,
                    progress: detailData.progress_percentage,
                    completed: detailData.completed,
                    todo: detailData.todo,
                    due: detailData.due,
                    efficiency: detailData.efficency
                });

                if (plansData && plansData.modules) {
                    setPlanList(plansData.modules.map(module => ({
                        id: module.plan_id,
                        module_number: module.module_number,
                        title: module.name,
                        completed: module.completed,
                        estimatedEndDate: module.end_date,
                        subPlansCount: module.subplans_count,
                        subPlans: []
                    })));
                }

                setError(null);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError(err.message || 'Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [planid]);

    const handleAddPlan = () => {
        alert("Add Plan clicked!");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <Navbar />
                <main className="flex-1 ml-16 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Loading plan details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <Navbar />
                <main className="flex-1 ml-16 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Plan</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navbar />
            <main className="flex-1 ml-16 py-10 px-6">
                {topic && <TopicDetails topic={topic} />}
                {topic && (
                    <TopicMetrics
                        completed={topic.completed}
                        todo={topic.todo}
                        due={topic.due}
                        efficiency={topic.efficiency}
                    />
                )}
                <PlanList plans={planList} onAddPlan={handleAddPlan} />
            </main>
        </div>
    );
}
