import { GeneratedPlan } from './EduPlanForm';

type GeneratedPlanPreviewProps = {
    plan: GeneratedPlan;
};

export default function GeneratedPlanPreview({ plan }: GeneratedPlanPreviewProps) {
    return (
        <div className="mt-8 max-w-xl mx-auto bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow">
            <h3 className="text-xl font-bold text-indigo-800 mb-2">Generated Plan</h3>
            <p className="text-gray-700 mb-3">{plan.description}</p>
            <div className="mb-3">
                <span className="font-semibold text-gray-600">Topics:</span>
                <ul className="list-disc ml-6 mt-1 text-gray-700">
                    {plan.topics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                    ))}
                </ul>
            </div>
            <div>
                <span className="font-semibold text-gray-600">Estimated Completion Date: </span>
                <span className="text-indigo-700">{plan.estimateDate}</span>
            </div>
        </div>
    );
}
