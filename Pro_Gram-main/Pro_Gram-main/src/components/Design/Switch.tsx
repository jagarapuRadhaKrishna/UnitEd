import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

interface SwitchContainerProps {
  size: string;
  disabled: boolean;
}

const getSize = (size: string) => {
  switch (size) {
    case 'sm':
      return { width: 36, height: 20, circle: 16 };
    case 'lg':
      return { width: 56, height: 32, circle: 28 };
    default: // md
      return { width: 44, height: 24, circle: 20 };
  }
};

const SwitchContainer = styled.label<SwitchContainerProps>`
  display: inline-flex;
  align-items: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  gap: 8px;
`;

const SwitchTrack = styled(motion.div)<{ size: string; disabled: boolean }>`
  width: ${props => getSize(props.size).width}px;
  height: ${props => getSize(props.size).height}px;
  background-color: #cbd5e0;
  border-radius: 999px;
  padding: 2px;
  display: flex;
  align-items: center;
  
  &:focus-within {
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const SwitchCircle = styled(motion.div)<{ size: string }>`
  width: ${props => getSize(props.size).circle}px;
  height: ${props => getSize(props.size).circle}px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const SwitchInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const SwitchLabel = styled.span<{ disabled: boolean }>`
  font-size: 14px;
  color: ${props => props.disabled ? '#718096' : '#2d3748'};
`;

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  return (
    <SwitchContainer size={size} disabled={disabled}>
      <SwitchInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <SwitchTrack
        size={size}
        disabled={disabled}
        animate={{
          backgroundColor: checked ? '#3182ce' : '#cbd5e0'
        }}
      >
        <SwitchCircle
          size={size}
          animate={{
            x: checked ? getSize(size).width - getSize(size).circle - 4 : 0
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </SwitchTrack>
      {label && <SwitchLabel disabled={disabled}>{label}</SwitchLabel>}
    </SwitchContainer>
  );
};

export default Switch;