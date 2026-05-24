import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import { MindNode } from '../lib/types';

describe('useSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createNode = (id: string, text: string, children: MindNode[] = []): MindNode => ({
    id,
    text,
    children,
  });

  it('should initialize with empty query and results', () => {
    const { result } = renderHook(() => useSearch([]));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.searchResults).toEqual([]);
  });

  it('should return empty results for empty query', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Child A'),
        createNode('3', 'Child B'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('');
    });

    expect(result.current.searchResults).toEqual([]);
  });

  it('should debounce search by 300ms', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Hello World'),
        createNode('3', 'Goodbye'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('hello');
    });

    expect(result.current.searchResults).toEqual([]);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toEqual([
      {
        nodeId: '2',
        nodePath: ['1'],
        matchText: 'Hello World',
      },
    ]);
  });

  it('should find nodes by text (case-insensitive)', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Hello World'),
        createNode('3', 'Goodbye'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('hello');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toEqual([
      {
        nodeId: '2',
        nodePath: ['1'],
        matchText: 'Hello World',
      },
    ]);
  });

  it('should find nested nodes', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Parent', [
          createNode('3', 'Child', [
            createNode('4', 'Deep Node'),
          ]),
        ]),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('deep');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toEqual([
      {
        nodeId: '4',
        nodePath: ['1', '2', '3'],
        matchText: 'Deep Node',
      },
    ]);
  });

  it('should return correct node paths', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Child A', [
          createNode('3', 'Grandchild'),
        ]),
        createNode('4', 'Child B'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('grandchild');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toEqual([
      {
        nodeId: '3',
        nodePath: ['1', '2'],
        matchText: 'Grandchild',
      },
    ]);
  });

  it('should return multiple matches', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Test Node 1'),
        createNode('3', 'Another Node'),
        createNode('4', 'Test Node 2'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toHaveLength(2);
    expect(result.current.searchResults).toEqual(
      expect.arrayContaining([
        {
          nodeId: '2',
          nodePath: ['1'],
          matchText: 'Test Node 1',
        },
        {
          nodeId: '4',
          nodePath: ['1'],
          matchText: 'Test Node 2',
        },
      ])
    );
  });

  it('should clear search and reset results', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Hello'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('hello');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toHaveLength(1);

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.searchResults).toEqual([]);
  });

  it('should handle case-insensitive search correctly', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'UPPERCASE'),
        createNode('3', 'lowercase'),
        createNode('4', 'MixedCase'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('case');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toHaveLength(3);
    expect(result.current.searchResults).toEqual(
      expect.arrayContaining([
        {
          nodeId: '2',
          nodePath: ['1'],
          matchText: 'UPPERCASE',
        },
        {
          nodeId: '3',
          nodePath: ['1'],
          matchText: 'lowercase',
        },
        {
          nodeId: '4',
          nodePath: ['1'],
          matchText: 'MixedCase',
        },
      ])
    );
  });

  it('should search across multiple root nodes', () => {
    const nodes = [
      createNode('1', 'First Root', [
        createNode('2', 'Target'),
      ]),
      createNode('3', 'Second Root', [
        createNode('4', 'Target'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('target');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toHaveLength(2);
    expect(result.current.searchResults).toEqual(
      expect.arrayContaining([
        {
          nodeId: '2',
          nodePath: ['1'],
          matchText: 'Target',
        },
        {
          nodeId: '4',
          nodePath: ['3'],
          matchText: 'Target',
        },
      ])
    );
  });

  it('should handle empty nodes array', () => {
    const { result } = renderHook(() => useSearch([]));

    act(() => {
      result.current.setSearchQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toEqual([]);
  });

  it('should update results when query changes', () => {
    const nodes = [
      createNode('1', 'Root', [
        createNode('2', 'Apple'),
        createNode('3', 'Banana'),
      ]),
    ];

    const { result } = renderHook(() => useSearch(nodes));

    act(() => {
      result.current.setSearchQuery('apple');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toHaveLength(1);
    expect(result.current.searchResults[0].nodeId).toBe('2');

    act(() => {
      result.current.setSearchQuery('banana');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchResults).toHaveLength(1);
    expect(result.current.searchResults[0].nodeId).toBe('3');
  });
});
