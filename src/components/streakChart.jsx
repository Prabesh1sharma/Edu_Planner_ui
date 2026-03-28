'use client'
import { useState, useEffect, useCallback } from 'react';
import { getHeatmapData, getStreakData, getActivityYears } from '../api/activityApi';

export default function StreakChart() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [streakInfo, setStreakInfo] = useState({ current_streak: 0, longest_streak: 0 });
    const [totalActivities, setTotalActivities] = useState(0);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState(null);

    const fetchYears = useCallback(async () => {
        try {
            const data = await getActivityYears();
            setYears(data.years || []);
            if (data.current_year) {
                setSelectedYear(data.current_year);
            }
        } catch (error) {
            console.error('Failed to fetch years:', error);
            setYears([new Date().getFullYear()]);
        }
    }, []);

    const fetchData = useCallback(async (year) => {
        try {
            setLoading(true);
            const [heatmap, streak] = await Promise.all([
                getHeatmapData(year),
                getStreakData(),
            ]);
            setHeatmapData(heatmap.heatmap || []);
            setTotalActivities(heatmap.total_activities || 0);
            setStreakInfo(streak);
        } catch (error) {
            console.error('Failed to fetch activity data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchYears();
    }, [fetchYears]);

    useEffect(() => {
        fetchData(selectedYear);
    }, [selectedYear, fetchData]);

    const getColorClass = (level) => {
        const colors = [
            'bg-gray-100',
            'bg-blue-200',
            'bg-blue-400',
            'bg-blue-600',
            'bg-blue-800'
        ];
        return colors[level] || colors[0];
    };

    const groupByWeeks = (data) => {
        const weeks = [];
        let currentWeek = [];

        data.forEach((day, index) => {
            const dayOfWeek = new Date(day.date).getDay();

            if (index === 0) {
                for (let i = 0; i < dayOfWeek; i++) {
                    currentWeek.push(null);
                }
            }

            currentWeek.push(day);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        return weeks;
    };

    const getMonthLabels = (weeks) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        let currentMonth = -1;
        const monthPositions = [];

        weeks.forEach((week, weekIndex) => {
            const firstDay = week.find(day => day !== null);
            if (firstDay && firstDay.month !== currentMonth) {
                currentMonth = firstDay.month;
                monthPositions.push({
                    month: monthNames[firstDay.month],
                    weekIndex: weekIndex,
                });
            }
        });

        const chartWidth = weeks.length * 17;
        const availableWidth = chartWidth - 100;
        const monthSpacing = monthPositions.length > 1 ? availableWidth / (monthPositions.length - 1) : 0;

        monthPositions.forEach((month, index) => {
            labels.push({
                month: month.month,
                position: index * monthSpacing,
            });
        });

        return labels;
    };

    if (loading && heatmapData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded mb-6"></div>
                    <div className="h-28 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const weeks = groupByWeeks(heatmapData);
    const monthLabels = getMonthLabels(weeks);

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Learning Streak
                    </h2>
                    {/* Year Selector - visible on all sizes, inline on mobile */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                                    selectedYear === year
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span>{totalActivities} activities in {selectedYear}</span>
                    <span className="text-green-600 font-medium">
                        🔥 {streakInfo.current_streak} day streak
                    </span>
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative bg-gray-50 rounded-lg p-3 sm:p-4 border">
                {/* Scrollable Chart Wrapper */}
                <div className="overflow-x-auto">
                    <div style={{ minWidth: '750px' }}>
                        {/* Month Labels */}
                        <div className="relative h-4 mb-2">
                            <div className="absolute left-12 right-4">
                                {monthLabels.map((label, index) => (
                                    <div
                                        key={index}
                                        className="absolute text-xs text-gray-600 font-medium"
                                        style={{
                                            left: `${label.position}px`,
                                            transform: 'translateX(-50%)'
                                        }}
                                    >
                                        {label.month}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Chart Area */}
                        <div className="flex">
                            {/* Weekday Labels */}
                            <div className="flex flex-col justify-between text-xs text-gray-600 mr-2 font-medium flex-shrink-0" style={{ height: '105px' }}>
                                <div>Mon</div>
                                <div></div>
                                <div>Wed</div>
                                <div></div>
                                <div>Fri</div>
                                <div></div>
                                <div></div>
                            </div>

                            {/* Streak Chart */}
                            <div className="flex gap-1 relative">
                                {weeks.slice(0, 53).map((week, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-1">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400 ${
                                                    day ? getColorClass(day.level) : 'bg-transparent'
                                                }`}
                                                onMouseEnter={(e) => {
                                                    if (day) {
                                                        const rect = e.target.getBoundingClientRect();
                                                        setTooltip({
                                                            x: rect.left + rect.width / 2,
                                                            y: rect.top - 8,
                                                            text: `${day.date}: ${day.count} ${day.count === 1 ? 'activity' : 'activities'}`,
                                                        });
                                                    }
                                                }}
                                                onMouseLeave={() => setTooltip(null)}
                                            />
                                        ))}
                                    </div>
                                ))}

                                {/* Tooltip */}
                                {tooltip && (
                                    <div
                                        className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg pointer-events-none whitespace-nowrap"
                                        style={{
                                            left: `${tooltip.x}px`,
                                            top: `${tooltip.y}px`,
                                            transform: 'translate(-50%, -100%)',
                                        }}
                                    >
                                        {tooltip.text}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend below the chart */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 sm:mt-6 gap-2">
                    <div className="text-xs text-gray-600">
                        <span>Streak helps to build habit</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                            <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                            <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                            <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                            <div className="w-3 h-3 rounded-sm bg-blue-800"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
