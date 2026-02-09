import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../../contexts/AuthContext';

const LoginContainer = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  background: var(--color-background-light);
`;

const LoginCard = styled.div`
  background: var(--color-background);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const LoginTitle = styled.h1`
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const LoginSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-text-light);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background: var(--color-secondary);
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
`;

const ForgotPassword = styled(Link)`
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  text-align: right;
  text-decoration: none;
  margin-top: var(--spacing-xs);

  &:hover {
    text-decoration: underline;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);

  a {
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, error: authError, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(authError || 'An error occurred during login');
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Welcome Back</LoginTitle>
          <LoginSubtitle>Log in to continue your journey</LoginSubtitle>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </SubmitButton>
        </Form>

        <SignupLink>
          Don't have an account? <Link to="/register">Sign up</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;