import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 ${
                isCopied
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
        >
            {isCopied ? (
                <>
                    <CheckIcon className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <ClipboardIcon className="w-4 h-4" />
                    Copy
                </>
            )}
        </button>
    );
};