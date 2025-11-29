import { fireEvent, render, screen } from "@testing-library/react";
import type { FileTreeNode } from "@/lib/markdown";
import FileExplorer from "@/components/FileExplorer";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, className, style, onClick }: any) => (
    <a href={href} className={className} style={style} onClick={onClick}>
      {children}
    </a>
  ),
}));

const sampleTree: FileTreeNode[] = [
  {
    name: "Content",
    path: "content",
    type: "directory",
    children: [
      {
        name: "notes",
        path: "content/notes",
        type: "directory",
        children: [
          {
            name: "welcome.md",
            path: "content/notes/welcome",
            type: "file",
          },
        ],
      },
      {
        name: "snippets",
        path: "content/snippets",
        type: "directory",
        children: [
          {
            name: "script.ts",
            path: "content/snippets/script",
            type: "file",
          },
        ],
      },
    ],
  },
];

describe("FileExplorer", () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  it("expands folders for the current path and highlights the active file", () => {
    mockUsePathname.mockReturnValue("/file/content/notes/welcome");

    render(<FileExplorer tree={sampleTree} basePath="/file" />);

    const activeLink = screen.getByRole("link", { name: /welcome/i });
    expect(activeLink).toHaveAttribute("href", "/file/content/notes/welcome");
    expect(activeLink.className).toContain("bg-blue-100");

    // Parent folders along the path should render their contents
    expect(screen.getByRole("button", { name: /notes/i })).toBeInTheDocument();
  });

  it("allows users to collapse expanded folders to hide children", () => {
    mockUsePathname.mockReturnValue("/file/content/snippets/script");

    render(<FileExplorer tree={sampleTree} basePath="/file" />);

    expect(screen.getByText("script")).toBeInTheDocument();

    const toggleButton = screen.getByRole("button", { name: /snippets/i });
    fireEvent.click(toggleButton);

    expect(screen.queryByText("script")).toBeNull();
  });

  it("calls onFileClick callback when a file link is clicked", () => {
    mockUsePathname.mockReturnValue("/file/content/notes/welcome");
    const onFileClick = vi.fn();

    render(<FileExplorer tree={sampleTree} basePath="/file" onFileClick={onFileClick} />);

    const fileLink = screen.getByRole("link", { name: /welcome/i });
    fireEvent.click(fileLink);

    expect(onFileClick).toHaveBeenCalledTimes(1);
  });

  it("does not crash when onFileClick is not provided", () => {
    mockUsePathname.mockReturnValue("/file/content/notes/welcome");

    render(<FileExplorer tree={sampleTree} basePath="/file" />);

    const fileLink = screen.getByRole("link", { name: /welcome/i });
    
    // Should not throw
    expect(() => fireEvent.click(fileLink)).not.toThrow();
  });
});
