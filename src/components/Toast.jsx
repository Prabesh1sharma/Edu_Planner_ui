'use client'
import { useState, useEffect } from 'react'

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose,
  isVisible = false
}) => {
  const [show, setShow] = useState(false)
  const [progressWidth, setProgressWidth] = useState(100)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      setProgressWidth(100)
      
      // Start progress animation
      const progressTimer = setTimeout(() => {
        setProgressWidth(0)
      }, 100)
      
      return () => {
        clearTimeout(progressTimer)
      }
    }
  }, [isVisible, duration])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const getToastStyles = () => {
    const baseStyles = "max-w-md w-full px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out relative overflow-hidden"
    
    if (type === 'success') {
      return `${baseStyles} bg-gradient-to-r from-emerald-500 to-green-600 text-white`
    } else if (type === 'error') {
      return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 text-white`
    } else if (type === 'warning') {
      return `${baseStyles} bg-gradient-to-r from-amber-500 to-orange-500 text-white`
    } else if (type === 'info') {
      return `${baseStyles} bg-gradient-to-r from-indigo-500 to-purple-600 text-white`
    }
    
    return baseStyles
  }

  const getIcon = () => {
    if (type === 'success') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    } else if (type === 'error') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    } else if (type === 'warning') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    } else if (type === 'info') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    }
    return null
  }

  if (!isVisible && !show) return null

  return (
    <div 
      className={`${getToastStyles()} ${
        show 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-center">
        {/* Icon */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        {/* Message */}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {message || 'Notification'}
          </p>
        </div>
        
        {/* Close button */}
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex text-white hover:text-white/80 focus:outline-none transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Bottom progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all ease-linear"
        style={{
          width: `${progressWidth}%`,
          transition: `width ${duration - 100}ms linear`
        }}
      />
    </div>
  )
}

export default Toast
