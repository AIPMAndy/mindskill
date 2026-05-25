import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OutlineView } from './OutlineView';
import { MindNode } from '@/lib/types';

describe('OutlineView', () => {
  const mockOnNodeClick = jest.fn();

  const mockNodes: MindNode[] = [
    {
      id: '1',
      text: 'Root Node',
      children: [
        {
          id: '2',
          text: 'Child 1',
          children: [
            { id: '3', text: 'Grandchild 1', children: [] },
          ],
        },
        { id: '4', text: 'Child 2', children: [] },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders outline view with nodes', () => {
    render(<OutlineView nodes={mockNodes} onNodeClick={mockOnNodeClick} />);
    expect(screen.getByText('Outline')).toBeInTheDocument();
    expect(screen.getByText('Root Node')).toBeInTheDocument();
  });

  it('renders empty state when no nodes', () => {
    render(<OutlineView nodes={[]} onNodeClick={mockOnNodeClick} />);
    expect(screen.getByText('No nodes to display')).toBeInTheDocument();
  });

  it('calls onNodeClick when node is clicked', () => {
    render(<OutlineView nodes={mockNodes} onNodeClick={mockOnNodeClick} />);
    const rootNode = screen.getByText('Root Node');
    fireEvent.click(rootNode);
    expect(mockOnNodeClick).toHaveBeenCalledWith('1');
  });

  it('highlights selected node', () => {
    render(
      <OutlineView nodes={mockNodes} onNodeClick={mockOnNodeClick} selectedNodeId="1" />
    );
    const rootNode = screen.getByText('Root Node').closest('div');
    expect(rootNode).toHaveClass('bg-blue-50');
  });

  it('renders nested children', () => {
    render(<OutlineView nodes={mockNodes} onNodeClick={mockOnNodeClick} />);
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('displays child count badge', () => {
    render(<OutlineView nodes={mockNodes} onNodeClick={mockOnNodeClick} />);
    const badges = screen.getAllByText('2');
    expect(badges.length).toBeGreaterThan(0);
  });
});
