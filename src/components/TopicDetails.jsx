export default function TopicDetails({ topic }) {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{topic.name}</h1>
            <p className="text-gray-600 mb-6">{topic.description}</p>
            <div className="flex flex-wrap gap-8 text-base text-gray-500 mb-4">
                <div>
                    <span className="font-semibold">Created Date:</span> {topic.createdDate}
                </div>
                <div>
                    <span className="font-semibold">Estimated End Date:</span> {topic.estimatedEndDate}
                </div>
            </div>
            {/* Progress Bar with percentage after the bar */}
            <div className="mt-2 flex items-center gap-4">
                <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${topic.progress}%` }}
                        ></div>
                    </div>
                </div>
                <div className="text-indigo-700 font-semibold text-sm w-12 text-right">
                    {topic.progress}%
                </div>
            </div>
        </div>
    );
}
