'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '../authApi';

// Helper function to set cookies
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

// Helper function to set cookie with expiration time
const setCookieWithExpiration = (name, value, expiresIn) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (expiresIn * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '', // This will handle both username and email
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Username or email is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    setErrors({}) // Clear any previous errors
    
    try {
      // Transform data to match API format
      const loginData = {
        'username/email': formData.identifier,
        password: formData.password
      }
      
      const result = await login(loginData)
      
      if (result.success) {
        // Handle successful login - store tokens in cookies
        console.log('Login successful:', result.message)
        
        // Store access token in cookies
        if (result.data.access_token) {
          if (result.data.expires_in) {
            // Use the actual expiration time from the API
            setCookieWithExpiration('access_token', result.data.access_token, result.data.expires_in);
          } else {
            // Default to 7 days if no expiration provided
            setCookie('access_token', result.data.access_token, 7);
          }
        }
        
        // Store refresh token in cookies (longer expiration)
        if (result.data.refresh_token) {
          setCookie('refresh_token', result.data.refresh_token, 30); // 30 days for refresh token
        }
        
        // Store token type
        if (result.data.token_type) {
          setCookie('token_type', result.data.token_type, 7);
        }
        
        // Store user data if available
        if (result.data.user) {
          setCookie('user', JSON.stringify(result.data.user), 7);
        }
        
        // Redirect to home page
        router.push('/')
        
      } else {
        // Handle API error - your backend returns error in different formats
        if (result.error.includes('Incorrect username or password')) {
          setErrors({ submit: 'Invalid username or password. Please try again.' })
        } else if (result.error.includes('User account is deactivated')) {
          setErrors({ submit: 'Your account has been deactivated. Please contact support.' })
        } else {
          setErrors({ submit: result.error })
        }
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Login error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">EduPlanner</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your educational journey
          </p>
        </div>

        {/* Success Message */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('message') && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  {new URLSearchParams(window.location.search).get('message')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username/Email Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.identifier ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your username or email"
              />
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md border border-red-200">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
