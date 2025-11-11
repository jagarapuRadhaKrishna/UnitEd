import React from 'react';
import styled from '@emotion/styled';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  noBorder?: boolean;
}

const StyledCard = styled.div<CardProps>`
  background: var(--color-background);
  
  ${props => {
    switch (props.variant) {
      case 'outlined':
        return `
          border: 1px solid var(--color-border);
          box-shadow: none;
        `;
      case 'filled':
        return `
          background: var(--color-background-dark);
          border: none;
          box-shadow: none;
        `;
      default: // elevated
        return `
          border: none;
          box-shadow: var(--shadow-md);
        `;
    }
  }}

  ${props => {
    switch (props.padding) {
      case 'none':
        return 'padding: 0;';
      case 'sm':
        return 'padding: var(--spacing-sm);';
      case 'lg':
        return 'padding: var(--spacing-lg);';
      default: // md
        return 'padding: var(--spacing-md);';
    }
  }}

  ${props => {
    switch (props.radius) {
      case 'none':
        return 'border-radius: 0;';
      case 'sm':
        return 'border-radius: var(--radius-sm);';
      case 'lg':
        return 'border-radius: var(--radius-lg);';
      default: // md
        return 'border-radius: var(--radius-md);';
    }
  }}

  ${props => props.noBorder && 'border: none;'}
`;

export const Card: React.FC<CardProps> = ({ 
  variant = 'elevated',
  padding = 'md',
  radius = 'md',
  noBorder = false,
  children,
  ...props 
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      radius={radius}
      noBorder={noBorder}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Card subcomponents for better organization
export const CardHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  
  &:first-of-type {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

export const CardSubtitle = styled.p`
  margin: var(--spacing-xs) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

export const CardContent = styled.div<{ padding?: CardProps['padding'] }>`
  ${props => {
    switch (props.padding) {
      case 'none':
        return 'padding: 0;';
      case 'sm':
        return 'padding: var(--spacing-sm);';
      case 'lg':
        return 'padding: var(--spacing-lg);';
      default: // md
        return 'padding: var(--spacing-md);';
    }
  }}
`;

export const CardFooter = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
`;

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  
  &:last-child {
    padding-bottom: 0;
  }
`;

export default Card;