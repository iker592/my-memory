'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FileExplorer from './FileExplorer';
import FileRenderer from './FileRenderer';
import SidebarAddFile from './SidebarAddFile';
import { FileTreeNode } from '@/lib/markdown';
import {
  SidebarProvider,
  SidebarOverlay,
  SidebarContainer,
  SidebarHeader,
  MobileHeader,
  useSidebar,
} from './MobileSidebar';

interface FilePageLayoutProps {
  fileTree: FileTreeNode[];
  title: string;
  lastModified: Date;
  content: string;
  fileName: string;
}

// Back to Home link component
function BackToHomeLink() {
  return (
    <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
      <ArrowLeft className="h-4 w-4" />
      <span>Back to Home</span>
    </Link>
  );
}

// Inner component that uses sidebar context
function FilePageLayoutContent({
  fileTree,
  title,
  lastModified,
  content,
  fileName,
}: FilePageLayoutProps) {
  const { close: closeSidebar } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarOverlay />

      <SidebarContainer>
        <SidebarHeader>
          <BackToHomeLink />
        </SidebarHeader>

        {/* Desktop back link */}
        <div className="hidden md:block p-4 border-b border-gray-200">
          <BackToHomeLink />
        </div>

        {/* Files header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Files
          </h2>
        </div>

        <SidebarAddFile />
        <FileExplorer tree={fileTree} onFileClick={closeSidebar} />
      </SidebarContainer>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <MobileHeader title={title} sticky />

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

// Main component with provider wrapper
export default function FilePageLayout(props: FilePageLayoutProps) {
  return (
    <SidebarProvider>
      <FilePageLayoutContent {...props} />
    </SidebarProvider>
  );
}
