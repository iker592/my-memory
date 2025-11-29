import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMarkdownFileBySlug, getAllMarkdownFiles } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export async function generateStaticParams() {
  const files = getAllMarkdownFiles();
  return files.map((file) => ({
    slug: file.slug,
  }));
}

export default function MarkdownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const file = getMarkdownFileBySlug(slug);

  if (!file) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to files
        </Link>

        <article className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <header className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">{file.title}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last modified: {file.lastModified.toLocaleDateString()}
            </p>
          </header>

          <MarkdownRenderer content={file.content} />
        </article>
      </div>
    </div>
  );
}

