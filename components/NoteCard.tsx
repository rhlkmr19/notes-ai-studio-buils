import React from 'react';
import { Note, ViewMode } from '../types';
import { Pin, Lock, FileText, Calendar } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  viewMode: ViewMode;
  onClick: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode, onClick }) => {
  // Format date
  const dateStr = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isList = viewMode === 'list';

  return (
    <div
      onClick={() => onClick(note)}
      className={`
        ${note.color} 
        group
        relative
        cursor-pointer 
        transition-all 
        duration-300 
        hover:shadow-lg
        hover:shadow-purple-100/50
        active:scale-[0.98]
        overflow-hidden
        border border-black/5
        ${isList ? 'flex items-center gap-4 p-4 rounded-3xl w-full mb-3 h-24' : 'flex flex-col gap-3 p-5 rounded-[2rem] h-auto mb-4 break-inside-avoid'}
      `}
    >
      {/* Locked Overlay / Icon */}
      {note.isLocked && (
        <div className={`${isList ? 'relative' : 'absolute top-4 right-4'} z-10`}>
             <div className="bg-black/5 p-2 rounded-full backdrop-blur-sm">
                <Lock size={16} className="text-gray-600" />
             </div>
        </div>
      )}

      <div className={`flex-1 min-w-0 ${isList ? 'flex flex-col justify-center' : ''}`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-bold text-gray-800 truncate pr-2 ${isList ? 'text-lg' : 'text-xl'} ${!note.title && 'text-gray-400 italic'}`}>
            {note.isLocked ? 'Locked Note' : (note.title || 'Untitled')}
          </h3>
          {note.isPinned && !note.isLocked && !isList && <Pin size={16} className="text-fuchsia-600 fill-current shrink-0" />}
        </div>
        
        {!isList && (
           <p className={`text-gray-600 text-sm mt-2 leading-relaxed line-clamp-4 ${note.isLocked ? 'blur-sm select-none opacity-50' : ''}`}>
             {note.isLocked ? 'This content is hidden because it is locked.' : (note.content || 'No content')}
           </p>
        )}

        {isList && (
             <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={12}/> {dateStr}</span>
                <span className="bg-black/5 px-2 py-0.5 rounded-full">{note.category}</span>
             </div>
        )}
      </div>

      {!isList && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
             <span className="text-xs font-semibold bg-white/50 px-3 py-1 rounded-full text-gray-600">
                {note.category}
             </span>
             <span className="text-xs text-gray-400 font-medium">
                {dateStr}
             </span>
        </div>
      )}
    </div>
  );
};