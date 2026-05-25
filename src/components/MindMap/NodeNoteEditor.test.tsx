import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NodeNoteEditor } from './NodeNoteEditor';

describe('NodeNoteEditor', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<NodeNoteEditor isOpen={false} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(screen.queryByText('Node Note')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(screen.getByText('Node Note')).toBeInTheDocument();
  });

  it('displays existing note text', () => {
    render(
      <NodeNoteEditor
        isOpen={true}
        note="Existing note"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const textarea = screen.getByPlaceholderText(/Write your note here/);
    expect(textarea).toHaveValue('Existing note');
  });

  it('updates note text on input', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/Write your note here/);
    fireEvent.change(textarea, { target: { value: 'New note text' } });
    expect(textarea).toHaveValue('New note text');
  });

  it('saves note on Save button click', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/Write your note here/);
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    const saveButton = screen.getByText('Save Note');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith('Test note');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('cancels on Cancel button click', () => {
    render(
      <NodeNoteEditor
        isOpen={true}
        note="Original"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const textarea = screen.getByPlaceholderText(/Write your note here/);
    fireEvent.change(textarea, { target: { value: 'Modified' } });
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click', () => {
    const { container } = render(
      <NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />
    );
    const backdrop = container.querySelector('.bg-black\\/40');
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on X button click', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('switches to preview mode', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);
    expect(screen.queryByPlaceholderText(/Write your note here/)).not.toBeInTheDocument();
  });

  it('switches back to edit mode', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(screen.getByPlaceholderText(/Write your note here/)).toBeInTheDocument();
  });

  it('displays character count', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/Write your note here/);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByText('5 characters')).toBeInTheDocument();
  });

  it('resets note text when reopened with different note', () => {
    const { rerender } = render(
      <NodeNoteEditor
        isOpen={true}
        note="First note"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    let textarea = screen.getByPlaceholderText(/Write your note here/);
    expect(textarea).toHaveValue('First note');

    rerender(
      <NodeNoteEditor
        isOpen={false}
        note="First note"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    rerender(
      <NodeNoteEditor
        isOpen={true}
        note="Second note"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    textarea = screen.getByPlaceholderText(/Write your note here/);
    expect(textarea).toHaveValue('Second note');
  });

  it('renders markdown preview with bold text', () => {
    render(<NodeNoteEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/Write your note here/);
    fireEvent.change(textarea, { target: { value: '**bold text**' } });
    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);
    const preview = document.querySelector('.prose');
    expect(preview?.innerHTML).toContain('<strong');
  });
});
