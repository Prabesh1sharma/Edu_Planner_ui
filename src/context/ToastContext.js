'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random()
    const newToast = { 
      id, 
      message: message || `${type} notification`, 
      type, 
      duration, 
      isVisible: true 
    }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, duration + 500) // Add extra time for animation
  }, [removeToast])

  const showSuccess = useCallback((message = 'Operation completed successfully!', duration = 4000) => {
    showToast(message, 'success', duration)
  }, [showToast])
  
  const showError = useCallback((message = 'An error occurred. Please try again.', duration = 5000) => {
    showToast(message, 'error', duration)
  }, [showToast])
  
  const showWarning = useCallback((message = 'Please check your input.', duration = 4500) => {
    showToast(message, 'warning', duration)
  }, [showToast])
  
  const showInfo = useCallback((message = 'Information updated.', duration = 4000) => {
    showToast(message, 'info', duration)
  }, [showToast])

  return (
    <ToastContext.Provider value={{ 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo, 
      showToast 
    }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ 
              zIndex: 1000 + index 
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              isVisible={toast.isVisible}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
