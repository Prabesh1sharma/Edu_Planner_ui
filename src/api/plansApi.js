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

/**
 * Fetches all subplans for a specific course and plan (module) from the API.
 * @param {string} courseId - The ID of the course.
 * @param {string} planId - The ID of the plan (module).
 * @returns {Promise<Object>} The subplans list.
 */
export const getCourseSubPlans = async (courseId, planId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/SubPlans/get_subplans/${courseId}/${planId}`, {
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
        console.error('Error in getCourseSubPlans:', error);
        throw error;
    }
};

/**
 * Fetches specific subplan details from the API.
 * @param {string} courseId - The ID of the course.
 * @param {string} planId - The ID of the plan.
 * @param {string} subplanId - The ID of the subplan.
 * @returns {Promise<Object>} The subplan details.
 */
export const getSubPlanDetail = async (courseId, planId, subplanId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/SubPlansDetail/${courseId}/${planId}/${subplanId}`, {
            method: 'GET',
            headers: getHeaders(true, { Accept: 'application/json' }),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getSubPlanDetail:', error);
        throw error;
    }
};

/**
 * Stream SSE from /SubPlans/create_structured_subplans
 *
 * @param {Object} payload
 * @param {string} payload.topic_id
 * @param {string} payload.module_id
 *
 * @param {Object} options
 * @param {(data: string) => void} [options.onMessage]
 * @param {() => void} [options.onComplete]
 * @param {(error: Error) => void} [options.onError]
 * @param {AbortSignal} [options.signal]
 *
 * @returns {Promise<void>}
 */
export const createStructuredSubPlansStream = async (
  { topic_id, module_id },
  { onMessage, onComplete, onError, signal } = {}
) => {
  const controller = new AbortController();
  const abortSignal = signal || controller.signal;

  const dispatchLines = (text) => {
    const lines = text.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith(':')) continue;

      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (data === '[DONE]') {
          if (typeof onComplete === 'function') onComplete();
          return true;
        }
        if (typeof onMessage === 'function') {
          onMessage(data);
        }
      }
    }
    return false;
  };

  try {
    const response = await fetch(`${API_BASE_URL}/SubPlans/create_structured_subplans`, {
      method: 'POST',
      headers: getHeaders(true, { Accept: 'text/event-stream' }),
      body: JSON.stringify({ topic_id, module_id }),
      signal: abortSignal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('SSE response body is not readable.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();

      if (value) {
        const textChunk = decoder.decode(value, { stream: !done });
        console.log('[stream-api] received chunk bytes:', value.byteLength, 'decoded text:', JSON.stringify(textChunk));
        buffer += textChunk;
      }

      if (done) {
        console.log('[stream-api] stream done. Remaining buffer:', JSON.stringify(buffer));
        if (buffer.trim()) {
          dispatchLines(buffer);
          buffer = '';
        }
        break;
      }

      const lastNewline = buffer.lastIndexOf('\n');
      if (lastNewline !== -1) {
        const complete = buffer.slice(0, lastNewline + 1);
        buffer = buffer.slice(lastNewline + 1);
        dispatchLines(complete);
      }
    }

    if (typeof onComplete === 'function') onComplete();

  } catch (error) {
    if (error?.name === 'AbortError') return;
    if (typeof onError === 'function') {
      onError(error);
    } else {
      console.error('createStructuredSubPlansStream error:', error);
    }
  } finally {
    controller.abort();
  }
};

/**
 * Toggles the completion status of a plan (module).
 * @param {string} module_id - The ID of the module.
 * @param {boolean} is_completed - The new completion status.
 * @returns {Promise<Object>} The response message.
 */
export const togglePlanCompletion = async (module_id, is_completed) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Plans/is_completed?module_id=${module_id}&is_completed=${is_completed}`, {
            method: 'POST',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in togglePlanCompletion:', error);
        throw error;
    }
};

/**
 * Toggles the completion status of a subplan (submodule).
 * @param {string} submodule_id - The ID of the submodule.
 * @param {string} module_id - The ID of the parent module.
 * @param {boolean} is_completed - The new completion status.
 * @returns {Promise<Object>} The response message.
 */
export const toggleSubPlanCompletion = async (submodule_id, module_id, is_completed) => {
    try {
        const response = await fetch(`${API_BASE_URL}/SubPlans/is_completed?submodule_id=${submodule_id}&module_id=${module_id}&is_completed=${is_completed}`, {
            method: 'POST',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in toggleSubPlanCompletion:', error);
        throw error;
    }
};
