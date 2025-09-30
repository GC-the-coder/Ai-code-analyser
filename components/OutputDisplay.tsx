import React from 'react';

interface OutputDisplayProps {
    output: string;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
    return (
        <div className="bg-slate-900/70 p-4 rounded-lg min-h-[200px]">
            <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap break-words">
                <code>
                    {output.trim() ? output : <span className="text-slate-500 italic">No output produced or code is incomplete.</span>}
                </code>
            </pre>
        </div>
    );
};
