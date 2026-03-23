'use client'
import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, BookOpen, Code, Target, Plus, Loader2, ChevronLeft, ChevronRight, Filter, PenTool, Edit } from 'lucide-react';
import { getActivities } from '../../api/activityApi';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/navigation';

const ACTIVITY_CONFIG = {
    course_created: {
        icon: Plus,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        label: 'Course Created',
    },
    plan_created: {
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        label: 'Plan Created',
    },
    subplan_created: {
        icon: BookOpen,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        label: 'Subplan Created',
    },
    plan_completed: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        label: 'Plan Completed',
    },
    subplan_completed: {
        icon: Code,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        label: 'Subplan Completed',
    },
    notebook_created: {
        icon: PenTool,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        label: 'Note Created',
    },
    notebook_updated: {
        icon: Edit,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        label: 'Note Updated',
    },
};

const ACTIVITY_TYPES = [
    { value: '', label: 'All Activities' },
    { value: 'course_created', label: 'Course Created' },
    { value: 'plan_created', label: 'Plan Created' },
    { value: 'subplan_created', label: 'Subplan Created' },
    { value: 'plan_completed', label: 'Plan Completed' },
    { value: 'subplan_completed', label: 'Subplan Completed' },
    { value: 'notebook_created', label: 'Note Created' },
    { value: 'notebook_updated', label: 'Note Updated' },
];

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

function formatDate(dateString) {
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');
    const limit = 10;
    const router = useRouter();

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getActivities(page, limit, typeFilter || null);
            setActivities(data.activities || []);
            setPagination(data.pagination || null);
        } catch (err) {
            console.error('Failed to fetch activities:', err);
        } finally {
            setLoading(false);
        }
    }, [page, typeFilter]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleFilterChange = (newType) => {
        setTypeFilter(newType);
        setPage(1);
    };

    const goToPage = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="ml-16 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">All Activities</h1>
                                <p className="text-gray-600 mt-1">
                                    {pagination ? `${pagination.total} total activities` : 'Loading...'}
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/home')}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <Filter size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filter by type:</span>
                            <div className="flex flex-wrap gap-2">
                                {ACTIVITY_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => handleFilterChange(type.value)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                            typeFilter === type.value
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity List */}
                    <div className="bg-white rounded-lg shadow-lg">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="animate-spin text-indigo-500" size={28} />
                                <span className="ml-3 text-gray-500">Loading activities...</span>
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-3">
                                    <BookOpen size={40} className="mx-auto" />
                                </div>
                                <p className="text-gray-500 font-medium">No activities found</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {typeFilter ? 'Try a different filter' : 'Start learning to see your activities here!'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {activities.map((activity) => {
                                    const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.course_created;
                                    const IconComponent = config.icon;
                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-start space-x-4 p-5 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className={`${config.bgColor} p-2.5 rounded-lg flex-shrink-0`}>
                                                <IconComponent size={18} className={config.color} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {activity.title}
                                                    </p>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {activity.description}
                                                </p>
                                                <div className="flex items-center mt-2 space-x-4">
                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <Clock size={12} className="mr-1" />
                                                        {getRelativeTime(activity.created_at)}
                                                    </div>
                                                    <span className="text-xs text-gray-300">
                                                        {formatDate(activity.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.total_pages > 1 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">
                                    Page {pagination.page} of {pagination.total_pages}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => goToPage(page - 1)}
                                        disabled={!pagination.has_prev}
                                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            pagination.has_prev
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        <ChevronLeft size={16} className="mr-1" />
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.total_pages <= 5) {
                                                pageNum = i + 1;
                                            } else if (page <= 3) {
                                                pageNum = i + 1;
                                            } else if (page >= pagination.total_pages - 2) {
                                                pageNum = pagination.total_pages - 4 + i;
                                            } else {
                                                pageNum = page - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => goToPage(pageNum)}
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                        page === pageNum
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => goToPage(page + 1)}
                                        disabled={!pagination.has_next}
                                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            pagination.has_next
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        Next
                                        <ChevronRight size={16} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
