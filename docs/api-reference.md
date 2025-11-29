# MemoryBench API & Component Reference

This document describes the public APIs, exported utility functions, and reusable UI components that make up the MemoryBench application. Each section explains the responsibility of the module, details its signature or props, and provides concrete usage examples so you can integrate or extend the system confidently.

## REST API

### `POST /api/chat`
- **Description:** Streams assistant responses from Anthropic Claude for the provided chat history.
- **Auth:** Relies on the server-side `ANTHROPIC_API_KEY` environment variable.
- **Body:** `{ "messages": Array<{ role: 'user' | 'assistant', content: string }> }`
- **Response:** Text stream (`text/plain`) that incrementally yields the assistant message.

#### Example
```ts
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Summarize my daily notes.' },
      { role: 'assistant', content: 'Sure, send them over.' }
    ],
  }),
});

if (!response.ok) throw new Error('Chat failed');
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let fullText = '';
while (reader) {
  const { done, value } = await reader.read();
  if (done) break;
  fullText += decoder.decode(value, { stream: true });
  // Update UI with fullText as it streams in
}
```

## Server Utilities (`lib/markdown.ts`)

### `buildCombinedFileTree(): FileTreeNode[]`
Combines the `content/` and `agents/` directories into a single tree suitable for navigation menus. Directory nodes group their children while file nodes strip known extensions so routes remain clean.

**Usage:**
```ts
import { buildCombinedFileTree } from '@/lib/markdown';

const tree = buildCombinedFileTree();
// Pass directly to <FileExplorer tree={tree} />
```

### `buildFileTree(dirPath?, relativePath?, source?, pathPrefix?): FileTreeNode[]`
Recursively walks a directory, returning folder/file nodes for supported extensions (`.md`, `.json`, `.txt`, `.sh`, `.py`, `.js`, `.ts`). Directories are sorted ahead of files for predictable sidebar rendering.

**Usage:**
```ts
const tree = buildFileTree('/abs/path/to/notes', '', 'notes', 'notes');
```
Pass `source`/`pathPrefix` when you need to distinguish multiple roots (e.g., `content` vs `agents`).

### `getAllFiles(): MarkdownFile[]`
Loads every supported file from both directories, extracting metadata (slug, title, timestamps) and returning the list sorted by `lastModified` descending. Use this for search indexes, sitemap generation, or pre-rendering.

**Usage:**
```ts
const files = getAllFiles();
const latest = files[0];
console.log(latest.title, latest.path);
```

### `getFileByPath(filePath: string): MarkdownFile | null`
Retrieves a single file by logical path (with or without `content/` or `agents/` prefix). Falls back across supported extensions until a match is found, returning the parsed metadata and raw contents.

**Usage:**
```ts
const file = getFileByPath('content/notes/weekly-standup');
if (!file) throw new Error('Missing note');
return <FileRenderer content={file.content} fileName={file.fileName!} />;
```

## Next.js Pages

### `app/page.tsx`
Server component that builds the combined file tree and renders `<ChatInterface>` for the home experience. Use this pattern when you need server-side data but a client-side chat surface.

### `app/file/[...slug]/page.tsx`
Catch-all route for rendering any supported file. It exports `generateStaticParams()` for static generation and uses `getFileByPath()` to fetch content, `<FileExplorer>` for the sidebar, and `<FileRenderer>` for the main article view.

## React Components

### `<ChatInterface fileTree={FileTreeNode[]}>`
Client component that renders the two-column app: file explorer on the left and chat surface on the right. Manages the full chat loop (input, optimistic updates, streaming response handling, markdown rendering).

**Usage:**
```tsx
import ChatInterface from '@/components/ChatInterface';
import { buildCombinedFileTree } from '@/lib/markdown';

export default function Page() {
  const fileTree = buildCombinedFileTree();
  return <ChatInterface fileTree={fileTree} />;
}
```

### `<FileExplorer tree={FileTreeNode[]} basePath="/file">`
Displays a collapsible tree view with folder toggles and file links. Automatically expands nodes that lead to the current route by inspecting `usePathname()`.

**Usage:**
```tsx
<FileExplorer tree={fileTree} basePath="/file" />
```
Set `basePath` if you mount the explorer under a custom route prefix.

### `<FileRenderer content={string} fileName={string}>`
Renders Markdown (with GFM), JSON (prettified), or generic code/text blocks with syntax-friendly styling based on the provided file name.

**Usage:**
```tsx
<FileRenderer content={file.content} fileName={file.fileName ?? 'note.md'} />
```

### `<MarkdownRenderer content={string}>`
Lightweight wrapper around `react-markdown` with a prose theme for cases where you just need Markdown rendering without file-type heuristics.

**Usage:**
```tsx
<MarkdownRenderer content={markdown} />
```

### `<AddFileModal isOpen={boolean} onClose={() => void}>`
Modal dialog that captures the metadata and Markdown content for a new file. Includes Markdown tips, mock folder shortcuts, and a simulated submission state.

**Usage:**
```tsx
const [open, setOpen] = useState(false);

<>
  <button onClick={() => setOpen(true)}>Add File</button>
  <AddFileModal isOpen={open} onClose={() => setOpen(false)} />
</>
```

## Implementation Notes
- Components that manage user interaction (`ChatInterface`, `FileExplorer`, `AddFileModal`, `MobileSidebar`) are client components (`'use client'`). Import them only from client-aware contexts.
- Utility functions in `lib/markdown.ts` touch the filesystem and therefore must run on the server (Build step, server actions, or API routes).
- The chat API uses streaming responses; update your UI incrementally for best UX.
