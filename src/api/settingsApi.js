const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getHeaders } from '../apiUtils/Header';

/**
 * Fetches the current user's saved settings.
 * @returns {Promise<Object>} The user settings response.
 */
export const getUserSettings = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/me`, {
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
        console.error('Error in getUserSettings:', error);
        throw error;
    }
};

/**
 * Updates or creates the current user's settings.
 * @param {Object} settingsData - The settings data (youtube_api_key, ai_provider, ai_model, ai_api_key).
 * @returns {Promise<Object>} The update confirmation.
 */
export const updateUserSettings = async (settingsData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/update`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(settingsData),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateUserSettings:', error);
        throw error;
    }
};

/**
 * Returns a list of all supported AI providers and their models.
 * @returns {Promise<Object>} The providers and models configuration.
 */
export const getAvailableModels = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/models`, {
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
        console.error('Error in getAvailableModels:', error);
        throw error;
    }
};
