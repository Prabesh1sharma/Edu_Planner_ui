'use client'
import { useState } from 'react';

export type GeneratedPlan = {
    description: string;
    topics: string[];
    estimateDate: string;
};

type EduPlanFormProps = {
    onGenerate: (plan: GeneratedPlan) => void;
};

export default function EduPlanForm({ onGenerate }: EduPlanFormProps) {
    const [mode, setMode] = useState<'manual' | 'ai'>('manual');
    const [name, setName] = useState('');
    const [estimateDate, setEstimateDate] = useState('');
    const [description, setDescription] = useState('');
    const [topics, setTopics] = useState<string[]>(['']);
    
    // AI-specific inputs
    const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [timeCommitmentHours, setTimeCommitmentHours] = useState('');

    // For manual mode, allow user to add topics
    const handleTopicChange = (idx: number, value: string) => {
        const newTopics = [...topics];
        newTopics[idx] = value;
        setTopics(newTopics);
    };
    const addTopic = () => setTopics([...topics, '']);
    const removeTopic = (idx: number) => setTopics(topics.filter((_, i) => i !== idx));

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'manual') {
            onGenerate({
                description: description || `A comprehensive plan for ${name}`,
                topics: topics.filter(Boolean),
                estimateDate
            });
        } else {
            // Dummy AI generation logic (replace with API call later)
            // You can use difficultyLevel and timeCommitmentHours in your API call
            onGenerate({
                description: description || `AI-generated ${difficultyLevel} plan for ${name} (${timeCommitmentHours} hours/week)`,
                topics: [
                    'AI Introduction',
                    'AI Core Concepts',
                    'AI Project Work',
                    'AI Revision & Practice'
                ],
                estimateDate
            });
        }
    };

    return (
        <form onSubmit={handleGenerate} className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Create a New EduPlan</h2>
            
            {/* Mode Switcher */}
            <div className="flex gap-4 mb-4">
                <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-semibold border transition ${mode === 'manual' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                    onClick={() => setMode('manual')}
                >
                    Manually Generate Plan
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-semibold border transition ${mode === 'ai' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                    onClick={() => setMode('ai')}
                >
                    Generate Plan with AI
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. Full Stack Developer Journey"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion Date</label>
                <input
                    type="date"
                    value={estimateDate}
                    onChange={e => setEstimateDate(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Briefly describe your plan..."
                />
            </div>

            {/* AI-specific inputs */}
            {mode === 'ai' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                        <select
                            value={difficultyLevel}
                            onChange={e => setDifficultyLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Commitment (hours per week)</label>
                        <input
                            type="number"
                            value={timeCommitmentHours}
                            onChange={e => setTimeCommitmentHours(e.target.value)}
                            min="1"
                            max="168"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="e.g. 10"
                        />
                    </div>
                </>
            )}

            {/* Manual topic entry for manual mode */}
            {mode === 'manual' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topics</label>
                    <div className="space-y-2">
                        {topics.map((topic, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={e => handleTopicChange(idx, e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    placeholder={`Topic ${idx + 1}`}
                                />
                                {topics.length > 1 && (
                                    <button type="button" onClick={() => removeTopic(idx)} className="text-red-500 px-2 py-1 rounded hover:bg-red-50">Remove</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addTopic} className="text-indigo-600 hover:underline text-sm mt-1">+ Add Topic</button>
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
            >
                {mode === 'manual' ? 'Manually Create Plan' : 'Generate Plan with AI'}
            </button>
        </form>
    );
}
