"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown, FileText, FileCode, Folder, FolderOpen } from "lucide-react";
import { FileTreeNode } from "@/lib/markdown";

interface FileExplorerProps {
  tree: FileTreeNode[];
  basePath?: string;
}

// Get parent paths from a file path
function getParentPaths(filePath: string): string[] {
  const parts = filePath.split("/");
  const paths: string[] = [];
  for (let i = 1; i <= parts.length; i++) {
    paths.push(parts.slice(0, i).join("/"));
  }
  return paths;
}

export default function FileExplorer({ tree, basePath = "/file" }: FileExplorerProps) {
  const pathname = usePathname();
  
  // Initialize expanded paths based on current pathname
  const initialExpanded = useMemo(() => {
    const currentPath = pathname.replace(`${basePath}/`, "");
    const paths = getParentPaths(currentPath);
    return new Set(paths);
  }, [pathname, basePath]);
  
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(initialExpanded);
  
  const toggleExpanded = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2">
        {tree.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            basePath={basePath}
            pathname={pathname}
            level={0}
            expandedPaths={expandedPaths}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: FileTreeNode;
  basePath: string;
  pathname: string;
  level: number;
  expandedPaths: Set<string>;
  toggleExpanded: (path: string) => void;
}

function TreeNode({ node, basePath, pathname, level, expandedPaths, toggleExpanded }: TreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isActive = pathname === `${basePath}/${node.path}`;

  if (node.type === "file") {
    const isCode = /\.(json|js|ts|py|sh)$/.test(node.name);
    const displayName = node.name.replace(/\.(md|json|txt|sh|py|js|ts)$/, "");
    const Icon = isCode ? FileCode : FileText;
    
    return (
      <Link
        href={`${basePath}/${node.path}`}
        className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
          isActive
            ? "bg-blue-100 text-blue-700 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{displayName}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => toggleExpanded(node.path)}
        className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm w-full text-left transition-colors hover:bg-gray-100 ${
          isActive ? "bg-blue-50" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-500" />
        )}
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 flex-shrink-0 text-blue-600" />
        ) : (
          <Folder className="h-4 w-4 flex-shrink-0 text-blue-600" />
        )}
        <span className="truncate font-medium">{node.name}</span>
      </button>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              basePath={basePath}
              pathname={pathname}
              level={level + 1}
              expandedPaths={expandedPaths}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

