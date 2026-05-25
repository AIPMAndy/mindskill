import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarkerPicker } from './MarkerPicker';
import { NodeMarker } from '@/lib/types';

describe('MarkerPicker', () => {
  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<MarkerPicker isOpen={false} onSelect={mockOnSelect} onClose={mockOnClose} />);
    expect(screen.queryByText('Add Marker')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    expect(screen.getByText('Add Marker')).toBeInTheDocument();
  });

  it('closes on backdrop click', () => {
    const { container } = render(
      <MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />
    );
    const backdrop = container.querySelector('.bg-black\\/40');
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on X button click', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('switches between tabs', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

    const progressTab = screen.getByText('Progress');
    fireEvent.click(progressTab);
    expect(screen.getByText(/Progress:/)).toBeInTheDocument();

    const priorityTab = screen.getByText('Priority');
    fireEvent.click(priorityTab);
    expect(screen.getByText('P1')).toBeInTheDocument();
  });

  it('adds star marker', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const addButton = screen.getByText('Add Star');
    fireEvent.click(addButton);
    expect(mockOnSelect).toHaveBeenCalledWith({ type: 'star' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('adds check marker', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const checkTab = screen.getByRole('button', { name: /Check/ });
    fireEvent.click(checkTab);
    const checkButtons = screen.getAllByText('Check');
    const checkButton = checkButtons.find(el => el.classList.contains('text-green-700'));
    fireEvent.click(checkButton!.closest('button')!);
    expect(mockOnSelect).toHaveBeenCalledWith({ type: 'check' });
  });

  it('adds cross marker', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const checkTab = screen.getByText('Check');
    fireEvent.click(checkTab);
    const crossButton = screen.getByText('Cross');
    fireEvent.click(crossButton);
    expect(mockOnSelect).toHaveBeenCalledWith({ type: 'cross' });
  });

  it('adds progress marker with slider value', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const progressTab = screen.getByText('Progress');
    fireEvent.click(progressTab);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });

    const addButton = screen.getByText('Add Progress Marker');
    fireEvent.click(addButton);
    expect(mockOnSelect).toHaveBeenCalledWith({ type: 'progress', value: 75 });
  });

  it('adds priority marker', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const priorityTab = screen.getByText('Priority');
    fireEvent.click(priorityTab);

    const p1Button = screen.getByText('P1');
    fireEvent.click(p1Button);
    expect(mockOnSelect).toHaveBeenCalledWith({ type: 'priority', value: 1 });
  });

  it('adds custom marker with text and color', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const customTab = screen.getByText('Custom');
    fireEvent.click(customTab);

    const input = screen.getByPlaceholderText(/e.g., Important/);
    fireEvent.change(input, { target: { value: 'Important' } });

    const addButton = screen.getByText('Add Custom Marker');
    fireEvent.click(addButton);
    expect(mockOnSelect).toHaveBeenCalledWith({
      type: 'custom',
      value: 'Important',
      color: '#6B7280',
    });
  });

  it('disables custom marker button when text is empty', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const customTab = screen.getByText('Custom');
    fireEvent.click(customTab);

    const addButton = screen.getByText('Add Custom Marker');
    expect(addButton).toBeDisabled();
  });

  it('changes custom marker color', () => {
    render(<MarkerPicker isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
    const customTab = screen.getByText('Custom');
    fireEvent.click(customTab);

    const input = screen.getByPlaceholderText(/e.g., Important/);
    fireEvent.change(input, { target: { value: 'Test' } });

    const colorButton = screen.getByLabelText('Select color #DC2626');
    fireEvent.click(colorButton);

    const addButton = screen.getByText('Add Custom Marker');
    fireEvent.click(addButton);
    expect(mockOnSelect).toHaveBeenCalledWith({
      type: 'custom',
      value: 'Test',
      color: '#DC2626',
    });
  });
});
