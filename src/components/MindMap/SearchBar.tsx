import { Search, X } from 'lucide-react';
import { forwardRef } from 'react';

interface SearchBarProps {
  searchQuery: string;
  resultCount: number;
  onSearchChange: (query: string) => void;
  onClear: () => void;
  onResultClick?: (nodeId: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ searchQuery, resultCount, onSearchChange, onClear }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        onClear();
      }
    };

    const getResultText = () => {
      if (!searchQuery) return null;

      if (resultCount === 0) return 'No results';
      if (resultCount === 1) return '1 result';
      return `${resultCount} results`;
    };

    return (
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={ref}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search nodes..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={onClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {getResultText()}
          </div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
