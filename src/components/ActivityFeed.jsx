import { Clock, CheckCircle, BookOpen, Code, Target, Plus, Edit } from 'lucide-react';

export default function ActivityFeed() {
    const dummyActivities = [
        {
            id: 1,
            type: 'completed',
            title: 'Completed Next.js Routing',
            description: 'Finished learning dynamic routes and API routes in Next.js framework',
            time: '2 hours ago',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            id: 2,
            type: 'created',
            title: 'Created React Plan',
            description: 'Set up a comprehensive React learning roadmap with 15 topics',
            time: '5 hours ago',
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            id: 3,
            type: 'studied',
            title: 'Studied Component Lifecycle',
            description: 'Deep dive into React hooks and lifecycle methods',
            time: '1 day ago',
            icon: BookOpen,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            id: 4,
            type: 'completed',
            title: 'Completed JavaScript ES6',
            description: 'Mastered arrow functions, destructuring, and modules',
            time: '2 days ago',
            icon: Code,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            id: 5,
            type: 'updated',
            title: 'Updated CSS Grid Plan',
            description: 'Added advanced layout techniques and responsive design',
            time: '3 days ago',
            icon: Edit,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
        },
        {
            id: 6,
            type: 'created',
            title: 'Created Database Design Plan',
            description: 'Outlined learning path for SQL and NoSQL databases',
            time: '4 days ago',
            icon: Plus,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Recent Activities
                </h2>
                <span className="text-sm text-gray-500">
                    Last 7 days
                </span>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {dummyActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <div className={`${activity.bgColor} p-2 rounded-lg flex-shrink-0`}>
                                <IconComponent size={16} className={activity.color} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {activity.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {activity.description}
                                </p>
                                <div className="flex items-center mt-2 text-xs text-gray-400">
                                    <Clock size={12} className="mr-1" />
                                    {activity.time}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
                    View all activities →
                </button>
            </div>
        </div>
    );
}
