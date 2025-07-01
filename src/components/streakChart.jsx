'use client'
import { useState } from 'react';

export default function StreakChart() {
    // Generate dummy data for the last 365 days
    const generateStreakData = () => {
        const data = [];
        const today = new Date();
        
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Random activity level (0-4) with some days having no activity
            const level = Math.random() > 0.25 ? Math.floor(Math.random() * 4) + 1 : 0;
            
            data.push({
                date: date.toISOString().split('T')[0],
                level: level,
                count: level === 0 ? 0 : level + Math.floor(Math.random() * 3),
                month: date.getMonth(),
                year: date.getFullYear()
            });
        }
        return data;
    };

    const [streakData] = useState(generateStreakData());
    
    // Get color intensity based on activity level
    const getColorClass = (level) => {
         const colors = [
            'bg-gray-100', // No activity
            'bg-blue-200', // Low activity
            'bg-blue-400', // Medium activity
            'bg-blue-600', // High activity
            'bg-blue-800'  // Very high activity
        ];
        return colors[level] || colors[0];
    };

    // Group data by weeks starting from Sunday
    const groupByWeeks = (data) => {
        const weeks = [];
        let currentWeek = [];
        
        data.forEach((day, index) => {
            const dayOfWeek = new Date(day.date).getDay(); // Sunday = 0, Monday = 1, etc.
            
            if (index === 0) {
                // Fill empty days at the beginning of first week
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
        
        // Add remaining days
        if (currentWeek.length > 0) {
            // Fill remaining slots with null
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }
        
        return weeks;
    };

    // Get month labels positioned correctly - Fixed to show all months
    const getMonthLabels = (weeks) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        let currentMonth = -1;
        const monthPositions = [];
        
        // First pass: find where each month starts
        weeks.forEach((week, weekIndex) => {
            const firstDay = week.find(day => day !== null);
            if (firstDay && firstDay.month !== currentMonth) {
                currentMonth = firstDay.month;
                monthPositions.push({
                    month: monthNames[firstDay.month],
                    weekIndex: weekIndex,
                    position: weekIndex * 18 // 12px square + 4px gap
                });
            }
        });
        
        // Calculate spacing to fit all months within chart width
        const chartWidth = weeks.length * 17; // Total chart width
        const availableWidth = chartWidth - 100; // Leave space for years
        const monthSpacing = availableWidth / (monthPositions.length - 1);
        
        // Create evenly spaced month labels
        monthPositions.forEach((month, index) => {
            labels.push({
                month: month.month,
                position: index * monthSpacing
            });
        });
        
        return labels;
    };

    const weeks = groupByWeeks(streakData);
    const monthLabels = getMonthLabels(weeks);
    const totalContributions = streakData.reduce((sum, day) => sum + day.count, 0);
    const currentStreak = streakData.slice(-30).filter(day => day.level > 0).length;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Learning Streak
                    </h2>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{totalContributions} activities in the last year</span>
                    <span className="text-green-600 font-medium">
                        🔥 {currentStreak} day streak
                    </span>
                </div>
            </div>
            
            {/* Chart Container */}
            <div className="relative bg-gray-50 rounded-lg p-4 border">
                {/* Month Labels */}
                <div className="relative h-4 mb-2">
                    <div className="absolute left-12 right-20">
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
                    <div className="flex flex-col justify-between text-xs text-gray-600 mr-2 font-medium" style={{ height: '105px' }}>
                        <div>Mon</div>
                        <div></div>
                        <div>Wed</div>
                        <div></div>
                        <div>Fri</div>
                        <div></div>
                        <div></div>
                    </div>
                    
                    {/* Streak Chart */}
                    <div className="flex gap-1">
                        {weeks.slice(0, 53).map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-1">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400 ${
                                            day ? getColorClass(day.level) : 'bg-transparent'
                                        }`}
                                        title={day ? `${day.date}: ${day.count} activities` : ''}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    
                    {/* Year Labels - Right side */}
                    <div className="flex flex-col justify-center ml-8 space-y-2" style={{ height: '105px' }}>
                        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                            2025
                        </div>
                        <div className="text-xs text-gray-500">2024</div>
                        <div className="text-xs text-gray-500">2023</div>
                        <div className="text-xs text-gray-500">2022</div>
                        <div className="text-xs text-gray-500">2021</div>
                    </div>
                </div>
                
                {/* Legend below the chart */}
                <div className="flex items-center justify-between mt-6">
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
