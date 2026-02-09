import styled from '@emotion/styled';

interface GridProps {
  columns?: number | string;
  rows?: number | string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  columnGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  fullWidth?: boolean;
  fullHeight?: boolean;
  autoFit?: boolean;
  minColumnWidth?: string;
}

const getSpacing = (size: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  switch (size) {
    case 'none': return '0';
    case 'xs': return 'var(--spacing-xs)';
    case 'sm': return 'var(--spacing-sm)';
    case 'lg': return 'var(--spacing-lg)';
    case 'xl': return 'var(--spacing-xl)';
    default: return 'var(--spacing-md)';
  }
};

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${props => {
    if (props.autoFit) {
      return `repeat(auto-fit, minmax(${props.minColumnWidth || '250px'}, 1fr))`;
    }
    if (typeof props.columns === 'number') {
      return `repeat(${props.columns}, 1fr)`;
    }
    return props.columns || 'none';
  }};
  grid-template-rows: ${props => {
    if (typeof props.rows === 'number') {
      return `repeat(${props.rows}, 1fr)`;
    }
    return props.rows || 'none';
  }};
  gap: ${props => props.gap ? getSpacing(props.gap) : 'var(--spacing-md)'};
  row-gap: ${props => props.rowGap ? getSpacing(props.rowGap) : undefined};
  column-gap: ${props => props.columnGap ? getSpacing(props.columnGap) : undefined};
  align-items: ${props => {
    switch (props.align) {
      case 'start': return 'start';
      case 'end': return 'end';
      case 'stretch': return 'stretch';
      case 'baseline': return 'baseline';
      default: return 'center';
    }
  }};
  justify-content: ${props => {
    switch (props.justify) {
      case 'start': return 'start';
      case 'end': return 'end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      case 'evenly': return 'space-evenly';
      default: return 'center';
    }
  }};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  height: ${props => props.fullHeight ? '100%' : 'auto'};
`;

interface GridItemProps {
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
  justify?: 'start' | 'center' | 'end' | 'stretch';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const GridItem = styled.div<GridItemProps>`
  grid-column: ${props => props.colSpan ? `span ${props.colSpan}` : props.colStart ? `${props.colStart} / ${props.colEnd || 'auto'}` : 'auto'};
  grid-row: ${props => props.rowSpan ? `span ${props.rowSpan}` : props.rowStart ? `${props.rowStart} / ${props.rowEnd || 'auto'}` : 'auto'};
  justify-self: ${props => props.justify || 'auto'};
  align-self: ${props => props.align || 'auto'};
`;

// Responsive grid container that automatically adjusts columns based on viewport width
export const ResponsiveGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

export default Grid;