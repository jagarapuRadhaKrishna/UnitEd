import React from 'react';
import styled from '@emotion/styled';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  outlined?: boolean;
  rounded?: boolean;
}

const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  border-radius: ${props => props.rounded ? 'var(--radius-full)' : 'var(--radius-sm)'};

  /* Size Variants */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: 0 var(--spacing-xs);
          font-size: var(--font-size-xs);
          height: 1.5rem;
        `;
      case 'lg':
        return `
          padding: 0 var(--spacing-md);
          font-size: var(--font-size-md);
          height: 2.25rem;
        `;
      default: // md
        return `
          padding: 0 var(--spacing-sm);
          font-size: var(--font-size-sm);
          height: 1.75rem;
        `;
    }
  }}

  /* Style Variants */
  ${props => {
    let colors;
    switch (props.variant) {
      case 'secondary':
        colors = {
          bg: 'var(--color-secondary)',
          text: 'var(--color-text-light)',
          border: 'var(--color-secondary)',
          outlinedBg: 'transparent',
          outlinedText: 'var(--color-secondary)'
        };
        break;
      case 'success':
        colors = {
          bg: 'var(--color-success)',
          text: 'var(--color-text-light)',
          border: 'var(--color-success)',
          outlinedBg: 'transparent',
          outlinedText: 'var(--color-success)'
        };
        break;
      case 'error':
        colors = {
          bg: 'var(--color-error)',
          text: 'var(--color-text-light)',
          border: 'var(--color-error)',
          outlinedBg: 'transparent',
          outlinedText: 'var(--color-error)'
        };
        break;
      case 'warning':
        colors = {
          bg: 'var(--color-warning)',
          text: 'var(--color-text-primary)',
          border: 'var(--color-warning)',
          outlinedBg: 'transparent',
          outlinedText: 'var(--color-warning)'
        };
        break;
      case 'info':
        colors = {
          bg: 'var(--color-info)',
          text: 'var(--color-text-light)',
          border: 'var(--color-info)',
          outlinedBg: 'transparent',
          outlinedText: 'var(--color-info)'
        };
        break;
      default: // primary
        colors = {
          bg: 'var(--color-primary)',
          text: 'var(--color-text-light)',
          border: 'var(--color-primary)',
          outlinedBg: 'transparent',
          outlinedText: 'var(--color-primary)'
        };
    }

    return props.outlined
      ? `
        color: ${colors.outlinedText};
        background: ${colors.outlinedBg};
        border: 1px solid ${colors.border};
      `
      : `
        color: ${colors.text};
        background: ${colors.bg};
        border: 1px solid transparent;
      `;
  }}
`;

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  outlined = false,
  rounded = false,
  children,
  ...props
}) => {
  return (
    <StyledBadge
      variant={variant}
      size={size}
      outlined={outlined}
      rounded={rounded}
      {...props}
    >
      {children}
    </StyledBadge>
  );
};

export default Badge;