import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "content");

export interface MarkdownFile {
  slug: string;
  title: string;
  content: string;
  lastModified: Date;
}

export function getAllMarkdownFiles(): MarkdownFile[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const markdownFiles = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const stats = fs.statSync(fullPath);
      
      // Extract title from first heading or use filename
      const titleMatch = fileContents.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : fileName.replace(".md", "");
      
      return {
        slug: fileName.replace(".md", ""),
        title,
        content: fileContents,
        lastModified: stats.mtime,
      };
    })
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

  return markdownFiles;
}

export function getMarkdownFileBySlug(slug: string): MarkdownFile | null {
  const filePath = path.join(contentDirectory, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const stats = fs.statSync(filePath);
  
  const titleMatch = fileContents.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;

  return {
    slug,
    title,
    content: fileContents,
    lastModified: stats.mtime,
  };
}

