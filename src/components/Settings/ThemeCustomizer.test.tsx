import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeCustomizer } from './ThemeCustomizer';
import { Theme } from '@/lib/themes';

describe('ThemeCustomizer', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const mockTheme: Theme = {
    id: 'test',
    name: 'Test Theme',
    colors: {
      primary: '#000000',
      secondary: '#111111',
      accent: '#0000FF',
      background: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#CCCCCC',
      borderHover: '#0000FF',
      shadow: 'rgba(0,0,0,0.1)',
      rootGradientFrom: '#000000',
      rootGradientTo: '#111111',
      connection: '#0000FF',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(
      <ThemeCustomizer
        isOpen={false}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByText('Theme Customizer')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Theme Customizer')).toBeInTheDocument();
  });

  it('displays current theme colors', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const primaryInputs = screen.getAllByDisplayValue('#000000');
    expect(primaryInputs.length).toBeGreaterThan(0);
  });

  it('updates color when changed', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const textInputs = screen.getAllByDisplayValue('#0000FF');
    const accentInput = textInputs[0];
    fireEvent.change(accentInput, { target: { value: '#FF0000' } });
    expect(accentInput).toHaveValue('#FF0000');
  });

  it('updates theme name', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const nameInput = screen.getByDisplayValue('Test Theme');
    fireEvent.change(nameInput, { target: { value: 'My Custom Theme' } });
    expect(nameInput).toHaveValue('My Custom Theme');
  });

  it('saves theme on Save button click', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const saveButton = screen.getByText('Save Theme');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes on Cancel button click', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes on backdrop click', () => {
    const { container } = render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const backdrop = container.querySelector('.bg-black\\/40');
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes on X button click', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('resets to default on Reset button click', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Theme');
    fireEvent.change(nameInput, { target: { value: 'Modified' } });
    expect(nameInput).toHaveValue('Modified');

    const resetButton = screen.getByText('Reset to Default');
    fireEvent.click(resetButton);

    expect(nameInput).toHaveValue('Test Theme');
  });

  it('renders preview pane', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Root Node')).toBeInTheDocument();
    expect(screen.getByText('Child Node')).toBeInTheDocument();
    expect(screen.getByText('Selected Node')).toBeInTheDocument();
  });

  it('renders all color fields', () => {
    render(
      <ThemeCustomizer
        isOpen={true}
        currentTheme={mockTheme}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Accent')).toBeInTheDocument();
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
