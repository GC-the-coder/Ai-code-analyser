
import React from 'react';
import { CodeIcon } from './icons/CodeIcon';
import { Page } from '../App';

interface HeaderProps {
    currentPage: Page;
}

const ProgressBar: React.FC<{ currentPage: Page }> = ({ currentPage }) => {
    const steps = ['Language', 'Code', 'Analyzing', 'Result'];
    const currentStepIndex = currentPage;

    return (
        <div className="w-full max-w-md mx-auto mt-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isActive ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <p className={`mt-2 text-xs font-medium ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-sky-500' : 'bg-slate-700'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
    return (
        <header className="text-center">
            <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full">
                <CodeIcon className="w-6 h-6 text-sky-400"/>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                    AI Code Explainer
                </h1>
            </div>
            <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
                From language selection to AI-powered debugging, understand your code in a few simple steps.
            </p>
            <ProgressBar currentPage={currentPage} />
        </header>
    );
};
