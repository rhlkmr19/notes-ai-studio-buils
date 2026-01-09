import React, { useState, useEffect } from 'react';
import { Note, NoteColor, NoteCategory, ViewMode } from './types';
import { getNotes, saveNotes, hasMasterPin, saveMasterPin, getMasterPin } from './services/storage';
import { NoteCard } from './components/NoteCard';
import { Editor } from './components/Editor';
import { SplashScreen } from './components/SplashScreen';
import { Drawer } from './components/Drawer';
import { PinModal } from './components/PinModal';
import { Plus, Search, Menu, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Settings & Security State
  const [selectedCategory, setSelectedCategory] = useState<string>(NoteCategory.ALL);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [pinState, setPinState] = useState({ hasPin: false }); // Using object to force re-render on change
  
  // PIN Modal State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'set' | 'unlock'>('set');
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadedNotes = getNotes();
    setNotes(loadedNotes);
    setPinState({ hasPin: hasMasterPin() });
  }, []);

  const filteredNotes = notes
    .filter(n => {
       const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
       const matchesCategory = selectedCategory === NoteCategory.ALL || n.category === selectedCategory;
       return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.isPinned === b.isPinned) return b.updatedAt - a.updatedAt;
      return a.isPinned ? -1 : 1;
    });

  const createNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color: NoteColor.DEFAULT,
      isPinned: false,
      isLocked: false,
      category: NoteCategory.PERSONAL
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (updatedNote: Note) => {
    const newNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    saveNotes(newNotes);
    setActiveNoteId(null);
  };

  // Drawer Actions
  const handleClearAll = () => {
    if (confirm("Are you sure?")) {
        setNotes([]);
        saveNotes([]);
        setIsSidebarOpen(false);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "material_notes_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setIsSidebarOpen(false);
  };

  // PIN Logic
  const handleNoteClick = (note: Note) => {
      if (note.isLocked) {
          setPendingNoteId(note.id);
          setPinModalMode('unlock');
          setIsPinModalOpen(true);
      } else {
          setActiveNoteId(note.id);
      }
  };

  const handleOpenSetPin = () => {
      setPinModalMode('set');
      setIsPinModalOpen(true);
      setIsSidebarOpen(false);
  };

  const handlePinSuccess = (pin: string) => {
      if (pinModalMode === 'set') {
          saveMasterPin(pin);
          setPinState({ hasPin: true });
          alert("Master PIN set successfully! You can now lock your notes.");
          setIsPinModalOpen(false);
      } else if (pinModalMode === 'unlock') {
          const storedPin = getMasterPin();
          if (pin === storedPin) {
              setIsPinModalOpen(false);
              if (pendingNoteId) {
                  setActiveNoteId(pendingNoteId);
                  setPendingNoteId(null);
              }
          } else {
              alert("Incorrect PIN");
          }
      }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  if (isLoading) return <SplashScreen />;

  if (activeNote) {
    return (
      <Editor 
        note={activeNote} 
        hasPin={pinState.hasPin}
        onSave={updateNote} 
        onBack={() => setActiveNoteId(null)}
        onDelete={deleteNote}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf2f8] text-gray-900 pb-24 relative transition-colors duration-500">
      
      <Drawer 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        noteCount={notes.length}
        hasPin={pinState.hasPin}
        onClearAll={handleClearAll}
        onExport={handleExport}
        onSetPin={handleOpenSetPin}
      />

      <PinModal 
        isOpen={isPinModalOpen}
        mode={pinModalMode}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Header Area with Gradient & Glassmorphism */}
      <div className="sticky top-0 z-20 bg-[#fdf2f8]/80 backdrop-blur-md pt-4 pb-2 px-4 transition-all">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-3 rounded-full hover:bg-white/50 transition active:scale-95"
                >
                    <Menu size={24} className="text-gray-800"/>
                </button>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Notes</h1>
            </div>
             <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-3 rounded-full bg-white hover:shadow-md transition-all border border-pink-100 text-gray-600"
                 >
                    {viewMode === 'grid' ? <List size={20}/> : <LayoutGrid size={20}/>}
                 </button>
                 <button className="p-1 rounded-full border-2 border-white shadow-sm">
                    <img 
                        src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=ffdfbf" 
                        className="w-10 h-10 rounded-full" 
                        alt="Profile" 
                    />
                </button>
            </div>
        </div>
        
        {/* Search Input */}
        <div className="bg-white rounded-[2rem] flex items-center px-5 py-4 shadow-sm border border-pink-100 focus-within:shadow-lg focus-within:border-pink-200 transition-all duration-300 group mb-4">
          <Search size={22} className="text-gray-400 mr-3 group-focus-within:text-fuchsia-500 transition-colors" />
          <input
            type="text"
            placeholder="Search notes..."
            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400 font-medium text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {Object.values(NoteCategory).map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                        selectedCategory === cat 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200' 
                        : 'bg-white text-gray-500 border-pink-100 hover:bg-white hover:text-gray-800'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Notes Grid/List */}
      <div className="p-4 pt-2 min-h-[50vh]">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 opacity-60">
            <div className="bg-white p-8 rounded-[2.5rem] mb-6 shadow-sm border border-pink-50">
                <SlidersHorizontal size={48} className="text-fuchsia-300" />
            </div>
            <p className="text-xl font-semibold text-gray-700">No notes found</p>
            <p className="text-gray-400 mt-2">Create one to get started</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "columns-2 gap-4 md:columns-3 lg:columns-4 space-y-4" : "flex flex-col gap-1"}>
            {filteredNotes.map(note => (
                <NoteCard 
                    key={note.id} 
                    note={note} 
                    viewMode={viewMode}
                    onClick={handleNoteClick} 
                />
            ))}
          </div>
        )}
      </div>

      {/* Modern FAB */}
      <div className="fixed bottom-8 right-6 z-30">
        <button
          onClick={createNote}
          className="bg-gray-900 hover:bg-black active:scale-90 text-white w-18 h-18 p-5 rounded-[1.5rem] shadow-xl shadow-gray-400/50 flex items-center justify-center transition-all duration-300 group hover:-translate-y-1"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

    </div>
  );
};

export default App;