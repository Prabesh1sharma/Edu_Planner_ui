'use client'
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Edit3, Plus, Trash2, BookOpen, Bold, Italic, Heading, List as ListIcon, Link as LinkIcon } from 'lucide-react';

export default function NotesSection() {
    const [notes, setNotes] = useState([
        { 
            id: 1, 
            topic: "CSS Fundamentals", 
            description: "## Flexbox & Grid\n\nRemember to review the core differences between **Flexbox** (1D layouts) and **Grid** (2D layouts).\n\n### Tasks:\n- [x] Complete basic Flexbox tutorial\n- [ ] Practice 2 responsive Grid layouts\n- [ ] Review CSS variables" 
        },
        { 
            id: 2, 
            topic: "Project Ideas", 
            description: "Some quick ideas for practice:\n1. A simple portfolio\n2. A weather app using fetching\n3. This **learning planner** app!" 
        }
    ]);
    
    // Modes: 'view', 'edit', 'create', null (empty state)
    const [activeMode, setActiveMode] = useState(null);
    const [selectedNoteId, setSelectedNoteId] = useState(null);

    // Form states
    const [editTopic, setEditTopic] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const textareaRef = useRef(null);

    const activeNote = notes.find(n => n.id === selectedNoteId);

    const insertMarkdown = (prefix, suffix = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = editDescription;

        const before = text.substring(0, start);
        const selected = text.substring(start, end) || 'text';
        const after = text.substring(end);

        const newText = before + prefix + selected + suffix + after;
        setEditDescription(newText);
        
        // Restore focus and cursor position after state updates
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + prefix.length,
                start + prefix.length + selected.length
            );
        }, 0);
    };

    const handleCreateNew = () => {
        setSelectedNoteId(null);
        setEditTopic('');
        setEditDescription('');
        setActiveMode('create');
    };

    const handleSelectNote = (id) => {
        setSelectedNoteId(id);
        setActiveMode('view');
    };

    const handleEditNote = () => {
        if (!activeNote) return;
        setEditTopic(activeNote.topic);
        setEditDescription(activeNote.description);
        setActiveMode('edit');
    };

    const handleSave = (e) => {
        e?.preventDefault();
        if (!editTopic.trim() || !editDescription.trim()) return;

        if (activeMode === 'create') {
            const newNote = { id: Date.now(), topic: editTopic, description: editDescription };
            setNotes([newNote, ...notes]);
            setSelectedNoteId(newNote.id);
            setActiveMode('view');
        } else if (activeMode === 'edit') {
            setNotes(notes.map(n =>
                n.id === selectedNoteId ? { ...n, topic: editTopic, description: editDescription } : n
            ));
            setActiveMode('view');
        }
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setNotes(notes.filter(n => n.id !== id));
        if (selectedNoteId === id) {
            setSelectedNoteId(null);
            setActiveMode(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 h-[600px] flex">
            {/* Left Sidebar - Note List */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Notes
                    </h2>
                    <button 
                        onClick={handleCreateNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg shadow transition"
                        title="New Note"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="overflow-y-auto flex-1 p-3 space-y-2">
                    {notes.length === 0 ? (
                        <div className="text-center p-6 text-gray-400 text-sm">
                            <p>No notes yet.</p>
                            <p>Click + to create one.</p>
                        </div>
                    ) : (
                        notes.map(n => (
                            <div 
                                key={n.id}
                                onClick={() => handleSelectNote(n.id)}
                                className={`cursor-pointer group flex items-start justify-between p-3 rounded-xl transition-all duration-200 ${
                                    selectedNoteId === n.id 
                                        ? 'bg-indigo-100 border border-indigo-200 shadow-sm' 
                                        : 'bg-white border border-gray-100 shadow-sm hover:border-indigo-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex-1 min-w-0 pr-2">
                                    <h3 className={`font-semibold text-sm truncate ${selectedNoteId === n.id ? 'text-indigo-800' : 'text-gray-800'}`}>
                                        {n.topic}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        {n.description.replace(/[#*`_~-]/g, '').substring(0, 40)}...
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(n.id, e)}
                                    className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 text-gray-400 hover:text-red-600 transition ${selectedNoteId === n.id ? 'opacity-100' : ''}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Pane - Content Area */}
            <div className="w-2/3 bg-white flex flex-col h-full">
                {!activeMode ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <BookOpen className="w-16 h-16 mb-4 text-gray-200" />
                        <p className="text-lg font-medium text-gray-500">Select a note to read</p>
                        <p className="text-sm">or create a new one to start writing</p>
                    </div>
                ) : activeMode === 'view' && activeNote ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0 shadow-sm z-10">
                            <h2 className="text-2xl font-extrabold text-gray-900">{activeNote.topic}</h2>
                            <button 
                                onClick={handleEditNote}
                                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold transition"
                            >
                                <Edit3 className="w-4 h-4" /> Edit
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 book-view">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {activeNote.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full bg-gray-50/50">
                        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800">
                                {activeMode === 'create' ? '✨ Create New Note' : '✏️ Edit Note'}
                            </h2>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        if (selectedNoteId) setActiveMode('view');
                                        else setActiveMode(null);
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                                >
                                    Save Note
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                placeholder="Note Title..."
                                value={editTopic}
                                onChange={e => setEditTopic(e.target.value)}
                            />
                            <div className="flex-1 min-h-[300px] bg-white border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 overflow-hidden flex flex-col">
                                <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 px-3 items-center">
                                    <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title="Bold">
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => insertMarkdown('_', '_')} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title="Italic">
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    <button type="button" onClick={() => insertMarkdown('### ', '')} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title="Heading">
                                        <Heading className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => insertMarkdown('- ', '')} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title="List">
                                        <ListIcon className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title="Link">
                                        <LinkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    className="w-full flex-1 p-4 resize-none bg-transparent focus:outline-none text-gray-700 font-mono text-sm leading-relaxed"
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    placeholder="Write your note here using Markdown... Try headings, lists, or code blocks!"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Typography Styles embedded to ensure Markdown looks rich without external plugins like @tailwindcss/typography */}
            <style>{`
                .book-view {
                    font-family: ui-sans-serif, system-ui, sans-serif;
                    color: #4b5563;
                    line-height: 1.6;
                    font-size: 0.875rem; /* text-sm */
                }
                .book-view h1, .book-view h2, .book-view h3, .book-view h4 {
                    color: #1f2937;
                    font-weight: 600; /* Lighter than before */
                    margin-top: 1.5em;
                    margin-bottom: 0.75em;
                    line-height: 1.3;
                }
                .book-view h1 { font-size: 2.25em; margin-top: 0; font-weight: 800; }
                .book-view h2 { font-size: 1.75em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; margin-top: 1.5em; font-weight: 700; }
                .book-view h3 { font-size: 1.35em; font-weight: 600; }
                .book-view h4 { font-size: 1.15em; font-weight: 600; }
                .book-view p { margin-top: 0; margin-bottom: 1em; }
                .book-view ul, .book-view ol {
                    margin-top: 0;
                    margin-bottom: 1em;
                    padding-left: 1.5em;
                }
                .book-view ul { list-style-type: disc; }
                .book-view ol { list-style-type: decimal; }
                .book-view li { margin-top: 0.3em; margin-bottom: 0.3em; }
                .book-view li::marker { color: #9ca3af; }
                .book-view a { color: #4f46e5; text-decoration: underline; text-underline-offset: 2px; }
                .book-view a:hover { color: #3730a3; }
                .book-view input[type="checkbox"] { margin-right: 0.5rem; accent-color: #4f46e5; }
                .book-view pre {
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    color: #374151;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    overflow-x: auto;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    font-size: 0.85em;
                    margin-top: 1.25em;
                    margin-bottom: 1.25em;
                }
                .book-view pre code {
                    background-color: transparent; padding: 0; color: inherit; border-radius: 0; border: none; font-size: inherit;
                }
                .book-view code {
                    background-color: #f3f4f6; color: #ef4444; padding: 0.2em 0.4em; border-radius: 0.25rem;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    font-size: 0.85em; border: 1px solid #e5e7eb; white-space: pre-wrap;
                }
                .book-view blockquote {
                    border-left: 3px solid #6366f1;
                    background-color: #eef2ff;
                    padding: 0.75rem 1rem;
                    color: #4b5563;
                    font-style: italic;
                    border-radius: 0 0.5rem 0.5rem 0;
                    margin-top: 1.25em;
                    margin-bottom: 1.25em;
                }
                .book-view blockquote p:last-child { margin-bottom: 0; }
                .book-view table { width: 100%; border-collapse: collapse; margin-top: 1.25em; margin-bottom: 1.25em; }
                .book-view th, .book-view td { border: 1px solid #e5e7eb; padding: 0.5em 0.75em; text-align: left; }
                .book-view th { background-color: #f9fafb; font-weight: 500; color: #111827; }
                .book-view tr:nth-child(even) { background-color: #f9fafb; }
            `}</style>
        </div>
    );
}
