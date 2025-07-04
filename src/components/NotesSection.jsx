'use client'
import { useState } from 'react';

export default function NotesSection() {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState([
        { id: 1, topic: "Flexbox & Grid", description: "Remember to review Flexbox and Grid layouts." },
        { id: 2, topic: "Responsive Practice", description: "Practice with at least 2 responsive layouts." }
    ]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTopic, setEditTopic] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Add note
    const handleAddNote = (e) => {
        e.preventDefault();
        if (!topic.trim() || !description.trim()) return;
        setNotes([{ id: Date.now(), topic, description }, ...notes]);
        setTopic('');
        setDescription('');
    };

    // Open modal
    const openModal = (note) => {
        setSelectedNote(note);
        setEditTopic(note.topic);
        setEditDescription(note.description);
        setIsEditing(false);
    };

    // Save edit
    const handleEditSave = () => {
        setNotes(notes.map(n =>
            n.id === selectedNote.id ? { ...n, topic: editTopic, description: editDescription } : n
        ));
        setSelectedNote({ ...selectedNote, topic: editTopic, description: editDescription });
        setIsEditing(false);
    };

    // Close modal
    const closeModal = () => {
        setSelectedNote(null);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8 mb-8">
            {/* Add Note Form */}
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-indigo-700 mb-2">Add Note</h2>
                <form onSubmit={handleAddNote} className="space-y-3">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Note Topic"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        required
                    />
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        rows={4}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Note Description"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                        Save Note
                    </button>
                </form>
            </div>
            {/* Notes List */}
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-indigo-700 mb-2">Saved Notes</h2>
                <ul className="space-y-3">
                    {notes.map(n => (
                        <li
                            key={n.id}
                            className="bg-indigo-50 rounded p-3 text-gray-800 shadow-sm cursor-pointer hover:bg-indigo-100 transition"
                            onClick={() => openModal(n)}
                        >
                            <span className="font-semibold">{n.topic}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal */}
            {selectedNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-4 text-gray-400 hover:text-indigo-600 text-2xl"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        {isEditing ? (
                            <>
                                <h3 className="text-lg font-bold text-indigo-700 mb-4">Edit Note</h3>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    value={editTopic}
                                    onChange={e => setEditTopic(e.target.value)}
                                />
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    rows={4}
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <button
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                                        onClick={handleEditSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg transition"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-indigo-700 mb-2">{selectedNote.topic}</h3>
                                <p className="text-gray-700 mb-4">{selectedNote.description}</p>
                                <button
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-lg transition"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
