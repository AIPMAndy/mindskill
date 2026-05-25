import { MindNode, NodeMarker } from './types';

describe('NodeMarker type', () => {
  it('accepts all valid marker types', () => {
    const markers: NodeMarker[] = [
      { type: 'star' },
      { type: 'check' },
      { type: 'cross' },
      { type: 'progress', value: 75 },
      { type: 'priority', value: 1 },
      { type: 'custom', value: 'custom text', color: '#ff0000' },
    ];

    expect(markers).toHaveLength(6);
  });

  it('accepts optional value and color', () => {
    const marker: NodeMarker = {
      type: 'star',
      value: 'optional',
      color: '#0000ff',
    };

    expect(marker.type).toBe('star');
    expect(marker.value).toBe('optional');
    expect(marker.color).toBe('#0000ff');
  });
});

describe('MindNode type', () => {
  it('accepts all new optional fields', () => {
    const node: MindNode = {
      id: 'node-1',
      text: 'Test Node',
      children: [],
      icon: 'Star',
      markers: [{ type: 'check' }],
      note: '# Test Note\nMarkdown content',
      link: 'https://example.com',
      tags: ['important', 'review'],
      priority: 1,
    };

    expect(node.id).toBe('node-1');
    expect(node.icon).toBe('Star');
    expect(node.priority).toBe(1);
    expect(node.tags).toHaveLength(2);
  });

  it('accepts priority values 1-5', () => {
    const priorities: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];

    priorities.forEach((priority) => {
      const node: MindNode = {
        id: 'node-1',
        text: 'Test',
        children: [],
        priority,
      };

      expect(node.priority).toBe(priority);
    });
  });

  it('allows undefined for all new fields', () => {
    const node: MindNode = {
      id: 'node-1',
      text: 'Test Node',
      children: [],
      icon: undefined,
      markers: undefined,
      note: undefined,
      link: undefined,
      tags: undefined,
      priority: undefined,
    };

    expect(node.icon).toBeUndefined();
    expect(node.priority).toBeUndefined();
  });

  it('maintains backward compatibility with existing fields', () => {
    const node: MindNode = {
      id: 'node-1',
      text: 'Test Node',
      children: [],
      position: { x: 100, y: 200 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
      collapsed: false,
      expanded: true,
    };

    expect(node.position).toEqual({ x: 100, y: 200 });
    expect(node.style?.backgroundColor).toBe('#ffffff');
    expect(node.collapsed).toBe(false);
  });

  it('supports nested nodes with new fields', () => {
    const parentNode: MindNode = {
      id: 'parent',
      text: 'Parent',
      children: [
        {
          id: 'child-1',
          text: 'Child 1',
          children: [],
          icon: 'Heart',
          priority: 2,
        },
        {
          id: 'child-2',
          text: 'Child 2',
          children: [],
          tags: ['urgent'],
          link: 'https://example.com',
        },
      ],
      priority: 1,
    };

    expect(parentNode.children).toHaveLength(2);
    expect(parentNode.children[0].icon).toBe('Heart');
    expect(parentNode.children[1].tags).toContain('urgent');
  });
});
