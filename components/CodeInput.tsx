import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { HistoryIcon } from './icons/HistoryIcon';

interface CodeInputProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    onAnalyze: () => void;
    onBack: () => void;
    isLoading: boolean;
    lastAnalyzedCode: string | null;
    onLoadPrevious: () => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, language, onAnalyze, onBack, isLoading, lastAnalyzedCode, onLoadPrevious }) => {
    const languageLabel = language.charAt(0).toUpperCase() + language.slice(1);
    
    return (
        <div className="p-4 sm:p-6">
            <div className="relative">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`Paste your ${languageLabel} code here...`}
                    className="w-full h-64 p-4 pr-32 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-y"
                    disabled={isLoading}
                    aria-label={`Code input for ${languageLabel}`}
                />
                <div className="absolute top-3 right-3">
                     <span className="bg-slate-700 text-slate-300 rounded-md py-1 px-3 text-sm font-medium">
                        {languageLabel}
                    </span>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 px-4 py-3 text-slate-300 font-semibold rounded-lg hover:bg-slate-700/50 disabled:opacity-50 transition-all duration-200"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back
                    </button>
                    {lastAnalyzedCode && (
                        <button
                            onClick={onLoadPrevious}
                            className="flex items-center justify-center gap-2 px-4 py-3 text-slate-400 font-semibold rounded-lg hover:bg-slate-700/50 hover:text-slate-200 disabled:opacity-50 transition-all duration-200 text-sm"
                            title="Load the last code snippet you analyzed"
                        >
                            <HistoryIcon className="w-5 h-5" />
                            Load Previous
                        </button>
                    )}
                </div>
                <button
                    onClick={onAnalyze}
                    disabled={isLoading || !code.trim()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            Analyze Code
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};