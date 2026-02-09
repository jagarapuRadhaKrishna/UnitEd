import React, { forwardRef } from 'react';
import styled from '@emotion/styled';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ hasError?: boolean; hasLeftIcon?: boolean; hasRightIcon?: boolean }>`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-left: ${props => props.hasLeftIcon ? 'calc(var(--spacing-md) * 2 + 1em)' : 'var(--spacing-md)'};
  padding-right: ${props => props.hasRightIcon ? 'calc(var(--spacing-md) * 2 + 1em)' : 'var(--spacing-md)'};
  font-family: var(--font-family-primary);
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  background: var(--color-background);
  border: 1px solid ${props => props.hasError ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);

  &:hover {
    border-color: ${props => props.hasError ? 'var(--color-error)' : 'var(--color-primary-light)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--color-error)' : 'var(--color-primary)'};
    box-shadow: 0 0 0 3px ${props => 
      props.hasError 
        ? 'rgba(244, 67, 54, 0.1)' 
        : 'rgba(33, 150, 243, 0.1)'
    };
  }

  &:disabled {
    background: var(--color-background-dark);
    border-color: var(--color-border);
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--color-text-hint);
  }
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.position}: var(--spacing-md);
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  width: 1em;
  height: 1em;
  pointer-events: none;
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
`;

const HintMessage = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    hint,
    fullWidth = false,
    leftIcon,
    rightIcon,
    ...props 
  }, ref) => {
    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <InputContainer>
          {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            hasError={!!error}
            hasLeftIcon={!!leftIcon}
            hasRightIcon={!!rightIcon}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
        </InputContainer>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        {!error && hint && <HintMessage>{hint}</HintMessage>}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input;