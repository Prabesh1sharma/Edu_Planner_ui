'use client'
import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../../components/navbar';
import AddSubPlanModal from '../../../../components/AddSubPlanModal';

export default function SubPlanPage() {
    const plan = {
        name: "Frontend Basics",
        description: "Learn the essential building blocks of web development including HTML, CSS, and JavaScript.",
    };

    const [subPlans, setSubPlans] = useState([
        {
            id: 1,
            name: "HTML & CSS",
            description: "Learn HTML structure and CSS styling.",
            estimatedEndDate: "2024-08-10",
            completed: true,
        },
        {
            id: 2,
            name: "JavaScript Essentials",
            description: "Master JavaScript fundamentals.",
            estimatedEndDate: "2024-08-20",
            completed: false,
        },
        {
            id: 3,
            name: "Responsive Design",
            description: "Understand responsive layouts.",
            estimatedEndDate: "2024-08-30",
            completed: false,
        },
    ]);
    const [showModal, setShowModal] = useState(false);

    const handleAddSubPlan = (newSubPlan) => {
        setSubPlans([...subPlans, newSubPlan]);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <Navbar />
            {/* Plan Topic and Description */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-extrabold text-gray-900">{plan.name}</h1>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                        Generate Sub Plan
                    </button>
                </div>
                <p className="text-gray-600">{plan.description}</p>

            </div>

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
                                    <td className="py-3 px-4 font-medium text-gray-800">{sub.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{sub.estimatedEndDate}</td>
                                    <td className="py-3 px-4 text-center">
                                        {sub.completed ? (
                                            <CheckSquare className="text-green-500 w-5 h-5 mx-auto" />
                                        ) : (
                                            <Square className="text-gray-300 w-5 h-5 mx-auto" />
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            href={`/Plans/1/1/1`}
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
            </div>
            <AddSubPlanModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAddSubPlan}
            />
        </div>
    );
}
