import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Animation Keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Animated Containers
export const FadeIn = styled.div<{ delay?: number; duration?: number }>`
  animation: ${fadeIn} ${props => props.duration || 0.5}s ease-out ${props => props.delay || 0}s both;
`;

export const SlideInFromBottom = styled.div<{ delay?: number; duration?: number }>`
  animation: ${slideInFromBottom} ${props => props.duration || 0.6}s ease-out ${props => props.delay || 0}s both;
`;

export const SlideInFromLeft = styled.div<{ delay?: number; duration?: number }>`
  animation: ${slideInFromLeft} ${props => props.duration || 0.6}s ease-out ${props => props.delay || 0}s both;
`;

export const SlideInFromRight = styled.div<{ delay?: number; duration?: number }>`
  animation: ${slideInFromRight} ${props => props.duration || 0.6}s ease-out ${props => props.delay || 0}s both;
`;

export const ScaleIn = styled.div<{ delay?: number; duration?: number }>`
  animation: ${scaleIn} ${props => props.duration || 0.5}s ease-out ${props => props.delay || 0}s both;
`;

// Microinteraction Components
export const HoverCard = styled.div`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const PulseButton = styled.button`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

export const ShinyButton = styled.button`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #663399 0%, #8A4FBE 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 51, 153, 0.3);
  }
`;

export const FloatingElement = styled.div<{ delay?: number }>`
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

// Page Transition Wrapper
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FadeIn duration={0.3}>
      {children}
    </FadeIn>
  );
};

// Stagger Children Animation
export const StaggerContainer = styled.div`
  & > * {
    opacity: 0;
    animation: ${slideInFromBottom} 0.6s ease-out both;
  }

  & > *:nth-of-type(1) { animation-delay: 0.1s; }
  & > *:nth-of-type(2) { animation-delay: 0.2s; }
  & > *:nth-of-type(3) { animation-delay: 0.3s; }
  & > *:nth-of-type(4) { animation-delay: 0.4s; }
  & > *:nth-of-type(5) { animation-delay: 0.5s; }
  & > *:nth-of-type(6) { animation-delay: 0.6s; }
  & > *:nth-of-type(7) { animation-delay: 0.7s; }
  & > *:nth-of-type(8) { animation-delay: 0.8s; }
`;

// Interactive Input
export const AnimatedInput = styled.input`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #E2E8F0;
  
  &:focus {
    border-color: #663399;
    box-shadow: 0 0 0 3px rgba(102, 51, 153, 0.1);
    transform: scale(1.02);
  }

  &:hover:not(:focus) {
    border-color: #CBD5E0;
  }
`;

export default {
  FadeIn,
  SlideInFromBottom,
  SlideInFromLeft,
  SlideInFromRight,
  ScaleIn,
  HoverCard,
  PulseButton,
  ShinyButton,
  FloatingElement,
  PageTransition,
  StaggerContainer,
  AnimatedInput
};
