'use client'
import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import AddPlanModal from './AddPlanModal';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PlanList({ plans, onAddPlan }) {
    const [showModal, setShowModal] = useState(false);
    const [localPlans, setLocalPlans] = useState(plans);
    const { planid } = useParams();

    const handleAdd = (plan) => {
        setLocalPlans([
            ...localPlans,
            {
                id: localPlans.length + 1,
                title: plan.title,
                completed: false,
                estimatedEndDate: plan.estimatedEndDate,
                subPlansCount: 0,
                subPlans: []
            }
        ]);
    };

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Plans</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                >
                    + Add Plan
                </button>
            </div>
            <ul className="space-y-4">
                {localPlans.map((plan) => (
                    <li
                        key={plan.id}
                        className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            {plan.completed ? (
                                <CheckSquare className="text-indigo-600 w-6 h-6" />
                            ) : (
                                <Square className="text-gray-300 w-6 h-6" />
                            )}
                            <div>
                                <div className="font-bold text-gray-900">{plan.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    Est. End: {plan.estimatedEndDate}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-xs text-gray-500 font-medium">
                                Sub Plans: {plan.subPlansCount}
                            </div>
                            <Link
                                href={`/Plans/${planid}/${plan.id}`}
                                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full transition-colors"
                            >
                                View Subplans
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
            <AddPlanModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAdd}
            />
        </div>
    );
}
