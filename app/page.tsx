import Link from "next/link";
import { FileText, Calendar } from "lucide-react";
import { getAllMarkdownFiles } from "@/lib/markdown";

export default function Home() {
  const files = getAllMarkdownFiles();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            My Memory
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your personal knowledge base and memory repository
          </p>
        </div>

        {files.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No files yet
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Add markdown files to the <code className="rounded bg-gray-100 px-2 py-1 text-xs">content</code> directory to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Files ({files.length})
            </h2>
            {files.map((file) => (
              <Link
                key={file.slug}
                href={`/file/${file.slug}`}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {file.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {file.slug}.md
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    {file.lastModified.toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
