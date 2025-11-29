'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X } from 'lucide-react';
import FileExplorer from './FileExplorer';
import FileRenderer from './FileRenderer';
import { FileTreeNode } from '@/lib/markdown';

interface FilePageLayoutProps {
  fileTree: FileTreeNode[];
  title: string;
  lastModified: Date;
  content: string;
  fileName: string;
}

export default function FilePageLayout({
  fileTree,
  title,
  lastModified,
  content,
  fileName,
}: FilePageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-64 md:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop back link */}
        <div className="hidden md:block p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Files header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Files
          </h2>
        </div>

        <FileExplorer tree={fileTree} onFileClick={closeSidebar} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-medium text-gray-900 truncate">{title}</span>
        </div>

        <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-12 lg:px-8">
          <article className="rounded-lg border border-gray-200 bg-white p-4 sm:p-8 shadow-sm">
            <header className="mb-6 sm:mb-8 border-b border-gray-200 pb-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Last modified: {lastModified.toLocaleDateString()}
              </p>
            </header>

            <FileRenderer content={content} fileName={fileName} />
          </article>
        </div>
      </main>
    </div>
  );
}

