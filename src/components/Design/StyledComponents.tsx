import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import theme from '../../theme';

// Card Components
export const Card = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.card.padding.default};
  box-shadow: ${theme.shadows.card};
  transition: ${theme.transitions.default};

  &:hover {
    transform: ${theme.card.hover.transform};
    box-shadow: ${theme.card.hover.shadow};
  }
`;

export const ProjectCard = styled(Card)`
  display: grid;
  gap: ${theme.spacing.md};
`;

export const ProfileCard = styled(Card)`
  text-align: center;
  padding: ${theme.card.padding.spacious};
`;

// Button Components
export const Button = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.semibold};
  transition: ${theme.transitions.default};
  cursor: pointer;
  border: none;
  font-family: ${theme.typography.fontFamily};
`;

export const PrimaryButton = styled(Button)`
  background: ${theme.colors.button.primary};
  color: ${theme.colors.text.light};
  box-shadow: ${theme.shadows.button};

  &:hover {
    background: ${theme.colors.button.primaryHover};
    transform: translateY(-2px);
  }
`;

export const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${theme.colors.button.primary};
  border: 2px solid ${theme.colors.button.primary};

  &:hover {
    background: rgba(108, 71, 255, 0.1);
  }
`;

// Navigation Components
export const StyledNavLink = styled(Link)`
  color: ${theme.colors.text.primary};
  text-decoration: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  transition: ${theme.transitions.default};
  font-weight: ${theme.typography.fontWeight.medium};

  &:hover {
    background: rgba(108, 71, 255, 0.1);
    color: ${theme.colors.primary};
  }

  &.active {
    background: ${theme.colors.primary};
    color: ${theme.colors.text.light};
  }
`;

// Grid and Layout Components
export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(\${props => props.columns || 3}, 1fr);
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

// Typography Components
export const Title = styled.h1`
  font-size: ${theme.typography.headings.h1};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

export const Subtitle = styled.h2`
  font-size: ${theme.typography.headings.h2};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
`;

// Badge Components
export const Badge = styled.span<{ variant?: 'available' | 'ongoing' | 'completed' }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: 0.875rem;
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${props => theme.colors.status[props.variant || 'available']};
  color: ${theme.colors.text.light};
`;

// Input Components
export const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${theme.borderRadius.small};
  font-family: ${theme.typography.fontFamily};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(108, 71, 255, 0.2);
  }
`;

// Animation Keyframes
export const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const slideUp = `
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Gradient Background
export const GradientBackground = styled.div`
  background: ${theme.colors.background.gradient};
  color: ${theme.colors.text.light};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
`;