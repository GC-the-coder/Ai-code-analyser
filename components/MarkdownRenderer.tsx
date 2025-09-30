import React from 'react';
import { CopyButton } from './CopyButton';

interface MarkdownRendererProps {
  content: string;
}

const applyInlineFormatting = (line: string): React.ReactNode => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-slate-700 text-sky-300 rounded px-1 py-0.5 font-mono text-sm">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const blocks = content.split(/(\`\`\`[\s\S]*?\`\`\`)/g).filter(Boolean);

  const renderBlock = (block: string, index: number) => {
    if (block.startsWith('```')) {
      const langMatch = block.match(/```(\w*)\n/);
      const language = langMatch ? langMatch[1] : '';
      const code = block.replace(/```\w*\n/, '').replace(/```$/, '').trim();
      return (
        <div key={index} className="my-4 relative group">
           <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <CopyButton textToCopy={code} />
          </div>
          <pre className="bg-slate-900/70 p-4 rounded-lg overflow-x-auto">
            <code className={`language-${language} font-mono text-sm`}>{code}</code>
          </pre>
        </div>
      );
    }

    const lines = block.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listItems: React.ReactNode[] = [];

    const closeList = () => {
        if (listType === 'ul') {
            elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-4 pl-4">{listItems}</ul>);
        } else if (listType === 'ol') {
            elements.push(<ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-2 my-4 pl-4">{listItems}</ol>);
        }
        listItems = [];
        listType = null;
    };

    lines.forEach((line, lineIndex) => {
        if (line.startsWith('# ')) {
            closeList();
            elements.push(<h1 key={lineIndex} className="text-3xl font-bold mt-6 mb-3 text-slate-100">{line.substring(2)}</h1>);
        } else if (line.startsWith('## ')) {
            closeList();
            elements.push(<h2 key={lineIndex} className="text-2xl font-bold mt-5 mb-3 text-slate-100">{line.substring(3)}</h2>);
        } else if (line.startsWith('### ')) {
            closeList();
            elements.push(<h3 key={lineIndex} className="text-xl font-bold mt-4 mb-2 text-slate-200">{line.substring(4)}</h3>);
        } else if (line.match(/^\d+\.\s/)) {
            if (listType !== 'ol') {
                closeList();
                listType = 'ol';
            }
            listItems.push(<li key={lineIndex}>{applyInlineFormatting(line.replace(/^\d+\.\s/, ''))}</li>);
        } else if (line.startsWith('* ')) {
            if (listType !== 'ul') {
                closeList();
                listType = 'ul';
            }
            listItems.push(<li key={lineIndex}>{applyInlineFormatting(line.substring(2))}</li>);
        } else if (line.trim() === '') {
            closeList();
            elements.push(<div key={lineIndex} className="h-4"></div>); // Represents a paragraph break
        } else {
            closeList();
            elements.push(<p key={lineIndex} className="my-2 leading-relaxed">{applyInlineFormatting(line)}</p>);
        }
    });

    closeList();
    return <div key={index}>{elements}</div>;
  };

  return <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300">{blocks.map(renderBlock)}</div>;
};
