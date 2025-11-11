import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ImageContainer = styled.div<{ aspectRatio?: string }>`
  position: relative;
  width: 100%;
  padding-bottom: ${props => props.aspectRatio || '56.25%'}; /* 16:9 default */
  background: #f0f0f0;
  overflow: hidden;
  border-radius: 8px;
`;

const StyledImage = styled.img<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.isLoaded ? 1 : 0};
  animation: ${props => props.isLoaded ? fadeIn : 'none'} 0.5s ease-in;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

interface LazyImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  onLoad?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  aspectRatio, 
  className,
  onLoad 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <ImageContainer ref={containerRef} aspectRatio={aspectRatio} className={className}>
      {!isLoaded && <Placeholder />}
      {isInView && (
        <StyledImage
          ref={imgRef}
          src={src}
          alt={alt}
          isLoaded={isLoaded}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      )}
    </ImageContainer>
  );
};

export default LazyImage;
