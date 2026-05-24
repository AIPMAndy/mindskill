import { useState, useMemo, useEffect } from 'react';
import { MindNode } from '../lib/types';

export interface SearchResult {
  nodeId: string;
  nodePath: string[];
  matchText: string;
}

export function useSearch(nodes: MindNode[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const query = debouncedQuery.toLowerCase();

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
  }, [nodes, debouncedQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return {
    searchQuery,
    searchResults,
    setSearchQuery,
    clearSearch,
  };
}
