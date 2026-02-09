import React from 'react';
import styled from '@emotion/styled';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  fallback?: React.ReactNode;
}

const getSize = (size: AvatarProps['size']) => {
  switch (size) {
    case 'xs': return '24px';
    case 'sm': return '32px';
    case 'lg': return '48px';
    case 'xl': return '64px';
    default: return '40px'; // md
  }
};

const AvatarContainer = styled.div<Pick<AvatarProps, 'size' | 'shape'>>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => getSize(props.size)};
  height: ${props => getSize(props.size)};
  border-radius: ${props => props.shape === 'square' ? 'var(--radius-md)' : '50%'};
  background: var(--color-background-dark);
  overflow: hidden;
  user-select: none;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div<Pick<AvatarProps, 'size'>>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  color: var(--color-text-light);
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  font-size: ${props => {
    switch (props.size) {
      case 'xs': return 'var(--font-size-xs)';
      case 'sm': return 'var(--font-size-sm)';
      case 'lg': return 'var(--font-size-lg)';
      case 'xl': return 'var(--font-size-xl)';
      default: return 'var(--font-size-md)';
    }
  }};
`;

const StatusIndicator = styled.span<{ status: NonNullable<AvatarProps['status']> }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  border: 2px solid var(--color-background);
  background: ${props => {
    switch (props.status) {
      case 'online': return 'var(--color-success)';
      case 'offline': return 'var(--color-grey-400)';
      case 'away': return 'var(--color-warning)';
      case 'busy': return 'var(--color-error)';
    }
  }};
`;

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  status,
  fallback,
  ...props
}) => {
  const [imgError, setImgError] = React.useState(false);

  const handleError = () => {
    setImgError(true);
  };

  const renderContent = () => {
    if (src && !imgError) {
      return <AvatarImage src={src} alt={alt} onError={handleError} />;
    }

    if (fallback) {
      return <AvatarFallback size={size}>{fallback}</AvatarFallback>;
    }

    return (
      <AvatarFallback size={size}>
        {alt ? getInitials(alt) : '?'}
      </AvatarFallback>
    );
  };

  return (
    <AvatarContainer size={size} shape={shape} {...props}>
      {renderContent()}
      {status && <StatusIndicator status={status} />}
    </AvatarContainer>
  );
};

export const AvatarGroup = styled.div<{ spacing?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;

  ${AvatarContainer} {
    margin-right: ${props => {
    switch (props.spacing) {
      case 'sm': return 'calc(var(--spacing-xs) * -1)';
      case 'lg': return 'calc(var(--spacing-md) * -1)';
      default: return 'calc(var(--spacing-sm) * -1)';
    }
  }};
    border: 2px solid var(--color-background);

    &:last-child {
      margin-right: 0;
    }
  }
`;

export default Avatar;