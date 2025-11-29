# My Memory

A personal knowledge base and memory repository built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Markdown Support**: Write your thoughts and notes in Markdown format
- **File Browser**: Browse through all your markdown files in a clean interface
- **Markdown Rendering**: Beautiful rendering of markdown with syntax highlighting
- **Easy Navigation**: Click on any file to view and read it

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding Files

Simply add markdown files (`.md`) to the `content/` directory. They will automatically appear in the file browser on the homepage.

## Project Structure

```
my-memory/
├── app/
│   ├── page.tsx          # Homepage with file browser
│   ├── file/[slug]/      # Dynamic route for markdown files
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── MarkdownRenderer.tsx  # Markdown rendering component
├── content/              # Your markdown files go here
│   ├── welcome.md
│   └── example-note.md
└── lib/
    └── markdown.ts       # Utilities for reading markdown files
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-markdown** - Markdown rendering
- **remark-gfm** - GitHub Flavored Markdown support
- **Lucide React** - Icons

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Markdown Guide](https://www.markdownguide.org/)
