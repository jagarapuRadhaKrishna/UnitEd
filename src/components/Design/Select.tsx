import React, { forwardRef } from 'react';
import styled from '@emotion/styled';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  value?: string;
}

const SelectWrapper = styled.div<{ fullWidth?: boolean }>`
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

const SelectContainer = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: var(--spacing-md);
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--color-text-secondary);
    pointer-events: none;
  }
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: calc(var(--spacing-md) * 2 + 5px);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  background: var(--color-background);
  border: 1px solid ${props => props.hasError ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  appearance: none;
  cursor: pointer;

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

  /* Hide default arrow in IE/Edge */
  &::-ms-expand {
    display: none;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
`;

const HintMessage = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label,
    error,
    hint,
    fullWidth = false,
    options,
    ...props 
  }, ref) => {
    return (
      <SelectWrapper fullWidth={fullWidth}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <SelectContainer>
          <StyledSelect
            ref={ref}
            hasError={!!error}
            aria-invalid={!!error}
            {...props}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </StyledSelect>
        </SelectContainer>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        {!error && hint && <HintMessage>{hint}</HintMessage>}
      </SelectWrapper>
    );
  }
);

Select.displayName = 'Select';

export default Select;