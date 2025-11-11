import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  thickness?: number;
}

const SpinnerContainer = styled.div<SpinnerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '24px';
      case 'lg': return '48px';
      default: return '36px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '24px';
      case 'lg': return '48px';
      default: return '36px';
    }
  }};
`;

const SpinnerCircle = styled(motion.circle)<{ thickness?: number }>`
  stroke-width: ${props => props.thickness || 4}px;
  stroke-linecap: round;
`;

const spinTransition: any = {
  loop: Infinity,
  duration: 1,
  ease: "linear"
};

export const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  thickness = 4
}) => {
  const radius = thickness;
  const circumference = 2 * Math.PI * radius;

  return (
    <SpinnerContainer size={size}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      >
        <SpinnerCircle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke={color}
          thickness={thickness}
          initial={{ strokeDasharray: circumference }}
          animate={{
            strokeDashoffset: [0, -circumference],
          }}
          transition={spinTransition}
        />
      </motion.svg>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;