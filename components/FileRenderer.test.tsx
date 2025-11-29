import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FileRenderer from "@/components/FileRenderer";

describe("FileRenderer", () => {
  describe("markdown files", () => {
    it("renders markdown content with headings", () => {
      const content = "# Main Title\n\nSome paragraph text.\n\n## Secondary Heading";
      render(<FileRenderer content={content} fileName="test.md" />);

      expect(screen.getByRole("heading", { name: /main title/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /secondary heading/i })).toBeInTheDocument();
      expect(screen.getByText(/some paragraph text/i)).toBeInTheDocument();
    });

    it("renders inline code with appropriate styling container", () => {
      const content = "Use `console.log()` for debugging.";
      const { container } = render(<FileRenderer content={content} fileName="test.md" />);

      const codeElement = container.querySelector("code");
      expect(codeElement).toBeInTheDocument();
      expect(codeElement?.textContent).toBe("console.log()");
    });

    it("renders code blocks with pre element", () => {
      const content = "```typescript\nconst x = 1;\n```";
      const { container } = render(<FileRenderer content={content} fileName="test.md" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toContain("const x = 1;");
    });

    it("renders lists correctly", () => {
      const content = "- Item 1\n- Item 2\n- Item 3";
      render(<FileRenderer content={content} fileName="test.md" />);

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("renders links correctly", () => {
      const content = "[Click here](https://example.com)";
      render(<FileRenderer content={content} fileName="test.md" />);

      const link = screen.getByRole("link", { name: /click here/i });
      expect(link).toHaveAttribute("href", "https://example.com");
    });
  });

  describe("JSON files", () => {
    it("renders JSON content in a code block", () => {
      const content = '{"name": "test", "value": 123}';
      const { container } = render(<FileRenderer content={content} fileName="config.json" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      // Should be pretty-printed
      expect(preElement?.textContent).toContain('"name": "test"');
    });

    it("handles invalid JSON gracefully", () => {
      const content = "{ invalid json }";
      const { container } = render(<FileRenderer content={content} fileName="broken.json" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toBe("{ invalid json }");
    });
  });

  describe("code files", () => {
    it("renders JavaScript files as code", () => {
      const content = "const greeting = 'Hello';";
      const { container } = render(<FileRenderer content={content} fileName="script.js" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toBe(content);
    });

    it("renders TypeScript files as code", () => {
      const content = "const x: number = 42;";
      const { container } = render(<FileRenderer content={content} fileName="app.ts" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toBe(content);
    });

    it("renders Python files as code", () => {
      const content = "def hello():\n    print('Hello')";
      const { container } = render(<FileRenderer content={content} fileName="script.py" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toBe(content);
    });

    it("renders shell scripts as code", () => {
      const content = "#!/bin/bash\necho 'Hello'";
      const { container } = render(<FileRenderer content={content} fileName="run.sh" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toBe(content);
    });
  });

  describe("fallback rendering", () => {
    it("renders unknown file types as plain text", () => {
      const content = "Some plain text content";
      const { container } = render(<FileRenderer content={content} fileName="readme" />);

      const preElement = container.querySelector("pre");
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toBe(content);
    });
  });
});

