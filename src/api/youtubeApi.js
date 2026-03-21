const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getHeaders } from '../apiUtils/Header';

/**
 * Fetches existing YouTube recommendations for a subplan.
 * @param {string} subplanId - The ID of the subplan.
 * @returns {Promise<{videos: Array}>}
 */
export const getRecommendations = async (subplanId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/youtube/recommendations/${subplanId}`, {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Failed to fetch recommendations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        throw error;
    }
};

/**
 * Searches YouTube and saves recommendations for a subplan.
 * @param {string} courseId 
 * @param {string} planId 
 * @param {string} subplanId 
 * @returns {Promise<{status: string, videos: Array}>}
 */
export const searchAndSaveVideos = async (courseId, planId, subplanId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/youtube/search/${courseId}/${planId}/${subplanId}`, {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Failed to generate recommendations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in searchAndSaveVideos:', error);
        throw error;
    }
};
