import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnClear = jest.fn();
  const mockOnResultClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input with placeholder', () => {
    render(
      <SearchBar
        searchQuery=""
        resultCount={0}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByPlaceholderText('Search nodes...');
    expect(input).toBeInTheDocument();
  });

  it('should call onSearchChange when typing', () => {
    render(
      <SearchBar
        searchQuery=""
        resultCount={0}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByPlaceholderText('Search nodes...');
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('test query');
  });

  it('should show clear button when query is not empty', () => {
    render(
      <SearchBar
        searchQuery="test"
        resultCount={3}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should hide clear button when query is empty', () => {
    render(
      <SearchBar
        searchQuery=""
        resultCount={0}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.queryByRole('button', { name: /clear/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should call onClear when clear button clicked', () => {
    render(
      <SearchBar
        searchQuery="test"
        resultCount={3}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it('should show result count with singular form', () => {
    render(
      <SearchBar
        searchQuery="test"
        resultCount={1}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('1 result')).toBeInTheDocument();
  });

  it('should show result count with plural form', () => {
    render(
      <SearchBar
        searchQuery="test"
        resultCount={3}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('3 results')).toBeInTheDocument();
  });

  it('should show "No results" when count is 0 and query is not empty', () => {
    render(
      <SearchBar
        searchQuery="test"
        resultCount={0}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('should not show result count when query is empty', () => {
    render(
      <SearchBar
        searchQuery=""
        resultCount={0}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    expect(screen.queryByText(/result/i)).not.toBeInTheDocument();
  });

  it('should call onClear when Escape key is pressed', () => {
    render(
      <SearchBar
        searchQuery="test"
        resultCount={3}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByPlaceholderText('Search nodes...');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(mockOnClear).toHaveBeenCalled();
  });

  it('should display search icon', () => {
    render(
      <SearchBar
        searchQuery=""
        resultCount={0}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );

    // Search icon should be present (lucide-react renders as svg)
    const container = screen.getByPlaceholderText('Search nodes...').parentElement;
    expect(container?.querySelector('svg')).toBeInTheDocument();
  });
});
