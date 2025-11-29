import { notFound } from "next/navigation";
import { use } from "react";
import { getFileByPath, getAllFiles, buildCombinedFileTree } from "@/lib/markdown";
import FilePageLayout from "@/components/FilePageLayout";

export async function generateStaticParams() {
  const files = getAllFiles();
  return files.map((file) => ({
    slug: file.path.split("/"), // Split path into array for catch-all route
  }));
}

export default function MarkdownPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);
  const filePath = Array.isArray(slug) ? slug.join("/") : slug;
  const file = getFileByPath(filePath);
  const fileTree = buildCombinedFileTree();

  if (!file) {
    notFound();
  }

  return (
    <FilePageLayout
      fileTree={fileTree}
      title={file.title}
      lastModified={file.lastModified}
      content={file.content}
      fileName={file.fileName || 'file.md'}
    />
  );
}
