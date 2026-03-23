const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getHeaders } from '../apiUtils/Header';

/**
 * Fetches recent activities (last 7 days) for the dashboard widget.
 * @returns {Promise<{activities: Array}>}
 */
export const getRecentActivities = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Activity/recent`, {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getRecentActivities:', error);
        throw error;
    }
};

/**
 * Fetches paginated list of activities with optional type filter.
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string|null} type - Optional activity type filter
 * @returns {Promise<{activities: Array, pagination: Object}>}
 */
export const getActivities = async (page = 1, limit = 10, type = null) => {
    try {
        let url = `${API_BASE_URL}/Activity/list?page=${page}&limit=${limit}`;
        if (type) {
            url += `&type=${type}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getActivities:', error);
        throw error;
    }
};

/**
 * Fetches heatmap data for a specific year.
 * @param {number} year - The year to fetch data for
 * @returns {Promise<{heatmap: Array, total_activities: number, year: number}>}
 */
export const getHeatmapData = async (year) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Activity/heatmap?year=${year}`, {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getHeatmapData:', error);
        throw error;
    }
};

/**
 * Fetches streak data (current streak, longest streak).
 * @returns {Promise<{current_streak: number, longest_streak: number, total_active_days: number}>}
 */
export const getStreakData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Activity/streak`, {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getStreakData:', error);
        throw error;
    }
};

/**
 * Fetches available years for the year selector.
 * @returns {Promise<{years: Array<number>, current_year: number}>}
 */
export const getActivityYears = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Activity/years`, {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getActivityYears:', error);
        throw error;
    }
};
