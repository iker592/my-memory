"use client";

import { useState } from "react";
import { X, Info, Folder } from "lucide-react";

interface AddFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFileModal({ isOpen, onClose }: AddFileModalProps) {
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [content, setContent] = useState("");
  const [showMarkdownInfo, setShowMarkdownInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Example folders - in a real app, this would come from an API
  const exampleFolders = [
    "projects",
    "projects/web",
    "projects/mobile",
    "notes",
    "notes/learning",
    "notes/meetings",
    "ideas",
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    // Mock success
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setFileName("");
    setFilePath("");
    setContent("");
    setShowMarkdownInfo(false);
    setShowSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New File</h2>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* File Name */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              File Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="my-note"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <span className="text-sm text-gray-500">.md</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              File name without extension (will be added automatically)
            </p>
          </div>

          {/* File Path */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location (optional)
            </label>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="projects/web or leave empty for root"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Folder path where the file will be created (e.g., "projects/web")
            </p>
            {exampleFolders.length > 0 && (
              <div className="mt-2">
                <p className="mb-1 text-xs font-medium text-gray-600">Example folders:</p>
                <div className="flex flex-wrap gap-1">
                  {exampleFolders.slice(0, 6).map((folder) => (
                    <button
                      key={folder}
                      type="button"
                      onClick={() => setFilePath(folder)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                    >
                      {folder}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowMarkdownInfo(!showMarkdownInfo)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Info className="h-4 w-4" />
                Markdown Format
              </button>
            </div>
            {showMarkdownInfo && (
              <div className="mb-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm">
                <h4 className="mb-2 font-semibold text-blue-900">Markdown Format Guide:</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>
                    <code className="rounded bg-blue-100 px-1"># Heading</code> - Main heading
                  </li>
                  <li>
                    <code className="rounded bg-blue-100 px-1">## Subheading</code> - Subheading
                  </li>
                  <li>
                    <code className="rounded bg-blue-100 px-1">**bold**</code> - Bold text
                  </li>
                  <li>
                    <code className="rounded bg-blue-100 px-1">*italic*</code> - Italic text
                  </li>
                  <li>
                    <code className="rounded bg-blue-100 px-1">- List item</code> - Bullet list
                  </li>
                  <li>
                    <code className="rounded bg-blue-100 px-1">```code```</code> - Code block
                  </li>
                  <li>
                    <code className="rounded bg-blue-100 px-1">[Link](url)</code> - Link
                  </li>
                </ul>
              </div>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# My New Note&#10;&#10;Write your content here using Markdown format..."
              className="min-h-[200px] w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
              ✓ File created successfully! (Mock submission)
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

