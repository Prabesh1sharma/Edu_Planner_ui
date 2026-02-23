const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
import { getHeaders } from '../../apiUtils/Header'

/**
 * Call the `/Plans/create_structured_plan` endpoint and stream back
 * Server-Sent Events (SSE).
 *
 * @param {Object} payload
 * @param {string} payload.topic
 * @param {string} payload.estimation_end_date   // e.g. "2025-12-31"
 * @param {string} payload.description
 * @param {string} payload.difficulty_level      // "beginner" | "intermediate" | "advanced"
 * @param {number} payload.time_commitment_hours_per_week
 *
 * @param {Object} options
 * @param {(data: string) => void} [options.onMessage]   Called for each SSE data chunk
 * @param {() => void} [options.onComplete]              Called when stream ends normally
 * @param {(error: Error) => void} [options.onError]     Called on error
 * @param {AbortSignal} [options.signal]                 Optional external abort signal
 *
 * @returns {Promise<void>}
 */


/**
 * Stream SSE from /Plans/create_structured_plan
 * KEY FIX: flush remaining buffer after stream closes — the last chunk
 * (containing modules + completed event) often arrives with done=true,
 * meaning the old code broke before processing it.
 */
export const createStructuredPlanStream = async (
  { topic, estimation_end_date, description, difficulty_level, time_commitment_hours_per_week },
  { onMessage, onComplete, onError, signal } = {}
) => {
  const controller = new AbortController()
  const abortSignal = signal || controller.signal

  // Helper: parse and dispatch all complete SSE lines from a text block
  const dispatchLines = (text) => {
    const lines = text.split('\n')
    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line || line.startsWith(':')) continue   // comment / keep-alive

      if (line.startsWith('data:')) {
        const data = line.slice(5).trim()
        if (data === '[DONE]') {
          if (typeof onComplete === 'function') onComplete()
          return true  // signals [DONE] was found
        }
        if (typeof onMessage === 'function') {
          onMessage(data)
        }
      }
    }
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/Plans/create_structured_plan`, {
      method: 'POST',
      headers: getHeaders(true, { Accept: 'text/event-stream' }),
      body: JSON.stringify({
        topic,
        estimation_end_date,
        description,
        difficulty_level,
        time_commitment_hours_per_week,
      }),
      signal: abortSignal
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || `Request failed with status ${response.status}`)
    }

    if (!response.body) {
      throw new Error('SSE response body is not readable.')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()

      if (value) {
        // Always decode and buffer incoming bytes
        buffer += decoder.decode(value, { stream: !done })
      }

      if (done) {
        // ✅ CRITICAL FIX: flush whatever remains in the buffer BEFORE exiting.
        // The final chunk — which often contains the last modules + completed event —
        // arrives with done=true. Old code broke here without processing it.
        if (buffer.trim()) {
          dispatchLines(buffer)
          buffer = ''
        }
        break
      }

      // Process all complete SSE messages in the buffer.
      // Keep the last incomplete line (no trailing \n) in the buffer.
      const lastNewline = buffer.lastIndexOf('\n')
      if (lastNewline !== -1) {
        const complete = buffer.slice(0, lastNewline + 1)
        buffer = buffer.slice(lastNewline + 1)
        dispatchLines(complete)
      }
    }

    if (typeof onComplete === 'function') onComplete()

  } catch (error) {
    if (error?.name === 'AbortError') return
    if (typeof onError === 'function') {
      onError(error)
    } else {
      console.error('createStructuredPlanStream error:', error)
    }
  } finally {
    controller.abort()
  }
}