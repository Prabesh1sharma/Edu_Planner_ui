'use client'
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, BookOpen, Code, Target, Plus, Loader2, PenTool, Edit } from 'lucide-react';
import { getRecentActivities } from '../api/activityApi';
import { useRouter } from 'next/navigation';

const ACTIVITY_CONFIG = {
    course_created: {
        icon: Plus,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
    },
    plan_created: {
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    subplan_created: {
        icon: BookOpen,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    plan_completed: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    subplan_completed: {
        icon: Code,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
    },
    notebook_created: {
        icon: PenTool,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
    },
    notebook_updated: {
        icon: Edit,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
    },
};

function getRelativeTime(dateString) {
    const now = new Date();
    // Append Z to treat the stored UTC timestamp correctly
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return date.toLocaleDateString();
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const data = await getRecentActivities();
                setActivities(data.activities || []);
            } catch (err) {
                console.error('Failed to fetch recent activities:', err);
                setError('Failed to load activities');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
                    <span className="text-sm text-gray-500">Last 7 days</span>
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-indigo-500" size={24} />
                    <span className="ml-2 text-gray-500 text-sm">Loading activities...</span>
                </div>
            </div>
        );
    }

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

            {error ? (
                <div className="text-center py-8 text-red-500 text-sm">{error}</div>
            ) : activities.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <BookOpen size={32} className="mx-auto" />
                    </div>
                    <p className="text-gray-500 text-sm">No activities in the last 7 days</p>
                    <p className="text-gray-400 text-xs mt-1">Start learning to see your activities here!</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activities.map((activity) => {
                        const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.course_created;
                        const IconComponent = config.icon;
                        return (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <div className={`${config.bgColor} p-2 rounded-lg flex-shrink-0`}>
                                    <IconComponent size={16} className={config.color} />
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
                                        {getRelativeTime(activity.created_at)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => router.push('/activities')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                    View all activities →
                </button>
            </div>
        </div>
    );
}
