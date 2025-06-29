// lib/api/auth.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    // Handle different error formats from your FastAPI backend
    const errorMessage = data.detail || data.error || data.message || `HTTP error! status: ${response.status}`
    throw new Error(errorMessage)
  }
  
  return {
    success: true,
    data: data,
    message: data.message || 'Operation successful'
  }
}

// Helper function to handle errors
const handleError = (error) => {
  return {
    success: false,
    error: error.message || 'Network error occurred',
    data: null
  }
}

// Login function - updated to match your FastAPI backend
export const login = async (credentials) => {
  try {
    // Transform the credentials to match your UserLogin model
    const loginData = {
      username: credentials['username/email'], // Your backend expects 'username' field
      password: credentials.password
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    return await handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

// Signup function
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    return await handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

