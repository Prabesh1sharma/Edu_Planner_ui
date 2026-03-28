// components/listplan.jsx
'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllCourses } from '../api/plansApi';

export default function ListPlan({ open, onClose }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (open) {
            fetchCourses();
        }
    }, [open]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllCourses();
            setCourses(data.courses || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message || 'Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredCourses = courses.filter(course =>
        course.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`fixed z-40 bg-white shadow-2xl transition-all duration-300 border-gray-200 flex flex-col 
            bottom-16 left-0 w-full h-[calc(100%-4rem)] border-t rounded-t-2xl md:rounded-none md:border-t-0 md:border-l md:top-0 md:bottom-auto md:left-16 md:w-80 md:h-full
            ${open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:-translate-x-full'}
        `}>
            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-indigo-700">Your Learning Plans</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-indigo-600 text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                    &times;
                </button>
            </div>

            {/* Content area: need padding inside since we removed p-6 from parent */}
            <div className="flex-1 overflow-hidden flex flex-col p-6 pt-4">
                {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search plans..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                        <p className="text-sm text-gray-500">Loading courses...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-sm text-red-500 mb-3">{error}</p>
                        <button
                            onClick={fetchCourses}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-sm text-gray-500">
                            {searchQuery ? 'No courses match your search.' : 'No courses found. Create your first plan!'}
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {filteredCourses.map((course) => (
                            <li
                                key={course.course_id}
                                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors flex-1 mr-2">
                                        {course.topic}
                                    </div>
                                    <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full whitespace-nowrap">
                                        {course.progress_percentage}%
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 mt-1">
                                    {course.description.length > 50
                                        ? course.description.slice(0, 50) + "..."
                                        : course.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                                        style={{ width: `${course.progress_percentage}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between mt-3 text-xs text-gray-500">
                                    <div>
                                        <div className="font-medium text-gray-600">Start</div>
                                        <div>{formatDate(course.start_date)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-600">End</div>
                                        <div>{formatDate(course.end_date)}</div>
                                    </div>
                                </div>

                                <div className="mt-3 flex space-x-2">
                                    <Link
                                        href={`/Plans/${course.course_id}`}
                                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
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
        </div>
    );
}
