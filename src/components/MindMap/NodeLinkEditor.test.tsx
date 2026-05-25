import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NodeLinkEditor } from './NodeLinkEditor';
import { MindNode } from '@/lib/types';

describe('NodeLinkEditor', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const mockNodes: MindNode[] = [
    {
      id: '1',
      text: 'Root',
      children: [
        { id: '2', text: 'Child 1', children: [] },
        { id: '3', text: 'Child 2', children: [] },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<NodeLinkEditor isOpen={false} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(screen.queryByText('Add Link')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(screen.getByText('Add Link')).toBeInTheDocument();
  });

  it('displays existing external link', () => {
    render(
      <NodeLinkEditor
        isOpen={true}
        link="https://example.com"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const input = screen.getByPlaceholderText('https://example.com');
    expect(input).toHaveValue('https://example.com');
  });

  it('saves external URL with https prefix', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    const saveButton = screen.getByText('Save Link');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith('https://test.com');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('adds https prefix to URL without protocol', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(input, { target: { value: 'example.com' } });
    const saveButton = screen.getByText('Save Link');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith('https://example.com');
  });

  it('shows error for empty URL', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const saveButton = screen.getByText('Save Link');
    fireEvent.click(saveButton);
    expect(screen.getByText('URL cannot be empty')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('switches to internal node tab', () => {
    render(
      <NodeLinkEditor
        isOpen={true}
        onSave={mockOnSave}
        onClose={mockOnClose}
        nodes={mockNodes}
      />
    );
    const internalTab = screen.getByText('Internal Node');
    fireEvent.click(internalTab);
    expect(screen.getByText('Select Node')).toBeInTheDocument();
  });

  it('saves internal node link', () => {
    render(
      <NodeLinkEditor
        isOpen={true}
        onSave={mockOnSave}
        onClose={mockOnClose}
        nodes={mockNodes}
      />
    );
    const internalTab = screen.getByText('Internal Node');
    fireEvent.click(internalTab);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });
    const saveButton = screen.getByText('Save Link');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith('node:2');
  });

  it('shows error when no node selected for internal link', () => {
    render(
      <NodeLinkEditor
        isOpen={true}
        onSave={mockOnSave}
        onClose={mockOnClose}
        nodes={mockNodes}
      />
    );
    const internalTab = screen.getByText('Internal Node');
    fireEvent.click(internalTab);
    const saveButton = screen.getByText('Save Link');
    fireEvent.click(saveButton);
    expect(screen.getByText('Please select a node')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('detects existing internal node link', () => {
    render(
      <NodeLinkEditor
        isOpen={true}
        link="node:2"
        onSave={mockOnSave}
        onClose={mockOnClose}
        nodes={mockNodes}
      />
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('2');
  });

  it('cancels on Cancel button click', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click', () => {
    const { container } = render(
      <NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />
    );
    const backdrop = container.querySelector('.bg-black\\/40');
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on X button click', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('clears error when typing in URL field', () => {
    render(<NodeLinkEditor isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const saveButton = screen.getByText('Save Link');
    fireEvent.click(saveButton);
    expect(screen.getByText('URL cannot be empty')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    expect(screen.queryByText('URL cannot be empty')).not.toBeInTheDocument();
  });

  it('renders nested nodes in dropdown', () => {
    render(
      <NodeLinkEditor
        isOpen={true}
        onSave={mockOnSave}
        onClose={mockOnClose}
        nodes={mockNodes}
      />
    );
    const internalTab = screen.getByText('Internal Node');
    fireEvent.click(internalTab);
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText(/Child 1/)).toBeInTheDocument();
    expect(screen.getByText(/Child 2/)).toBeInTheDocument();
  });
});
