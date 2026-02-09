import styled from '@emotion/styled';

interface FlexProps {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => {
    switch (props.align) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'stretch': return 'stretch';
      case 'baseline': return 'baseline';
      default: return 'center';
    }
  }};
  justify-content: ${props => {
    switch (props.justify) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      case 'evenly': return 'space-evenly';
      default: return 'center';
    }
  }};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => {
    switch (props.gap) {
      case 'none': return '0';
      case 'xs': return 'var(--spacing-xs)';
      case 'sm': return 'var(--spacing-sm)';
      case 'lg': return 'var(--spacing-lg)';
      case 'xl': return 'var(--spacing-xl)';
      default: return 'var(--spacing-md)';
    }
  }};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  height: ${props => props.fullHeight ? '100%' : 'auto'};
`;

export const Stack = styled(Flex)`
  flex-direction: column;
`;

export default Flex;