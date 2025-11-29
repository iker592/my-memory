import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AddFileModal from "@/components/AddFileModal";

describe("AddFileModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <AddFileModal isOpen={false} onClose={mockOnClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders modal when open", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole("heading", { name: /create new file/i })).toBeInTheDocument();
  });

  it("has file name input", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText(/my-note/i)).toBeInTheDocument();
  });

  it("has location input", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText(/projects\/web or leave empty/i)).toBeInTheDocument();
  });

  it("has content textarea", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText(/# My New Note/i)).toBeInTheDocument();
  });

  it("toggles markdown info panel", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    // Initially markdown info should not be visible
    expect(screen.queryByText(/Markdown Format Guide/i)).not.toBeInTheDocument();
    
    // Click to show markdown info
    const markdownInfoButton = screen.getByRole("button", { name: /markdown format/i });
    fireEvent.click(markdownInfoButton);
    
    // Should now be visible
    expect(screen.getByText(/Markdown Format Guide/i)).toBeInTheDocument();
    
    // Click again to hide
    fireEvent.click(markdownInfoButton);
    expect(screen.queryByText(/Markdown Format Guide/i)).not.toBeInTheDocument();
  });

  it("allows typing file name", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    const fileNameInput = screen.getByPlaceholderText(/my-note/i);
    fireEvent.change(fileNameInput, { target: { value: "test-file" } });
    
    expect(fileNameInput).toHaveValue("test-file");
  });

  it("allows typing location path", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    const locationInput = screen.getByPlaceholderText(/projects\/web or leave empty/i);
    fireEvent.change(locationInput, { target: { value: "notes/learning" } });
    
    expect(locationInput).toHaveValue("notes/learning");
  });

  it("allows typing content", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    const contentTextarea = screen.getByPlaceholderText(/# My New Note/i);
    fireEvent.change(contentTextarea, { target: { value: "# Test\n\nContent here" } });
    
    expect(contentTextarea).toHaveValue("# Test\n\nContent here");
  });

  it("sets file path when clicking example folder", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    const projectsButton = screen.getByRole("button", { name: /^projects$/ });
    fireEvent.click(projectsButton);
    
    const locationInput = screen.getByPlaceholderText(/projects\/web or leave empty/i);
    expect(locationInput).toHaveValue("projects");
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when X button is clicked", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    // Find the X button (it's in the header)
    const closeButtons = screen.getAllByRole("button");
    const xButton = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));
    
    if (xButton) {
      fireEvent.click(xButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it("shows submitting state when form is submitted", async () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    // Fill required fields
    const fileNameInput = screen.getByPlaceholderText(/my-note/i);
    const contentTextarea = screen.getByPlaceholderText(/# My New Note/i);
    
    fireEvent.change(fileNameInput, { target: { value: "test" } });
    fireEvent.change(contentTextarea, { target: { value: "content" } });
    
    // Submit the form
    const submitButton = screen.getByRole("button", { name: /create file/i });
    fireEvent.click(submitButton);
    
    // Should show "Creating..." text
    expect(screen.getByRole("button", { name: /creating/i })).toBeInTheDocument();
  });


  it("resets form fields when closed", () => {
    render(<AddFileModal isOpen={true} onClose={mockOnClose} />);
    
    // Fill in some fields
    const fileNameInput = screen.getByPlaceholderText(/my-note/i);
    const contentTextarea = screen.getByPlaceholderText(/# My New Note/i);
    
    fireEvent.change(fileNameInput, { target: { value: "test" } });
    fireEvent.change(contentTextarea, { target: { value: "content" } });
    
    // Click cancel
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});

