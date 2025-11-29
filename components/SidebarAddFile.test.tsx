import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SidebarAddFile from "@/components/SidebarAddFile";

describe("SidebarAddFile", () => {
  it("renders Add File button", () => {
    render(<SidebarAddFile />);
    expect(screen.getByRole("button", { name: /add file/i })).toBeInTheDocument();
  });

  it("opens modal when button is clicked", () => {
    render(<SidebarAddFile />);
    
    const addButton = screen.getByRole("button", { name: /add file/i });
    fireEvent.click(addButton);
    
    expect(screen.getByRole("heading", { name: /create new file/i })).toBeInTheDocument();
  });

  it("closes modal when cancel is clicked", () => {
    render(<SidebarAddFile />);
    
    // Open modal
    const addButton = screen.getByRole("button", { name: /add file/i });
    fireEvent.click(addButton);
    
    // Verify modal is open
    expect(screen.getByRole("heading", { name: /create new file/i })).toBeInTheDocument();
    
    // Close modal
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    // Modal should be closed
    expect(screen.queryByRole("heading", { name: /create new file/i })).not.toBeInTheDocument();
  });
});

