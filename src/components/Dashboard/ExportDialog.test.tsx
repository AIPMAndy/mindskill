import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportDialog } from './ExportDialog';
import { useExport } from '@/hooks/useExport';

// Mock the useExport hook
jest.mock('@/hooks/useExport');

const mockUseExport = useExport as jest.MockedFunction<typeof useExport>;

describe('ExportDialog', () => {
  const mockExportMindMap = jest.fn();
  const mockOnClose = jest.fn();
  const mockCanvasRef = { current: document.createElement('div') };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExport.mockReturnValue({
      isExporting: false,
      exportError: null,
      exportMindMap: mockExportMindMap,
    });
  });

  it('should render nothing when closed', () => {
    const { container } = render(
      <ExportDialog
        isOpen={false}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render dialog when open', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    expect(screen.getByText('Export Mind Map')).toBeInTheDocument();
    expect(screen.getByLabelText('PNG')).toBeInTheDocument();
    expect(screen.getByLabelText('PDF')).toBeInTheDocument();
    expect(screen.getByLabelText('SVG')).toBeInTheDocument();
  });

  it('should have PNG selected by default', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const pngRadio = screen.getByLabelText('PNG') as HTMLInputElement;
    expect(pngRadio.checked).toBe(true);
  });

  it('should allow format selection', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const pdfRadio = screen.getByLabelText('PDF') as HTMLInputElement;
    fireEvent.click(pdfRadio);

    expect(pdfRadio.checked).toBe(true);
  });

  it('should render filename input with default value', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const input = screen.getByLabelText('Filename') as HTMLInputElement;
    expect(input.value).toBe('mindmap');
  });

  it('should allow filename input change', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const input = screen.getByLabelText('Filename') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'my-mindmap' } });

    expect(input.value).toBe('my-mindmap');
  });

  it('should show quality slider for PNG format', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    expect(screen.getByLabelText('Quality')).toBeInTheDocument();
  });

  it('should hide quality slider for PDF format', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const pdfRadio = screen.getByLabelText('PDF');
    fireEvent.click(pdfRadio);

    expect(screen.queryByLabelText('Quality')).not.toBeInTheDocument();
  });

  it('should hide quality slider for SVG format', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const svgRadio = screen.getByLabelText('SVG');
    fireEvent.click(svgRadio);

    expect(screen.queryByLabelText('Quality')).not.toBeInTheDocument();
  });

  it('should call exportMindMap with correct options on export', async () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockExportMindMap).toHaveBeenCalledWith(mockCanvasRef.current, {
        format: 'png',
        filename: 'mindmap.png',
        quality: 1.0,
      });
    });
  });

  it('should call exportMindMap with custom filename and quality', async () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const filenameInput = screen.getByLabelText('Filename');
    fireEvent.change(filenameInput, { target: { value: 'custom-name' } });

    const qualitySlider = screen.getByLabelText('Quality');
    fireEvent.change(qualitySlider, { target: { value: '0.8' } });

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockExportMindMap).toHaveBeenCalledWith(mockCanvasRef.current, {
        format: 'png',
        filename: 'custom-name.png',
        quality: 0.8,
      });
    });
  });

  it('should call exportMindMap with PDF format', async () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const pdfRadio = screen.getByLabelText('PDF');
    fireEvent.click(pdfRadio);

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockExportMindMap).toHaveBeenCalledWith(mockCanvasRef.current, {
        format: 'pdf',
        filename: 'mindmap.pdf',
      });
    });
  });

  it('should disable export button while exporting', () => {
    mockUseExport.mockReturnValue({
      isExporting: true,
      exportError: null,
      exportMindMap: mockExportMindMap,
    });

    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const exportButton = screen.getByRole('button', { name: /exporting/i });
    expect(exportButton).toBeDisabled();
  });

  it('should show loading spinner when exporting', () => {
    mockUseExport.mockReturnValue({
      isExporting: true,
      exportError: null,
      exportMindMap: mockExportMindMap,
    });

    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    // Check for loading spinner (Loader2 icon)
    const button = screen.getByRole('button', { name: /exporting/i });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should display error message when export fails', () => {
    mockUseExport.mockReturnValue({
      isExporting: false,
      exportError: 'Export failed: Network error',
      exportMindMap: mockExportMindMap,
    });

    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    expect(screen.getByText('Export failed: Network error')).toBeInTheDocument();
  });

  it('should call onClose when Cancel button clicked', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when X button clicked', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when Escape key pressed', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when overlay clicked', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not call onClose when dialog content clicked', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={mockCanvasRef}
      />
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should not export when canvasRef is null', async () => {
    const nullRef = { current: null } as unknown as React.RefObject<HTMLElement>;

    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        canvasRef={nullRef}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockExportMindMap).not.toHaveBeenCalled();
    });
  });
});
