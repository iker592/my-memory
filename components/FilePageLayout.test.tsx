import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FilePageLayout from "@/components/FilePageLayout";
import type { FileTreeNode } from "@/lib/markdown";

vi.mock("next/navigation", () => ({
  usePathname: () => "/file/content/test",
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, className, onClick }: any) => (
    <a href={href} className={className} onClick={onClick}>
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
        name: "test.md",
        path: "content/test",
        type: "file",
      },
    ],
  },
];

describe("FilePageLayout", () => {
  const defaultProps = {
    fileTree: sampleTree,
    title: "Test Document",
    lastModified: new Date("2025-01-01"),
    content: "# Test Content\n\nSome text here.",
    fileName: "test.md",
  };

  it("renders the document title and last modified date", () => {
    render(<FilePageLayout {...defaultProps} />);

    expect(screen.getByRole("heading", { name: /test document/i })).toBeInTheDocument();
    expect(screen.getByText(/last modified/i)).toBeInTheDocument();
  });

  it("renders the file content", () => {
    render(<FilePageLayout {...defaultProps} />);

    expect(screen.getByText(/some text here/i)).toBeInTheDocument();
  });

  it("renders the file explorer sidebar", () => {
    render(<FilePageLayout {...defaultProps} />);

    // "Files" heading (case-sensitive)
    expect(screen.getByText("Files")).toBeInTheDocument();
  });

  it("has a mobile menu button", () => {
    render(<FilePageLayout {...defaultProps} />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("opens sidebar when mobile menu button is clicked", () => {
    render(<FilePageLayout {...defaultProps} />);

    // Initially sidebar should be off-screen on mobile (has -translate-x-full)
    const sidebar = screen.getByRole("complementary");
    expect(sidebar.className).toContain("-translate-x-full");

    // Click the menu button
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    // Sidebar should now be visible (has translate-x-0)
    expect(sidebar.className).toContain("translate-x-0");
  });

  it("closes sidebar when close button is clicked", () => {
    render(<FilePageLayout {...defaultProps} />);

    // Open the sidebar first
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    const sidebar = screen.getByRole("complementary");
    expect(sidebar.className).toContain("translate-x-0");

    // Click close button
    const closeButton = screen.getByRole("button", { name: /close sidebar/i });
    fireEvent.click(closeButton);

    // Sidebar should be hidden again
    expect(sidebar.className).toContain("-translate-x-full");
  });

  it("renders back to home link", () => {
    render(<FilePageLayout {...defaultProps} />);

    const backLinks = screen.getAllByRole("link", { name: /back to home/i });
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks[0]).toHaveAttribute("href", "/");
  });
});

