import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { analyzeCode, AnalysisResult } from './services/geminiService';
import { LanguageSelection } from './components/LanguageSelection';
import { CodeInput } from './components/CodeInput';
import { Loader } from './components/Loader';
import { ResultsPage } from './components/ResultsPage';

export enum Page {
  SelectLanguage,
  EnterCode,
  Analyzing,
  ShowResult,
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SelectLanguage);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedCode, setLastAnalyzedCode] = useState<string | null>(() => {
    return localStorage.getItem('lastAnalyzedCode');
  });

  const handleLanguageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setCurrentPage(Page.EnterCode);
  };

  const handleBackToLanguage = () => {
    setCurrentPage(Page.SelectLanguage);
  };

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }
    setCurrentPage(Page.Analyzing);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeCode(code, language);
      setAnalysisResult(result);
      setLastAnalyzedCode(code);
      localStorage.setItem('lastAnalyzedCode', code);
      setCurrentPage(Page.ShowResult);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred while analyzing the code. Please try again. (Details: ${errorMessage})`);
      setCurrentPage(Page.EnterCode); // Go back to code input on error
    }
  }, [code, language]);

  const handleStartOver = () => {
    setCode('');
    setLanguage('');
    setAnalysisResult(null);
    setError(null);
    setCurrentPage(Page.SelectLanguage);
  };

  const handleLoadPreviousCode = () => {
    if (lastAnalyzedCode) {
      setCode(lastAnalyzedCode);
    }
  };
  
  const renderContent = () => {
    switch (currentPage) {
      case Page.SelectLanguage:
        return <LanguageSelection onSelect={handleLanguageSelect} />;
      case Page.EnterCode:
        return (
            <div className="mt-8 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
                <CodeInput
                    code={code}
                    setCode={setCode}
                    language={language}
                    onAnalyze={handleAnalyze}
                    onBack={handleBackToLanguage}
                    isLoading={false}
                    lastAnalyzedCode={lastAnalyzedCode}
                    onLoadPrevious={handleLoadPreviousCode}
                />
            </div>
        );
      case Page.Analyzing:
        return <div className="mt-8"><Loader /></div>;
      case Page.ShowResult:
        if (analysisResult) {
          return <ResultsPage result={analysisResult} code={code} language={language} onStartOver={handleStartOver} />;
        }
        return null; // Should not happen
      default:
        return <LanguageSelection onSelect={handleLanguageSelect} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-300">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Header currentPage={currentPage} />
        {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
            </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;