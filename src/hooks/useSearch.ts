import { useState, useMemo } from 'react';
import { MindNode } from '../lib/types';

export interface SearchResult {
  nodeId: string;
  nodePath: string[];
  matchText: string;
}

export function useSearch(nodes: MindNode[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    function searchNode(node: MindNode, path: string[]) {
      if (node.text.toLowerCase().includes(query)) {
        results.push({
          nodeId: node.id,
          nodePath: [...path],
          matchText: node.text,
        });
      }

      if (node.children && node.children.length > 0) {
        const newPath = [...path, node.id];
        for (const child of node.children) {
          searchNode(child, newPath);
        }
      }
    }

    for (const node of nodes) {
      searchNode(node, []);
    }

    return results;
  }, [nodes, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    searchResults,
    setSearchQuery,
    clearSearch,
  };
}
