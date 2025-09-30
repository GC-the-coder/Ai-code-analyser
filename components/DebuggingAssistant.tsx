import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { SparklesIcon } from './icons/SparklesIcon';
import { ChatIcon } from './icons/ChatIcon';

interface DebuggingAssistantProps {
    originalCode: string;
    language: string;
    analysis: string;
}

type Message = {
    role: 'user' | 'model';
    text: string;
}

export const DebuggingAssistant: React.FC<DebuggingAssistantProps> = ({ originalCode, language, analysis }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const initialContext = `You are an expert AI debugging assistant. The user has provided the following ${language} code, which you have already analyzed.

Initial Code:
\`\`\`${language}
${originalCode}
\`\`\`

Your Initial Analysis (JSON format):
\`\`\`json
${analysis}
\`\`\`

Now, the user may ask follow-up questions. Be helpful, concise, and provide code examples where necessary.`;
        
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: [
                { role: 'user', parts: [{ text: initialContext }] },
                { role: 'model', parts: [{ text: "I've reviewed the code and my analysis. How can I help you debug or improve it further?" }] }
            ],
        });
        setChat(chatSession);
        setMessages([{ role: 'model', text: "I've reviewed the code and my analysis. How can I help you debug or improve it further?" }]);
    }, [originalCode, language, analysis]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const currentInput = userInput;
        setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const responseStream = await chat.sendMessageStream({ message: currentInput });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Sorry, I encountered an error. Please try again. (${errorMessage})`);
            setMessages(prev => prev.slice(0, -2)); // Remove user message and empty model message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
            <h3 className="flex items-center gap-3 p-4 border-b border-slate-700 text-lg font-bold text-slate-100">
                <ChatIcon className="w-6 h-6 text-sky-400" />
                AI Debugging Assistant
            </h3>
            <div className="p-4">
                <div className="h-64 overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-sky-400" /></div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length -1].role === 'user' && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-sky-400" /></div>
                            <div className="max-w-md p-3 rounded-lg bg-slate-700 text-slate-300">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};
