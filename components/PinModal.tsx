import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  mode: 'set' | 'unlock';
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, mode, onClose, onSuccess, title }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    onSuccess(pin);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${mode === 'set' ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-600'}`}>
            {mode === 'set' ? <ShieldCheck size={32} /> : <Lock size={32} />}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {title || (mode === 'set' ? 'Set Master PIN' : 'Enter PIN')}
          </h2>
          <p className="text-gray-500 text-center mb-6 text-sm">
            {mode === 'set' 
              ? 'Create a secure PIN to protect your locked notes.' 
              : 'This note is locked. Enter your Master PIN to view it.'}
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <input
              autoFocus
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/[^0-9]/g, ''));
                setError('');
              }}
              placeholder="••••"
              className="w-full text-center text-4xl font-bold tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-purple-500 outline-none transition-colors text-gray-800 placeholder-gray-300 mb-2"
            />
            
            {error && (
              <p className="text-red-500 text-sm text-center font-medium mb-4 animate-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-black active:scale-[0.98] transition-all shadow-lg shadow-gray-200"
            >
              {mode === 'set' ? 'Save PIN' : 'Unlock'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};