'use client'
import { CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../../components/navbar';

export default function SubPlanPage() {
    // Dummy data for "Frontend Basics"
    const plan = {
        name: "Frontend Basics",
        description: "Learn the essential building blocks of web development including HTML, CSS, and JavaScript.",
    };

    const subPlans = [
        {
            id: 1,
            name: "HTML & CSS",
            estimatedEndDate: "2024-08-10",
            completed: true,
        },
        {
            id: 2,
            name: "JavaScript Essentials",
            estimatedEndDate: "2024-08-20",
            completed: false,
        },
        {
            id: 3,
            name: "Responsive Design",
            estimatedEndDate: "2024-08-30",
            completed: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <Navbar/>
            {/* Plan Topic and Description */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h1>
                <p className="text-gray-600">{plan.description}</p>
            </div>

            {/* Sub Plans Table */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sub Plans</h2>
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
        </div>
    );
}
