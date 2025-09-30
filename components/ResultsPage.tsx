import React, { useState } from 'react';
import { AnalysisResult } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { TerminalIcon } from './icons/TerminalIcon';
import { BugIcon } from './icons/BugIcon';
import { CopyButton } from './CopyButton';
import { MarkdownRenderer } from './MarkdownRenderer';
import { OutputDisplay } from './OutputDisplay';
import { DebuggingAssistant } from './DebuggingAssistant';

interface ResultsPageProps {
    result: AnalysisResult;
    code: string;
    language: string;
    onStartOver: () => void;
}

type ActiveTab = 'explanation' | 'output' | 'bugs';

const TabButton: React.FC<{
    tabName: ActiveTab;
    currentTab: ActiveTab;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ tabName, currentTab, onClick, children }) => {
    const isActive = tabName === currentTab;
    return (
        <button
            onClick={onClick}
            role="tab"
            aria-selected={isActive}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 rounded-t-lg ${
                isActive
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
        >
            {children}
        </button>
    );
};


export const ResultsPage: React.FC<ResultsPageProps> = ({ result, code, language, onStartOver }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('explanation');
    
    const getContentForTab = () => {
        switch(activeTab) {
            case 'explanation':
                return result.explanation;
            case 'output':
                return result.predictedOutput;
            case 'bugs':
                return result.bugsAndErrors;
            default:
                return '';
        }
    };

    return (
        <div className="mt-8 space-y-8">
            <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
                <div role="tablist" className="flex border-b border-slate-700 px-2 sm:px-4">
                    <TabButton tabName="explanation" currentTab={activeTab} onClick={() => setActiveTab('explanation')}>
                        <SparklesIcon className="w-5 h-5" />
                        Explanation
                    </TabButton>
                    <TabButton tabName="output" currentTab={activeTab} onClick={() => setActiveTab('output')}>
                        <TerminalIcon className="w-5 h-5" />
                        Predicted Output
                    </TabButton>
                    <TabButton tabName="bugs" currentTab={activeTab} onClick={() => setActiveTab('bugs')}>
                        <BugIcon className="w-5 h-5" />
                        Bugs & Fixes
                    </TabButton>
                </div>
                <div className="relative">
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                        <CopyButton textToCopy={getContentForTab()} />
                    </div>
                    <div role="tabpanel" className="p-4 sm:p-6 min-h-[250px]">
                        {activeTab === 'explanation' && <MarkdownRenderer content={result.explanation} />}
                        {activeTab === 'output' && <OutputDisplay output={result.predictedOutput} />}
                        {activeTab === 'bugs' && (
                            <div>
                                <MarkdownRenderer content={result.bugsAndErrors} />
                                {result.correctedCode.trim() !== code.trim() && (
                                     <div className="mt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-slate-200 mb-2 text-sm">Original Code</h4>
                                                <div className="relative group bg-slate-900/70 rounded-lg border border-slate-700">
                                                     <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                       <CopyButton textToCopy={code} />
                                                     </div>
                                                    <pre className="p-4 overflow-x-auto text-sm">
                                                        <code className={`language-${language} font-mono`}>{code}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-400 mb-2 text-sm">Corrected Code</h4>
                                                <div className="relative group bg-slate-900/70 rounded-lg border border-green-500/30">
                                                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <CopyButton textToCopy={result.correctedCode} />
                                                    </div>
                                                    <pre className="p-4 overflow-x-auto text-sm">
                                                        <code className={`language-${language} font-mono`}>{result.correctedCode}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DebuggingAssistant
                originalCode={code}
                language={language}
                analysis={JSON.stringify(result, null, 2)}
            />

            <div className="text-center">
                <button
                    onClick={onStartOver}
                    className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-all duration-200"
                >
                    Analyze Another Snippet
                </button>
            </div>
        </div>
    );
};