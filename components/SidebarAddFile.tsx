'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddFileModal from './AddFileModal';

export default function SidebarAddFile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add File
        </button>
      </div>
      <AddFileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

