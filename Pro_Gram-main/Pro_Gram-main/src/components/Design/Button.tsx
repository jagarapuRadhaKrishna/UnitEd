import React from 'react';
import styled from '@emotion/styled';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  text-decoration: none;
  line-height: var(--line-height-tight);
  white-space: nowrap;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  /* Size Variants */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--font-size-sm);
        `;
      case 'lg':
        return `
          padding: var(--spacing-md) var(--spacing-lg);
          font-size: var(--font-size-lg);
        `;
      default: // md
        return `
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: var(--font-size-md);
        `;
    }
  }}

  /* Style Variants */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: var(--color-secondary);
          color: var(--color-text-light);
          border: none;

          &:hover {
            background: var(--color-secondary-dark);
          }

          &:active {
            background: var(--color-secondary-dark);
          }

          &:disabled {
            background: var(--color-secondary-light);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: var(--color-primary);
          border: 2px solid var(--color-primary);

          &:hover {
            background: var(--color-primary);
            color: var(--color-text-light);
          }

          &:active {
            background: var(--color-primary-dark);
            border-color: var(--color-primary-dark);
          }

          &:disabled {
            border-color: var(--color-primary-light);
            color: var(--color-primary-light);
            background: transparent;
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: var(--color-primary);
          border: none;

          &:hover {
            background: var(--color-primary-light);
            color: var(--color-text-light);
          }

          &:active {
            background: var(--color-primary);
          }

          &:disabled {
            color: var(--color-primary-light);
            background: transparent;
          }
        `;
      default: // primary
        return `
          background: var(--color-primary);
          color: var(--color-text-light);
          border: none;

          &:hover {
            background: var(--color-primary-dark);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          &:active {
            background: var(--color-primary-dark);
            transform: translateY(0);
            box-shadow: var(--shadow-sm);
          }

          &:disabled {
            background: var(--color-primary-light);
            transform: none;
            box-shadow: none;
          }
        `;
    }
  }}

  /* Loading State */
  ${props =>
    props.isLoading &&
    `
    cursor: not-allowed;
    opacity: 0.7;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}

  /* Disabled State */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const LoadingSpinner = styled.span`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: var(--spacing-xs);
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};

export default Button;