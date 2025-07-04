export default function SubPlanDetail({ subplan }) {
    return (
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{subplan.title}</h1>
            <p className="text-gray-600">{subplan.description}</p>
        </div>
    );
}
