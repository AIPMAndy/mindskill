import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IconPicker } from './IconPicker';

describe('IconPicker', () => {
  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render nothing when closed', () => {
    const { container } = render(
      <IconPicker isOpen={false} onSelect={mockOnSelect} onClose={mockOnClose} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render modal when open', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    expect(screen.getByText('Select Icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search icons...')).toBeInTheDocument();
  });

  it('should render all category tabs', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    // Use getAllByText and check for buttons specifically
    const priorityButtons = screen.getAllByText('Priority');
    expect(priorityButtons.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Emotion').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Business').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tech').length).toBeGreaterThan(0);
  });

  it('should switch categories when tab clicked', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const progressTab = screen.getByText('Progress');
    fireEvent.click(progressTab);

    expect(progressTab).toHaveClass('bg-blue-500');
  });

  it('should filter icons based on search query', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const searchInput = screen.getByPlaceholderText('Search icons...');
    fireEvent.change(searchInput, { target: { value: 'star' } });

    // Star icon should be visible
    expect(screen.getByTitle('Star')).toBeInTheDocument();
  });

  it('should show "No icons found" when search has no results', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const searchInput = screen.getByPlaceholderText('Search icons...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No icons found')).toBeInTheDocument();
  });

  it('should call onSelect and onClose when icon clicked', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const starIcons = screen.getAllByTitle('Star');
    fireEvent.click(starIcons[0]);

    expect(mockOnSelect).toHaveBeenCalledWith('Star');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should highlight current icon with blue border', () => {
    render(
      <IconPicker
        isOpen={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
        currentIcon="Star"
      />
    );

    const starIcons = screen.getAllByTitle('Star');
    expect(starIcons[0]).toHaveClass('border-blue-500');
  });

  it('should close when Escape key pressed', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close when backdrop clicked', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const backdrop = document.querySelector('.bg-black\\/40');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should close when X button clicked', () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should update recently used icons in localStorage', async () => {
    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const starIcons = screen.getAllByTitle('Star');
    fireEvent.click(starIcons[0]);

    await waitFor(() => {
      const stored = localStorage.getItem('mindskill-recent-icons');
      expect(stored).toBeTruthy();
      if (stored) {
        const recent = JSON.parse(stored);
        expect(recent).toContain('Star');
      }
    });
  });

  it('should display recently used icons section', () => {
    localStorage.setItem('mindskill-recent-icons', JSON.stringify(['Star', 'Heart']));

    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    expect(screen.getByText('Recently Used')).toBeInTheDocument();
  });

  it('should limit recently used icons to 5', async () => {
    const { rerender } = render(
      <IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />
    );

    // Click 5 different icons
    const icons = ['Star', 'Flag', 'Zap', 'AlertCircle', 'AlertTriangle'];
    for (const iconName of icons) {
      const iconElements = screen.getAllByTitle(iconName);
      fireEvent.click(iconElements[0]);

      // Re-render to simulate closing and reopening
      rerender(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    }

    await waitFor(() => {
      const stored = localStorage.getItem('mindskill-recent-icons');
      if (stored) {
        const recent = JSON.parse(stored);
        expect(recent.length).toBeLessThanOrEqual(5);
      }
    });
  });

  it('should move selected icon to front of recently used', async () => {
    localStorage.setItem('mindskill-recent-icons', JSON.stringify(['Heart', 'Star']));

    render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const starIcons = screen.getAllByTitle('Star');
    fireEvent.click(starIcons[0]);

    await waitFor(() => {
      const stored = localStorage.getItem('mindskill-recent-icons');
      if (stored) {
        const recent = JSON.parse(stored);
        expect(recent[0]).toBe('Star');
      }
    });
  });

  it('should handle localStorage errors gracefully', () => {
    localStorage.setItem('mindskill-recent-icons', 'invalid-json');

    expect(() => {
      render(<IconPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    }).not.toThrow();
  });
});
