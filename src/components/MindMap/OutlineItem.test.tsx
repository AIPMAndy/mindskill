import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OutlineItem } from './OutlineItem';
import { MindNode } from '@/lib/types';

describe('OutlineItem', () => {
  const mockOnNodeClick = jest.fn();
  const mockOnDragStart = jest.fn();
  const mockOnDrop = jest.fn();

  const mockNode: MindNode = {
    id: '1',
    text: 'Test Node',
    children: [
      { id: '2', text: 'Child 1', children: [] },
      { id: '3', text: 'Child 2', children: [] },
    ],
  };

  const mockLeafNode: MindNode = {
    id: '4',
    text: 'Leaf Node',
    children: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders node text', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('calls onNodeClick when clicked', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );
    fireEvent.click(screen.getByText('Test Node'));
    expect(mockOnNodeClick).toHaveBeenCalledWith('1');
  });

  it('applies selected styles when isSelected is true', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={true}
      />
    );
    const element = screen.getByText('Test Node').closest('div');
    expect(element).toHaveClass('bg-blue-50');
  });

  it('renders expand/collapse button for nodes with children', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('does not render expand button for leaf nodes', () => {
    render(
      <OutlineItem
        node={mockLeafNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  it('toggles children visibility on expand/collapse', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();

    const toggleButton = screen.getAllByRole('button')[0];
    fireEvent.click(toggleButton);

    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('displays child count badge', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('applies correct indentation based on level', () => {
    const { container } = render(
      <OutlineItem
        node={mockNode}
        level={2}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );
    const element = container.querySelector('[style*="padding-left"]');
    expect(element).toHaveStyle({ paddingLeft: '40px' }); // 2 * 16 + 8
  });

  it('handles drag start', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
        onDragStart={mockOnDragStart}
      />
    );
    const element = screen.getByText('Test Node').closest('div');

    const dataTransfer = {
      effectAllowed: '',
      setData: jest.fn(),
      getData: jest.fn(),
      dropEffect: '',
    };

    fireEvent.dragStart(element!, { dataTransfer });
    expect(mockOnDragStart).toHaveBeenCalledWith('1');
  });

  it('handles drop', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
        onDrop={mockOnDrop}
      />
    );
    const element = screen.getByText('Test Node').closest('div');

    const dataTransfer = {
      getData: jest.fn(() => '5'),
      effectAllowed: 'move',
      dropEffect: 'move',
    };

    fireEvent.drop(element!, { dataTransfer });
    expect(mockOnDrop).toHaveBeenCalledWith('1', '5');
  });

  it('renders children recursively', () => {
    render(
      <OutlineItem
        node={mockNode}
        level={0}
        onNodeClick={mockOnNodeClick}
        isSelected={false}
      />
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
