import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarkerBadge } from './MarkerBadge';
import { NodeMarker } from '@/lib/types';

describe('MarkerBadge', () => {
  it('renders star marker', () => {
    const marker: NodeMarker = { type: 'star' };
    const { container } = render(<MarkerBadge marker={marker} />);
    const element = container.querySelector('[title="Star marker"]');
    expect(element).toBeInTheDocument();
  });

  it('renders check marker', () => {
    const marker: NodeMarker = { type: 'check' };
    const { container } = render(<MarkerBadge marker={marker} />);
    const element = container.querySelector('[title="Check marker"]');
    expect(element).toBeInTheDocument();
  });

  it('renders cross marker', () => {
    const marker: NodeMarker = { type: 'cross' };
    const { container } = render(<MarkerBadge marker={marker} />);
    const element = container.querySelector('[title="Cross marker"]');
    expect(element).toBeInTheDocument();
  });

  it('renders progress marker with percentage', () => {
    const marker: NodeMarker = { type: 'progress', value: 75 };
    const { container } = render(<MarkerBadge marker={marker} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
    const element = container.querySelector('[title="Progress: 75%"]');
    expect(element).toBeInTheDocument();
  });

  it('renders progress marker with 0% default', () => {
    const marker: NodeMarker = { type: 'progress' };
    render(<MarkerBadge marker={marker} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('clamps progress to 0-100 range', () => {
    const marker: NodeMarker = { type: 'progress', value: 150 };
    const { container } = render(<MarkerBadge marker={marker} />);
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar?.style.width).toBe('100%');
  });

  it('renders priority marker P1', () => {
    const marker: NodeMarker = { type: 'priority', value: 1 };
    render(<MarkerBadge marker={marker} />);
    expect(screen.getByText('P1')).toBeInTheDocument();
  });

  it('renders priority marker P3 as default', () => {
    const marker: NodeMarker = { type: 'priority' };
    render(<MarkerBadge marker={marker} />);
    expect(screen.getByText('P3')).toBeInTheDocument();
  });

  it('renders custom marker with text', () => {
    const marker: NodeMarker = { type: 'custom', value: 'Important', color: '#DC2626' };
    render(<MarkerBadge marker={marker} />);
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('renders custom marker with default color', () => {
    const marker: NodeMarker = { type: 'custom', value: 'Note' };
    const { container } = render(<MarkerBadge marker={marker} />);
    const text = screen.getByText('Note');
    expect(text).toHaveStyle({ color: '#6B7280' });
  });

  it('renders nothing for unknown marker type', () => {
    const marker = { type: 'unknown' } as any;
    const { container } = render(<MarkerBadge marker={marker} />);
    expect(container.firstChild?.firstChild).toBeNull();
  });
});
