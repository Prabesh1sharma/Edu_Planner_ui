const getCookie = (name) => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }
    return null
  }
  const getHeaders = (includeAuth = false, customHeaders = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    }
  
    if (includeAuth) {
      const token = getCookie('access_token')
      const tokenType = getCookie('token_type') || 'Bearer'
      
      if (token) {
        headers['Authorization'] = `${tokenType} ${token}`
      }
    }
  
    return headers
  }

// Check if user is authenticated
const isAuthenticated = () => {
  if (typeof document !== 'undefined') {
    const token = getCookie('access_token')
    return !!token // Return true if token exists, false otherwise
  }
  return false
}

export { getHeaders, isAuthenticated }