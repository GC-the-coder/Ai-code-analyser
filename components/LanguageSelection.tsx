import React from 'react';
import { LANGUAGES } from '../constants';

interface LanguageSelectionProps {
    onSelect: (language: string) => void;
}

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelect }) => {
    return (
        <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-slate-100">Step 1: Select a Language</h2>
            <p className="mt-2 text-slate-400">Choose the programming language of your code snippet.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.value}
                        onClick={() => onSelect(lang.value)}
                        className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:border-sky-500 hover:text-sky-400 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
