'use client'
import { useState, useEffect } from 'react'
import Navbar from '../../components/navbar'
import Metrics from '../../components/metrics'
import StreakChart from '../../components/streakChart'
import ActivityFeed from '../../components/ActivityFeed'
import { User, LogOut } from 'lucide-react'
import { getCurrentUser } from '../(auth)/authApi'
import { useRouter } from 'next/navigation'
import { useToast } from '../../context/ToastContext'

export default function Home() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { showError, showSuccess } = useToast()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const userData = await getCurrentUser()
                
                if (userData && userData.username) {
                    setUser(userData)
                } else {
                    showError('Failed to load user data')
                    router.push('/login')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
                showError('Authentication failed. Please login again.')
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [router, showError, showSuccess])

    // Function to clear all cookies
    const clearAllCookies = () => {
        const cookies = document.cookie.split(";")
        
        cookies.forEach((cookie) => {
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
            
            // Clear cookie for current path
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
            
            // Clear cookie for root domain (in case cookies were set with domain)
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`
            
            // Clear cookie for parent domain (in case of subdomain)
            const hostnameParts = window.location.hostname.split('.')
            if (hostnameParts.length > 2) {
                const parentDomain = `.${hostnameParts.slice(-2).join('.')}`
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${parentDomain};`
            }
        })
    }

    const handleLogout = async () => {
        // Clear all cookies
        clearAllCookies()
        
        showSuccess('Logged out successfully')
        
        // Delay redirect to show toast
        setTimeout(() => {
            router.push('/')
        }, 1000)
    }

    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null // This will briefly show while redirecting
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className="ml-16 p-3 sm:p-6">
                {/* Top Bar with Profile */}
                <div className="max-w-7xl mx-auto mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {user.name || user.username}!</p>
                        </div>
                        
                        {/* Profile Section */}
                        <div className="relative group">
                            <div className="flex items-center space-x-3 bg-white rounded-lg shadow-md px-4 py-2 cursor-pointer hover:shadow-lg transition-shadow duration-200">
                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        {getInitials(user.name || user.username)}
                                    </span>
                                </div>
                                <span className="text-gray-700 font-medium">
                                    {user.username}
                                </span>
                            </div>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                                <div className="py-2">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button 
                                        onClick={() => router.push('/profile')}
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200 w-full text-left"
                                    >
                                        <User size={16} />
                                        <span>Profile</span>
                                    </button>
                                    <hr className="my-1 border-gray-100" />
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200 w-full text-left"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto space-y-6">
                    <Metrics />
                    <StreakChart />
                    <ActivityFeed />
                </div>
            </main>
        </div>
    )
}
