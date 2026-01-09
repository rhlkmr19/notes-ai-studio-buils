import React from 'react';
import { Trash2, Download, Info, NotebookPen, ShieldCheck } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  noteCount: number;
  hasPin: boolean;
  onClearAll: () => void;
  onExport: () => void;
  onSetPin: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, noteCount, hasPin, onClearAll, onExport, onSetPin }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#f3f6fc] z-50 shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 pt-12 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-[#c2e7ff] rounded-xl flex items-center justify-center">
                    <NotebookPen size={20} className="text-[#001d35]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Material Notes</h2>
                    <p className="text-xs text-gray-500">v1.1.0 • Secure</p>
                </div>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
                 <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <span className="text-gray-600 font-medium">Total Notes</span>
                    <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-bold">{noteCount}</span>
                 </div>

                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-2">Security</div>
                <button 
                    onClick={onSetPin}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white rounded-2xl transition-colors text-gray-700"
                >
                    <ShieldCheck size={20} className={hasPin ? "text-green-600" : "text-gray-400"} />
                    <span className="font-medium">{hasPin ? 'Change Master PIN' : 'Set Master PIN'}</span>
                </button>

                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-2 mt-4">Data</div>
                
                <button 
                    onClick={onExport}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white rounded-2xl transition-colors text-gray-700"
                >
                    <Download size={20} />
                    <span className="font-medium">Export Notes (JSON)</span>
                </button>

                <button 
                    onClick={onClearAll}
                    className="w-full flex items-center gap-3 p-4 hover:bg-red-50 text-red-600 rounded-2xl transition-colors"
                >
                    <Trash2 size={20} />
                    <span className="font-medium">Delete All Notes</span>
                </button>
            </div>
            
             <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-4">
                <div className="flex items-start gap-3">
                    <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 leading-relaxed">
                        <b>Pro Tip:</b> Set a Master PIN to enable the lock feature in your notes.
                    </p>
                </div>
             </div>
        </div>
      </div>
    </>
  );
};