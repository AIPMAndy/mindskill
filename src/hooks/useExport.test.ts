import { renderHook, act, waitFor } from '@testing-library/react';
import { useExport } from './useExport';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

jest.mock('html-to-image');
jest.mock('jspdf');

describe('useExport', () => {
  let mockElement: HTMLElement;
  let mockClick: jest.Mock;
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockClick = jest.fn();

    originalCreateElement = document.createElement;
    document.createElement = jest.fn((tagName: string) => {
      if (tagName === 'a') {
        return {
          click: mockClick,
          download: '',
          href: '',
        } as any;
      }
      return originalCreateElement.call(document, tagName);
    });

    (htmlToImage.toPng as jest.Mock).mockClear();
    (htmlToImage.toSvg as jest.Mock).mockClear();
    (jsPDF as unknown as jest.Mock).mockClear();
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useExport());

    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBe(null);
    expect(typeof result.current.exportMindMap).toBe('function');
  });

  it('should export to PNG format', async () => {
    const mockDataUrl = 'data:image/png;base64,mockdata';
    (htmlToImage.toPng as jest.Mock).mockResolvedValue(mockDataUrl);

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'png',
        filename: 'test.png',
        quality: 0.9,
      });
    });

    expect(htmlToImage.toPng).toHaveBeenCalledWith(mockElement, { quality: 0.9 });
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBe(null);
  });

  it('should export to PNG with default filename and quality', async () => {
    const mockDataUrl = 'data:image/png;base64,mockdata';
    (htmlToImage.toPng as jest.Mock).mockResolvedValue(mockDataUrl);

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'png',
      });
    });

    expect(htmlToImage.toPng).toHaveBeenCalledWith(mockElement, { quality: 1.0 });
    expect(mockClick).toHaveBeenCalled();
  });

  it('should export to SVG format', async () => {
    const mockDataUrl = 'data:image/svg+xml;base64,mockdata';
    (htmlToImage.toSvg as jest.Mock).mockResolvedValue(mockDataUrl);

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'svg',
        filename: 'test.svg',
      });
    });

    expect(htmlToImage.toSvg).toHaveBeenCalledWith(mockElement);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBe(null);
  });

  it('should export to PDF format', async () => {
    const mockDataUrl = 'data:image/png;base64,mockdata';
    (htmlToImage.toPng as jest.Mock).mockResolvedValue(mockDataUrl);

    const mockPdfInstance = {
      addImage: jest.fn(),
      save: jest.fn(),
      internal: {
        pageSize: {
          getWidth: jest.fn().mockReturnValue(210),
          getHeight: jest.fn().mockReturnValue(297),
        },
      },
    };

    (jsPDF as unknown as jest.Mock).mockReturnValue(mockPdfInstance);

    Object.defineProperty(mockElement, 'offsetWidth', { value: 800, configurable: true });
    Object.defineProperty(mockElement, 'offsetHeight', { value: 600, configurable: true });

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'pdf',
        filename: 'test.pdf',
      });
    });

    expect(htmlToImage.toPng).toHaveBeenCalledWith(mockElement, { quality: 1.0 });
    expect(jsPDF).toHaveBeenCalled();
    expect(mockPdfInstance.addImage).toHaveBeenCalled();
    expect(mockPdfInstance.save).toHaveBeenCalledWith('test.pdf');
    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBe(null);
  });

  it('should set isExporting to true during export', async () => {
    const mockDataUrl = 'data:image/png;base64,mockdata';
    let resolveExport: (value: string) => void;
    const exportPromise = new Promise<string>((resolve) => {
      resolveExport = resolve;
    });

    (htmlToImage.toPng as jest.Mock).mockReturnValue(exportPromise);

    const { result } = renderHook(() => useExport());

    let exportPromiseResult: Promise<void>;
    act(() => {
      exportPromiseResult = result.current.exportMindMap(mockElement, {
        format: 'png',
        filename: 'test.png',
      });
    });

    expect(result.current.isExporting).toBe(true);

    await act(async () => {
      resolveExport!(mockDataUrl);
      await exportPromiseResult!;
    });

    expect(result.current.isExporting).toBe(false);
  });

  it('should handle export errors', async () => {
    const mockError = new Error('Export failed');
    (htmlToImage.toPng as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'png',
        filename: 'test.png',
      });
    });

    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBe('Export failed');
  });

  it('should clear previous error on new export attempt', async () => {
    const mockError = new Error('First error');
    (htmlToImage.toPng as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'png',
        filename: 'test.png',
      });
    });

    expect(result.current.exportError).toBe('First error');

    const mockDataUrl = 'data:image/png;base64,mockdata';
    (htmlToImage.toPng as jest.Mock).mockResolvedValue(mockDataUrl);

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'png',
        filename: 'test2.png',
      });
    });

    expect(result.current.exportError).toBe(null);
  });

  it('should generate default filename with timestamp', async () => {
    const mockDataUrl = 'data:image/png;base64,mockdata';
    (htmlToImage.toPng as jest.Mock).mockResolvedValue(mockDataUrl);

    let capturedDownload = '';
    const capturedMockClick = jest.fn();

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === 'a') {
        const mockAnchor = {
          click: capturedMockClick,
          download: '',
          href: '',
        };
        Object.defineProperty(mockAnchor, 'download', {
          get() { return capturedDownload; },
          set(value: string) { capturedDownload = value; },
          configurable: true,
        });
        return mockAnchor as any;
      }
      return originalCreateElement.call(document, tagName);
    });

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'png',
      });
    });

    expect(capturedDownload).toMatch(/^mindmap-\d+\.png$/);
  });

  it('should handle PDF export errors', async () => {
    const mockError = new Error('PDF generation failed');
    (htmlToImage.toPng as jest.Mock).mockResolvedValue('data:image/png;base64,mockdata');
    (jsPDF as unknown as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'pdf',
        filename: 'test.pdf',
      });
    });

    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBe('PDF generation failed');
  });

  it('should handle SVG export errors', async () => {
    const mockError = new Error('SVG export failed');
    (htmlToImage.toSvg as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportMindMap(mockElement, {
        format: 'svg',
        filename: 'test.svg',
      });
    });

    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBe('SVG export failed');
  });
});
