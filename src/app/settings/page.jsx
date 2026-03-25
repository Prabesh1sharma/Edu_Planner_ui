'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import { useToast } from '@/context/ToastContext'
import { getUserSettings, updateUserSettings, getAvailableModels } from '@/api/settingsApi'
import { Save, Shield, Youtube, Cpu, Loader2, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
    const { showSuccess, showError } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [providers, setProviders] = useState({})
    const [showKeys, setShowKeys] = useState({ youtube: false, ai: false })

    const [formData, setFormData] = useState({
        youtube_api_key: '',
        ai_provider: '',
        ai_model: '',
        ai_api_key: ''
    })

    const [hasKeys, setHasKeys] = useState({
        youtube: false,
        ai: false
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [settingsRes, modelsRes] = await Promise.all([
                    getUserSettings(),
                    getAvailableModels()
                ])

                const settings = settingsRes.settings || settingsRes || {}
                if (settingsRes.status === 'success' || settings.ai_provider || settings.youtube_api_key_set) {
                    setFormData({
                        youtube_api_key: settings.youtube_api_key || '',
                        ai_provider: settings.ai_provider || '',
                        ai_model: settings.ai_model || '',
                        ai_api_key: settings.ai_api_key || ''
                    })
                    setHasKeys({
                        youtube: !!(settings.youtube_api_key_set || settings.has_youtube_key || settings.youtube_api_key),
                        ai: !!(settings.ai_api_key_set || settings.has_ai_key || settings.ai_api_key)
                    })
                }

                if (modelsRes.status === 'success') {
                    setProviders(modelsRes.providers || {})
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
                showError('Failed to load settings. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [showError])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleProviderChange = (e) => {
        const provider = e.target.value
        setFormData(prev => ({
            ...prev,
            ai_provider: provider,
            ai_model: providers[provider]?.[0] || ''
        }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)

            // Only send fields that have been explicitly changed (and aren't the mask value)
            const updateData = {}
            if (formData.youtube_api_key && formData.youtube_api_key !== '********') updateData.youtube_api_key = formData.youtube_api_key
            if (formData.ai_provider) updateData.ai_provider = formData.ai_provider
            if (formData.ai_model) updateData.ai_model = formData.ai_model
            if (formData.ai_api_key && formData.ai_api_key !== '********') updateData.ai_api_key = formData.ai_api_key

            const response = await updateUserSettings(updateData)

            if (response.status === 'success' || response.message?.toLowerCase().includes('success')) {
                showSuccess('🎉 Settings updated successfully!')
                // Refresh to get masked values back
                try {
                    const settingsRes = await getUserSettings()
                    const settings = settingsRes.settings || settingsRes || {}
                    if (settingsRes.status === 'success' || settings.ai_provider || settings.ai_api_key_set) {
                        setFormData({
                            youtube_api_key: settings.youtube_api_key || '',
                            ai_provider: settings.ai_provider || '',
                            ai_model: settings.ai_model || '',
                            ai_api_key: settings.ai_api_key || ''
                        })
                        setHasKeys({
                            youtube: !!(settings.youtube_api_key_set || settings.has_youtube_key),
                            ai: !!(settings.ai_api_key_set || settings.has_ai_key)
                        })
                    }
                } catch (fetchErr) {
                    console.error('Error refetching settings:', fetchErr)
                }
            } else {
                // If we got here but doesn't strictly match success, show a generic success if it's 200 OK
                showSuccess('Settings saved.')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            showError(`❌ Failed to update settings: ${error.message || 'Unknown error'}`)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your settings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="ml-16 p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
                        <p className="text-gray-600 mt-2">Manage your personal API keys and AI preferences. Personal settings override system defaults.</p>
                    </header>

                    <form onSubmit={handleSave} className="space-y-8">
                        {/* YouTube Settings */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <Youtube size={20} />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">YouTube Configuration</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        YouTube Data API Key
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type={showKeys.youtube ? "text" : "password"}
                                            name="youtube_api_key"
                                            value={formData.youtube_api_key}
                                            onChange={handleInputChange}
                                            placeholder="Enter your YouTube API Key"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowKeys(prev => ({ ...prev, youtube: !prev.youtube }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showKeys.youtube ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Used for fetching course-related videos and recommendations.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* AI Settings */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <Cpu size={20} />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">AI Preferences</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            AI Provider
                                        </label>
                                        <select
                                            name="ai_provider"
                                            value={formData.ai_provider}
                                            onChange={handleProviderChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Provider</option>
                                            {Object.keys(providers).map(p => (
                                                <option key={p} value={p}>
                                                    {p.charAt(0).toUpperCase() + p.slice(1).replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            AI Model
                                        </label>
                                        <select
                                            name="ai_model"
                                            value={formData.ai_model}
                                            onChange={handleInputChange}
                                            disabled={!formData.ai_provider}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none disabled:opacity-50"
                                        >
                                            <option value="">Select Model</option>
                                            {formData.ai_provider && providers[formData.ai_provider]?.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        AI API Key
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type={showKeys.ai ? "text" : "password"}
                                            name="ai_api_key"
                                            value={formData.ai_api_key}
                                            onChange={handleInputChange}
                                            placeholder="Enter your AI API Key"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowKeys(prev => ({ ...prev, ai: !prev.ai }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showKeys.ai ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        This key will be used for the selected provider. Encrypted at rest.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Settings</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <footer className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-start">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Security Note</h3>
                            <p className="text-sm text-blue-800/70 mt-1">
                                All API keys are encrypted before storage using industry-standard techniques. We never store keys in plain text, and they are only reachable by your account.
                            </p>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    )
}
