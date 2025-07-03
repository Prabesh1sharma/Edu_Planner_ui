export default function Metrics() {
    const metrics = [
        { label: "TODO", value: 15, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "COMPLETED", value: 10, color: "text-green-600", bg: "bg-green-50" },
        { label: "DUE", value: 2, color: "text-red-600", bg: "bg-red-50" },
        { label: "EFFICIENCY", value: "89%", color: "text-indigo-600", bg: "bg-indigo-50" },
    ];
    return (
        <div className="max-w-5xl mx-auto w-full mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col items-center justify-center ${metric.bg} rounded-2xl shadow p-6 hover:shadow-xl transition-shadow duration-200`}
                    >
                        <div className={`text-3xl font-extrabold ${metric.color}`}>{metric.value}</div>
                        <div className="mt-2 text-sm font-semibold text-gray-500 tracking-widest">{metric.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
