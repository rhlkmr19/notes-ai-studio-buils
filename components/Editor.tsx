import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteColor, AIActionType, NoteCategory } from '../types';
import { ArrowLeft, Trash2, Pin, Sparkles, Wand2, Check, Lock, Unlock, Mic, MicOff, Tag } from 'lucide-react';
import { performAIAction } from '../services/geminiService';

interface EditorProps {
  note: Note;
  hasPin: boolean;
  onSave: (note: Note) => void;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, hasPin, onSave, onBack, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [isLocked, setIsLocked] = useState(note.isLocked);
  const [category, setCategory] = useState(note.category || NoteCategory.PERSONAL);
  const [lastEdited, setLastEdited] = useState(note.updatedAt);
  
  // AI & Voice State
  const [isAILoading, setIsAILoading] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Refs
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Auto-save logic
    const timer = setTimeout(() => {
        handleSave();
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content, color, isPinned, isLocked, category]);

  // Voice Typing Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setContent(prev => prev + ' ' + finalTranscript);
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
             if(isListening) {
                 setIsListening(false); 
             }
        }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("Voice typing not supported in this browser.");
        return;
    }

    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    } else {
        recognitionRef.current.start();
        setIsListening(true);
    }
  };

  const handleToggleLock = () => {
      if (!hasPin && !isLocked) {
          alert("Please set a Master PIN in the settings (menu) before locking notes.");
          return;
      }
      setIsLocked(!isLocked);
  };

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title,
      content,
      color,
      isPinned,
      isLocked,
      category,
      updatedAt: Date.now(),
    };
    onSave(updatedNote);
    setLastEdited(Date.now());
  };

  const handleAIAction = async (action: AIActionType) => {
    if (!content) return;
    setIsAILoading(true);
    setShowAIMenu(false);
    try {
      const result = await performAIAction(content, action, title);
      if (action === 'summarize') setContent(prev => prev + "\n\n--- AI Summary ---\n" + result);
      else if (action === 'fix_grammar') setContent(result);
      else if (action === 'continue') setContent(prev => prev + " " + result);
    } catch (error) {
      alert("AI Action Failed. Check API Key.");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${color} transition-colors duration-500`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 pt-6 bg-white/30 backdrop-blur-md">
        <button 
          onClick={() => { handleSave(); onBack(); }}
          className="p-3 rounded-full hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>

        <div className="flex items-center gap-2">
           <button 
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' : 'hover:bg-black/5 text-gray-700'}`}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

           <button 
            onClick={handleToggleLock}
            className={`p-3 rounded-full transition-colors ${isLocked ? 'bg-fuchsia-100 text-fuchsia-600' : 'hover:bg-black/5 text-gray-700'}`}
          >
            {isLocked ? <Lock size={22} /> : <Unlock size={22} />}
          </button>

           <button 
            onClick={() => setIsPinned(!isPinned)}
            className={`p-3 rounded-full transition-colors ${isPinned ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-black/5 text-gray-700'}`}
          >
            <Pin size={22} className={isPinned ? 'fill-current' : ''} />
          </button>
          
          <button 
            onClick={() => setShowAIMenu(!showAIMenu)}
            className="p-3 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-purple-200 hover:shadow-xl transition-all relative"
          >
            <Sparkles size={20} className={isAILoading ? "animate-spin" : ""} />
            {showAIMenu && (
              <div className="absolute top-14 right-0 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-50 animate-in slide-in-from-top-4 fade-in">
                  <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">AI Tools</div>
                  <button onClick={() => handleAIAction('summarize')} className="flex items-center gap-3 p-3 w-full hover:bg-purple-50 rounded-2xl text-sm text-left text-gray-700 font-medium"><Check size={16} /> Summarize</button>
                  <button onClick={() => handleAIAction('fix_grammar')} className="flex items-center gap-3 p-3 w-full hover:bg-purple-50 rounded-2xl text-sm text-left text-gray-700 font-medium"><Check size={16} /> Fix Grammar</button>
                  <button onClick={() => handleAIAction('continue')} className="flex items-center gap-3 p-3 w-full hover:bg-purple-50 rounded-2xl text-sm text-left text-gray-700 font-medium"><Wand2 size={16} /> Continue</button>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
         <Tag size={16} className="text-gray-400 mr-1" />
         {Object.values(NoteCategory).filter(c => c !== 'All').map((cat) => (
             <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${category === cat ? 'bg-gray-800 text-white shadow-md' : 'bg-white/50 text-gray-600 border border-black/5'}`}
             >
                {cat}
             </button>
         ))}
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col overflow-y-auto px-6 pb-24 no-scrollbar pt-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent text-4xl font-bold text-gray-800 placeholder-gray-300 outline-none border-none mb-6 tracking-tight"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing or use voice..."
          className="w-full flex-1 bg-transparent text-lg text-gray-700 placeholder-gray-300 outline-none border-none resize-none leading-relaxed h-full font-medium"
        />
        <div className="text-xs text-gray-400 mt-4 text-center font-medium">
            Edited {new Date(lastEdited).toLocaleTimeString()}
        </div>
      </div>

      {/* Bottom Bar: Colors & Delete */}
      <div className="bg-white/60 backdrop-blur-xl border-t border-white/50 p-4 pb-8 flex items-center justify-between shadow-2xl">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mask-linear px-2">
          {Object.values(NoteColor).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${c} ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
            />
          ))}
        </div>
        <button 
          onClick={() => {
            if(confirm('Delete this note?')) onDelete(note.id);
          }}
          className="ml-4 p-4 rounded-full bg-rose-100 text-rose-500 hover:bg-rose-200 hover:scale-105 transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};