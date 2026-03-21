const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getHeaders } from '../apiUtils/Header';

/**
 * Fetches all notes for a specific subplan from the API.
 * @param {string} subplanId - The ID of the subplan.
 * @returns {Promise<Array>} The list of notes.
 */
export const getNotesBySubplan = async (subplanId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/subplan/${subplanId}`, {
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
        console.error('Error in getNotesBySubplan:', error);
        throw error;
    }
};

/**
 * Creates a new note.
 * @param {Object} noteData - The note data (course_id, topic_id, subplan_id, topic, notes).
 * @returns {Promise<Object>} The created note response.
 */
export const createNote = async (noteData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(noteData),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in createNote:', error);
        throw error;
    }
};

/**
 * Updates an existing note.
 * @param {string} noteId - The ID of the note to update.
 * @param {Object} updateData - The update data (topic, notes).
 * @returns {Promise<Object>} The updated note response.
 */
export const updateNote = async (noteId, updateData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateNote:', error);
        throw error;
    }
};

/**
 * Deletes a note.
 * @param {string} noteId - The ID of the note to delete.
 * @returns {Promise<Object>} The deletion confirmation.
 */
export const deleteNote = async (noteId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in deleteNote:', error);
        throw error;
    }
};
