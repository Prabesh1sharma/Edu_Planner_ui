const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getHeaders } from '../apiUtils/Header';

/**
 * Fetches all courses from the API.
 * @returns {Promise<{courses: Array}>} The list of courses.
 */
export const getAllCourses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Plans/get_all_courses`, {
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
        console.error('Error in getAllCourses:', error);
        throw error;
    }
};
