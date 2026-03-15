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
/**
 * Fetches specific course details from the API.
 * @param {string} courseId - The ID of the course to fetch.
 * @returns {Promise<Object>} The course details.
 */
export const getCourseDetail = async (courseId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Plans/course-detail/${courseId}`, {
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
        console.error('Error in getCourseDetail:', error);
        throw error;
    }
};

/**
 * Fetches all plans (modules) for a specific course from the API.
 * @param {string} courseId - The ID of the course to fetch plans for.
 * @returns {Promise<{course_id: string, modules: Array}>} The course modules.
 */
export const getCoursePlans = async (courseId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Plans/get_all_plans/${courseId}`, {
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
        console.error('Error in getCoursePlans:', error);
        throw error;
    }
};
/**
 * Fetches specific plan details for a course from the API.
 * @param {string} courseId - The ID of the course.
 * @param {string} planId - The ID of the plan.
 * @returns {Promise<Object>} The plan details.
 */
export const getPlanDetails = async (courseId, planId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Plans/get_plan_details/${courseId}/${planId}`, {
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
        console.error('Error in getPlanDetails:', error);
        throw error;
    }
};
