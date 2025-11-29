"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Info } from "lucide-react";
import AddFileModal from "./AddFileModal";

export default function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold text-gray-900">MemoryBench</div>
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add File
            </button>
          </div>
        </div>
      </nav>
      <AddFileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

