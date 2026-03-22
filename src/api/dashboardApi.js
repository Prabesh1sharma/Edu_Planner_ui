const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getHeaders } from '../apiUtils/Header';

/**
 * Fetches dashboard metrics from the API.
 * @returns {Promise<Object>} The dashboard metrics containing completed, todo, due, and efficency.
 */
export const getDashboardMetrics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Dashboard/metrics`, {
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
        console.error('Error in getDashboardMetrics:', error);
        throw error;
    }
};
