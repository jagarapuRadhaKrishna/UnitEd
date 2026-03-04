import React, { useEffect } from 'react';
import { Github } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

interface AnimatedGithubIconProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const AnimatedGithubIcon = ({
  width = 20,
  height = 20,
  strokeWidth = 2,
  stroke = 'currentColor',
  ...props
}: AnimatedGithubIconProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.set('normal');
  }, [controls]);

  return (
    <motion.span
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        padding: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={controls}
      variants={{
        normal: { rotate: 0, y: 0, scale: 1 },
        animate: {
          rotate: [0, -10, 10, -4, 0],
          y: [0, -2, 0],
          scale: [1, 1.06, 1],
          transition: {
            duration: 0.55,
            ease: 'easeOut',
          },
        },
      }}
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <Github
        width={width}
        height={height}
        strokeWidth={strokeWidth}
        color={stroke}
        {...props}
      />
    </motion.span>
  );
};

export default AnimatedGithubIcon;
