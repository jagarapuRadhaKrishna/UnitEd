import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 8px;
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 300px;
  margin-bottom: 16px;
`;

export const SkeletonText = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  margin-bottom: 8px;
`;

export const SkeletonCircle = styled(SkeletonBase)<{ size?: string }>`
  width: ${props => props.size || '48px'};
  height: ${props => props.size || '48px'};
  border-radius: 50%;
`;

export const SkeletonDashboard: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <SkeletonText width="60%" height="32px" style={{ marginBottom: '16px' }} />
      <SkeletonText width="40%" height="20px" style={{ marginBottom: '32px' }} />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i}>
            <SkeletonCard />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <SkeletonCircle size="40px" />
              <div style={{ flex: 1 }}>
                <SkeletonText width="70%" height="14px" />
                <SkeletonText width="50%" height="12px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Spinner Component
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerRing = styled.div<{ size?: string; color?: string }>`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${props => props.color || '#663399'};
  border-radius: 50%;
  width: ${props => props.size || '48px'};
  height: ${props => props.size || '48px'};
  animation: ${spin} 1s linear infinite;
`;

export const Spinner: React.FC<{ size?: string; color?: string }> = ({ size, color }) => {
  return (
    <SpinnerContainer>
      <SpinnerRing size={size} color={color} />
    </SpinnerContainer>
  );
};

// Loading Overlay
const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: #663399;
  font-weight: 600;
  font-size: 16px;
`;

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <OverlayContainer>
      <SpinnerRing size="64px" color="#663399" />
      <LoadingText>{message}</LoadingText>
    </OverlayContainer>
  );
};

export default { SkeletonCard, SkeletonText, SkeletonCircle, SkeletonDashboard, Spinner, LoadingOverlay };
