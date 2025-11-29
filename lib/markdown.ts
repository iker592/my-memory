import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "content");
const agentsDirectory = path.join(process.cwd(), "agents");

export interface DirectoryOverrides {
  contentDir?: string;
  agentsDir?: string;
}

export interface MarkdownFile {
  slug: string;
  path: string; // Full path relative to content directory
  title: string;
  content: string;
  lastModified: Date;
  source?: string; // Which directory it came from
  fileName?: string; // Original filename with extension
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  lastModified?: Date;
  source?: string; // Which directory it came from
}

// Supported file types for display
const SUPPORTED_EXTENSIONS = ['.md', '.json', '.txt', '.sh', '.py', '.js', '.ts'];

function isSupportedFile(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext));
}

function getFileTitle(filePath: string): string {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const titleMatch = fileContents.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1];
  }
  const fileName = path.basename(filePath, ".md");
  return fileName;
}

export function buildFileTree(dirPath: string = contentDirectory, relativePath: string = "", source?: string, pathPrefix?: string): FileTreeNode[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const items: FileTreeNode[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  // Sort: directories first, then files, both alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const itemRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    // Full path includes the prefix (e.g., "content/" or "agents/")
    const fullItemPath = pathPrefix ? `${pathPrefix}/${itemRelativePath}` : itemRelativePath;

    if (entry.isDirectory()) {
      const children = buildFileTree(fullPath, itemRelativePath, source, pathPrefix);
      if (children.length > 0) {
        items.push({
          name: entry.name,
          path: fullItemPath,
          type: "directory",
          children,
          source,
        });
      }
    } else if (isSupportedFile(entry.name)) {
      const stats = fs.statSync(fullPath);
      items.push({
        name: entry.name,
        path: fullItemPath.replace(/\.(md|json|txt|sh|py|js|ts)$/, ""), // Remove extension
        type: "file",
        lastModified: stats.mtime,
        source,
      });
    }
  }

  return items;
}

// Build combined file tree from multiple directories
export function buildCombinedFileTree(overrides?: DirectoryOverrides): FileTreeNode[] {
  const contentRoot = overrides?.contentDir ?? contentDirectory;
  const agentsRoot = overrides?.agentsDir ?? agentsDirectory;

  const contentTree = buildFileTree(contentRoot, "", "content", "content");
  const agentsTree = buildFileTree(agentsRoot, "", "agents", "agents");
  
  const combined: FileTreeNode[] = [];
  
  // Add content section
  if (contentTree.length > 0) {
    combined.push({
      name: "Content",
      path: "content",
      type: "directory",
      children: contentTree,
      source: "content",
    });
  }
  
  // Add agents section
  if (agentsTree.length > 0) {
    combined.push({
      name: "Agents",
      path: "agents",
      type: "directory",
      children: agentsTree,
      source: "agents",
    });
  }
  
  return combined;
}

export function getAllFiles(overrides?: DirectoryOverrides): MarkdownFile[] {
  const files: MarkdownFile[] = [];
  const contentRoot = overrides?.contentDir ?? contentDirectory;
  const agentsRoot = overrides?.agentsDir ?? agentsDirectory;

  function traverseDirectory(dirPath: string, relativePath: string = "", source: string = "content") {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const itemRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        traverseDirectory(fullPath, itemRelativePath, source);
      } else if (isSupportedFile(entry.name)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const stats = fs.statSync(fullPath);
        const title = getFileTitle(fullPath);
        const slug = itemRelativePath.replace(/\.(md|json|txt|sh|py|js|ts)$/, "");

        files.push({
          slug,
          path: `${source}/${slug}`,
          title,
          content: fileContents,
          lastModified: stats.mtime,
          source,
        });
      }
    }
  }

  traverseDirectory(contentRoot, "", "content");
  traverseDirectory(agentsRoot, "", "agents");
  return files.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export function getFileByPath(filePath: string, overrides?: DirectoryOverrides): MarkdownFile | null {
  const contentRoot = overrides?.contentDir ?? contentDirectory;
  const agentsRoot = overrides?.agentsDir ?? agentsDirectory;
  // Check if path starts with a source prefix
  let baseDir = contentRoot;
  let normalizedPath = filePath;
  let source = "content";
  
  if (filePath.startsWith("content/")) {
    normalizedPath = filePath.replace("content/", "");
    baseDir = contentRoot;
    source = "content";
  } else if (filePath.startsWith("agents/")) {
    normalizedPath = filePath.replace("agents/", "");
    baseDir = agentsRoot;
    source = "agents";
  }
  
  // Try each supported extension
  for (const ext of SUPPORTED_EXTENSIONS) {
    const fullPath = path.join(baseDir, `${normalizedPath}${ext}`);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const stats = fs.statSync(fullPath);
      const title = getFileTitle(fullPath);
      return {
        slug: normalizedPath,
        path: filePath,
        title,
        content: fileContents,
        lastModified: stats.mtime,
        source,
        fileName: path.basename(fullPath),
      };
    }
  }
  
  // Try content directory as fallback
  for (const ext of SUPPORTED_EXTENSIONS) {
    const fallbackPath = path.join(contentRoot, `${filePath}${ext}`);
    if (fs.existsSync(fallbackPath)) {
      const fileContents = fs.readFileSync(fallbackPath, "utf8");
      const stats = fs.statSync(fallbackPath);
      const title = getFileTitle(fallbackPath);
      return {
        slug: filePath,
        path: filePath,
        title,
        content: fileContents,
        lastModified: stats.mtime,
        source: "content",
        fileName: path.basename(fallbackPath),
      };
    }
  }
  
  return null;
}

