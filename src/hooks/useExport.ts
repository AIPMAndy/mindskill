import { useState, useCallback } from 'react';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export type ExportFormat = 'png' | 'pdf' | 'svg';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  quality?: number;
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportMindMap = useCallback(async (element: HTMLElement, options: ExportOptions) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const { format, filename, quality = 1.0 } = options;
      const defaultFilename = filename || `mindmap-${Date.now()}.${format}`;

      switch (format) {
        case 'png':
          await exportToPng(element, defaultFilename, quality);
          break;
        case 'svg':
          await exportToSvg(element, defaultFilename);
          break;
        case 'pdf':
          await exportToPdf(element, defaultFilename);
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setExportError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportError,
    exportMindMap,
  };
}

async function exportToPng(element: HTMLElement, filename: string, quality: number) {
  const dataUrl = await toPng(element, { quality });
  downloadFile(dataUrl, filename);
}

async function exportToSvg(element: HTMLElement, filename: string) {
  const dataUrl = await toSvg(element);
  downloadFile(dataUrl, filename);
}

async function exportToPdf(element: HTMLElement, filename: string) {
  const dataUrl = await toPng(element, { quality: 1.0 });

  const pdf = new jsPDF({
    orientation: element.offsetWidth > element.offsetHeight ? 'landscape' : 'portrait',
    unit: 'px',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = element.offsetWidth;
  const imgHeight = element.offsetHeight;

  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;

  const x = (pdfWidth - width) / 2;
  const y = (pdfHeight - height) / 2;

  pdf.addImage(dataUrl, 'PNG', x, y, width, height);
  pdf.save(filename);
}

function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
