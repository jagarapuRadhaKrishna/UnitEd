import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  background: var(--color-background-light);
`;

const RegisterCard = styled.div`
  background: var(--color-background);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 600px;
  box-shadow: var(--shadow-lg);
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const RegisterTitle = styled.h1`
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const RegisterSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
`;

const RoleSelector = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
`;

const RoleButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: var(--spacing-md);
  background: ${props => props.$isActive ? 'var(--color-primary)' : 'var(--color-background)'};
  color: ${props => props.$isActive ? 'var(--color-text-light)' : 'var(--color-text-primary)'};
  border: 2px solid ${props => props.$isActive ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-1px);
  }
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
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
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  background-color: var(--color-background);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs);
  text-align: center;
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

const LoginLink = styled.div`
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

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'faculty';
  studentId?: string;
  facultyId?: string;
  department?: string;
  yearOfStudy?: string;
}

const Register: React.FC = () => {
  const { register, error: authError, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRoleChange = (role: 'student' | 'faculty') => {
    setFormData(prev => ({
      ...prev,
      role,
      studentId: undefined,
      facultyId: undefined,
      department: undefined,
      yearOfStudy: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'student' ? {
          studentId: formData.studentId,
          yearOfStudy: Number(formData.yearOfStudy)
        } : {
          facultyId: formData.facultyId,
          department: formData.department
        })
      });
      navigate('/dashboard');
    } catch (err) {
      setError(authError || 'Registration failed');
    }
  };

  const isFormValid = () => {
    const baseValidation = formData.name && 
      formData.email && 
      formData.password && 
      formData.confirmPassword && 
      formData.password === formData.confirmPassword;

    if (formData.role === 'student') {
      return baseValidation && formData.studentId && formData.yearOfStudy;
    }
    
    return baseValidation && formData.facultyId && formData.department;
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Create Your Account</RegisterTitle>
          <RegisterSubtitle>Join UnitEd and start your journey</RegisterSubtitle>
        </RegisterHeader>

        <RoleSelector>
          <RoleButton
            type="button"
            $isActive={formData.role === 'student'}
            onClick={() => handleRoleChange('student')}
          >
            Student
          </RoleButton>
          <RoleButton
            type="button"
            $isActive={formData.role === 'faculty'}
            onClick={() => handleRoleChange('faculty')}
          >
            Faculty
          </RoleButton>
        </RoleSelector>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          {formData.role === 'student' ? (
            <FormRow>
              <FormGroup>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId || ''}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="yearOfStudy">Year of Study</Label>
                <Select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  value={formData.yearOfStudy || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </Select>
              </FormGroup>
            </FormRow>
          ) : (
            <FormRow>
              <FormGroup>
                <Label htmlFor="facultyId">Faculty ID</Label>
                <Input
                  type="text"
                  id="facultyId"
                  name="facultyId"
                  value={formData.facultyId || ''}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="department">Department</Label>
                <Select
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                </Select>
              </FormGroup>
            </FormRow>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={!isFormValid() || isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <LoginLink>
          Already have an account? <Link to="/login">Log in</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;