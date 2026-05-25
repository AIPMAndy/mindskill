import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu } from './ContextMenu';

describe('ContextMenu', () => {
  const mockCallbacks = {
    onAddChild: jest.fn(),
    onAddSibling: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    onAddIcon: jest.fn(),
    onAddMarker: jest.fn(),
    onAddNote: jest.fn(),
    onAddLink: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render nothing when closed', () => {
    const { container } = render(
      <ContextMenu
        isOpen={false}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render at correct position when open', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 150, y: 250 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    const menu = screen.getByRole('menu');
    expect(menu).toHaveStyle({
      top: '250px',
      left: '150px',
    });
    expect(menu).toHaveClass('fixed');
  });

  it('should render all menu items', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    expect(screen.getByText('Add Child Node')).toBeInTheDocument();
    expect(screen.getByText('Add Sibling Node')).toBeInTheDocument();
    expect(screen.getByText('Edit Node')).toBeInTheDocument();
    expect(screen.getByText('Add Icon')).toBeInTheDocument();
    expect(screen.getByText('Add Marker')).toBeInTheDocument();
    expect(screen.getByText('Add Note')).toBeInTheDocument();
    expect(screen.getByText('Add Link')).toBeInTheDocument();
    expect(screen.getByText('Delete Node')).toBeInTheDocument();
  });

  it('should call onAddChild and onClose when Add Child clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Add Child Node'));

    expect(mockCallbacks.onAddChild).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should call onAddSibling and onClose when Add Sibling clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Add Sibling Node'));

    expect(mockCallbacks.onAddSibling).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should call onEdit and onClose when Edit clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Edit Node'));

    expect(mockCallbacks.onEdit).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should call onDelete and onClose when Delete clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Delete Node'));

    expect(mockCallbacks.onDelete).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should call onAddIcon and onClose when Add Icon clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Add Icon'));

    expect(mockCallbacks.onAddIcon).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should call onAddMarker and onClose when Add Marker clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Add Marker'));

    expect(mockCallbacks.onAddMarker).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should call onAddNote and onClose when Add Note clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Add Note'));

    expect(mockCallbacks.onAddNote).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should call onAddLink and onClose when Add Link clicked', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId="node-1"
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Add Link'));

    expect(mockCallbacks.onAddLink).toHaveBeenCalledWith('node-1');
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should not call callbacks when nodeId is null', () => {
    render(
      <ContextMenu
        isOpen={true}
        position={{ x: 100, y: 200 }}
        nodeId={null}
        {...mockCallbacks}
      />
    );

    fireEvent.click(screen.getByText('Add Child Node'));

    expect(mockCallbacks.onAddChild).not.toHaveBeenCalled();
    expect(mockCallbacks.onClose).not.toHaveBeenCalled();
  });
});
