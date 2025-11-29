"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FileRendererProps {
  content: string;
  fileName: string;
}

export default function FileRenderer({ content, fileName }: FileRendererProps) {
  const isMarkdown = fileName.endsWith('.md');
  const isJson = fileName.endsWith('.json');
  const isCode = /\.(js|ts|py|sh|txt)$/.test(fileName);
  
  if (isMarkdown) {
    return (
      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }
  
  if (isJson) {
    // Pretty print JSON
    let formattedContent = content;
    try {
      formattedContent = JSON.stringify(JSON.parse(content), null, 2);
    } catch {
      // Keep original if parsing fails
    }
    
    return (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
        <code>{formattedContent}</code>
      </pre>
    );
  }
  
  // Code files
  if (isCode) {
    return (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
        <code>{content}</code>
      </pre>
    );
  }
  
  // Fallback - plain text
  return (
    <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto text-sm text-gray-800 whitespace-pre-wrap">
      {content}
    </pre>
  );
}

