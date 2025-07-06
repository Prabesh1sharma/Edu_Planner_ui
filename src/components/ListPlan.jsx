// components/listplan.jsx
import Link from 'next/link';
export default function ListPlan({ open, onClose }) {
    // Dummy plans data
    const plans = [
        {
            title: "Software Engineer Journey",
            created: "2024-06-10",
            end: "2025-06-10",
            progress: 75
        },
        {
            title: "React Mastery",
            created: "2024-07-01",
            end: "2024-12-01",
            progress: 40
        },
        {
            title: "Next.js Bootcamp",
            created: "2024-08-15",
            end: "2024-11-15",
            progress: 20
        },
        {
            title: "Database Design Fundamentals",
            created: "2024-09-01",
            end: "2024-12-15",
            progress: 10
        }
    ];

    if (!open) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed left-16 top-0 h-full w-80 bg-white shadow-2xl z-50 p-6 transition-all duration-300 border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-indigo-700">Your Learning Plans</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-indigo-600 text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                    &times;
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search plans..."
                        className="w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>

            {/* Plans List */}
            <div className="flex-1 overflow-y-auto pr-2">
                <ul className="space-y-4">
                    {plans.map((plan, idx) => (
                        <li
                            key={idx}
                            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                    {plan.title}
                                </div>
                                <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                    {plan.progress}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                                    style={{ width: `${plan.progress}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between mt-3 text-xs text-gray-500">
                                <div>
                                    <div className="font-medium text-gray-600">Created</div>
                                    <div>{formatDate(plan.created)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-600">Est. End</div>
                                    <div>{formatDate(plan.end)}</div>
                                </div>
                            </div>

                            <div className="mt-3 flex space-x-2">
                                <Link
                                    href="/Plans/1"
                                    className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100">
                <Link
                    href="/create-plan"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create New Plan
                </Link>
            </div>
        </div>
    );
}
