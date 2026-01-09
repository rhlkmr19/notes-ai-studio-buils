import React from 'react';
import { Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative animate-float">
        <div className="w-32 h-32 bg-gradient-to-br from-fuchsia-400 to-rose-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-pink-200 transform rotate-3">
            <Sparkles size={56} className="text-white" />
        </div>
        {/* Blur effect behind */}
        <div className="absolute inset-0 w-32 h-32 bg-fuchsia-400 rounded-[2.5rem] -z-10 blur-xl opacity-40"></div>
      </div>
      
      <h1 className="mt-10 text-4xl font-bold text-gray-800 tracking-tight">
        Material<span className="text-fuchsia-500">Notes</span>
      </h1>
      <p className="mt-3 text-gray-500 font-medium text-lg">Smart. Secure. Simple.</p>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-fuchsia-200 border-t-fuchsia-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};