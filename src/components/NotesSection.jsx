'use client'
import { useState } from 'react';

export default function NotesSection() {
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([
        { id: 1, text: "Remember to review Flexbox and Grid." },
        { id: 2, text: "Practice with at least 2 responsive layouts." }
    ]);

    const handleAddNote = (e) => {
        e.preventDefault();
        if (!note.trim()) return;
        setNotes([{ id: Date.now(), text: note }, ...notes]);
        setNote('');
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8 mb-8">
            {/* Write Note */}
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-indigo-700 mb-2">Write Notes</h2>
                <form onSubmit={handleAddNote}>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        rows={4}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Write your note here..."
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                        Save Note
                    </button>
                </form>
            </div>
            {/* Saved Notes */}
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-indigo-700 mb-2">Saved Notes</h2>
                <ul className="space-y-3">
                    {notes.map(n => (
                        <li key={n.id} className="bg-indigo-50 rounded p-3 text-gray-800 shadow-sm">
                            {n.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
