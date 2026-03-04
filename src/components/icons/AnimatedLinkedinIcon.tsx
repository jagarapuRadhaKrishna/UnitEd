import React, { useEffect } from 'react';
import type { Variants } from 'framer-motion';
import { motion, useAnimation } from 'framer-motion';

const staticVariants: Variants = {
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
  },
};

const dropVariants: Variants = {
  normal: {
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  animate: (custom: number) => ({
    y: [-100, 10, 0],
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 12,
      mass: 1.2,
      delay: custom * 0.15,
    },
  }),
};

interface AnimatedLinkedinIconProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const AnimatedLinkedinIcon = ({
  width = 20,
  height = 20,
  strokeWidth = 2,
  stroke = 'currentColor',
  ...props
}: AnimatedLinkedinIconProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.set('normal');
  }, [controls]);

  return (
    <span
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        padding: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.rect
          width="4"
          height="12"
          x="2"
          y="9"
          variants={staticVariants}
          animate={controls}
        />
        <motion.circle
          cx="4"
          cy="4"
          r="2"
          variants={staticVariants}
          animate={controls}
        />
        <motion.path
          d="M16 8a6 6 0 0 1 6 6v7h-4v-7"
          variants={dropVariants}
          animate={controls}
          custom={0}
        />
        <motion.path
          d="M18 14a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7"
          variants={dropVariants}
          animate={controls}
          custom={1}
        />
      </svg>
    </span>
  );
};

export default AnimatedLinkedinIcon;
