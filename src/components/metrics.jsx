export default function Metrics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Todo Block */}
            <div className="bg-blue-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                    <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">TODO</div>
                </div>
            </div>
            
            {/* Completed Block */}
            <div className="bg-green-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">10</div>
                    <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">COMPLETED</div>
                </div>
            </div>
            
            {/* Due Block */}
            <div className="bg-red-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">2</div>
                    <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">DUE</div>
                </div>
            </div>
            
            {/* Efficiency Block */}
            <div className="bg-indigo-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">89%</div>
                    <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">EFFICIENCY</div>
                </div>
            </div>
        </div>
    );
}
