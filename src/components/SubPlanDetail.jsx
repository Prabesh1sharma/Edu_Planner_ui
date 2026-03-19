export default function SubPlanDetail({ subplan }) {
    // A little map for the type styling
    const getTypeStyles = (type) => {
        const types = {
            reading: 'bg-blue-100 text-blue-800 border-blue-200',
            practice: 'bg-green-100 text-green-800 border-green-200',
            exercise: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            review: 'bg-purple-100 text-purple-800 border-purple-200',
            quiz: 'bg-red-100 text-red-800 border-red-200',
            project: 'bg-pink-100 text-pink-800 border-pink-200',
        };
        return types[type?.toLowerCase()] || 'bg-indigo-100 text-indigo-800 border-indigo-200';
    };

    return (
        <div className="bg-white rounded-2xl shadow p-8 mb-6 border border-gray-100">
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">{subplan.title}</h1>
                {subplan.type && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border ${getTypeStyles(subplan.type)}`}>
                        {subplan.type}
                    </span>
                )}
            </div>

            {subplan.description && (
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {subplan.description}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subplan.learning_outcomes && subplan.learning_outcomes.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span></span> Learning Outcomes
                        </h3>
                        <ul className="space-y-3">
                            {subplan.learning_outcomes.map((outcome, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                                    <span className="text-gray-700 font-medium">{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {subplan.key_activities && subplan.key_activities.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span></span> Key Activities
                        </h3>
                        <ul className="space-y-3">
                            {subplan.key_activities.map((activity, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">●</span>
                                    <span className="text-gray-700 font-medium">{activity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
