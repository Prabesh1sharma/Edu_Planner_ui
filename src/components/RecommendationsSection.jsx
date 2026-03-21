'use client'
import { useState, useEffect } from 'react';
import { Play, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { getRecommendations, searchAndSaveVideos } from '../api/youtubeApi';

export default function RecommendationsSection({ courseId, planId, subplanId }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const data = await getRecommendations(subplanId);
            setVideos(data.videos || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
            // Don't show error if it's just "not found" (will show generate button)
            if (err.message !== 'Not found' && !err.message.includes('404')) {
                setError('Failed to load recommendations');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setGenerating(true);
            setError(null);
            const data = await searchAndSaveVideos(courseId, planId, subplanId);
            setVideos(data.videos || []);
        } catch (err) {
            console.error('Failed to generate recommendations:', err);
            setError('Failed to generate recommendations. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        if (subplanId) {
            fetchVideos();
        }
    }, [subplanId]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                <p className="text-gray-500 font-medium">Fetching recommendations...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Learning Resources
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Handpicked YouTube videos for this topic</p>
                </div>
                
                {videos.length > 0 && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Refresh Recommendations
                    </button>
                )}
            </div>

            <div className="p-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <Play className="w-8 h-8 text-indigo-500 ml-1" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need some extra help?</h3>
                        <p className="text-gray-500 max-w-sm mb-6 text-sm">
                            We can find the best YouTube tutorials and deep dives specifically for this subplan topic.
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all ${
                                generating 
                                ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95'
                            }`}
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Finding best videos...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Recommendations
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, idx) => (
                            <a
                                key={video.video_id || idx}
                                href={video.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img 
                                        src={video.thumbnail} 
                                        alt={video.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                                        YouTube
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2 leading-tight">
                                        {video.title}
                                    </h4>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-[12px] text-gray-500 font-medium truncate max-w-[120px]">
                                            {video.channel}
                                        </span>
                                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
