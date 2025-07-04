'use client'
import { useState } from 'react';

export default function AddSubPlanModal({ open, onClose, onAdd }) {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!topic.trim() || !description.trim() || !date) return;
        onAdd({
            id: Date.now(),
            name: topic,
            description,
            estimatedEndDate: date,
            completed: false
        });
        setTopic('');
        setDescription('');
        setDate('');
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-indigo-600 text-2xl"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h3 className="text-xl font-bold text-indigo-700 mb-6">Add Sub Plan</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Subplan Topic"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            rows={3}
                            placeholder="Subplan Description"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated End Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Add Sub Plan
                    </button>
                </form>
            </div>
        </div>
    );
}
