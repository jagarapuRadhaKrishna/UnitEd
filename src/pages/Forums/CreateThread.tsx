import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

interface CreateThreadFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  min-height: 42px;

  &:focus-within {
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const Tag = styled.span`
  background: #ebf8ff;
  color: #3182ce;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagDelete = styled.button`
  background: none;
  border: none;
  color: #3182ce;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    color: #2c5282;
  }
`;

const TagInputField = styled.input`
  border: none;
  outline: none;
  padding: 0.25rem;
  flex: 1;
  min-width: 120px;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2c5282;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const categories = ['Technology', 'Academic', 'Career', 'Projects', 'Events'];

export const CreateThread: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateThreadFormData>({
    title: '',
    content: '',
    category: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the thread
    console.log('Creating thread:', formData);
    // Navigate to the forums list after creation
    navigate('/forums');
  };

  const isFormValid = formData.title && formData.content && formData.category;

  return (
    <Container>
      <Title>Create New Thread</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Thread Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Describe your topic in detail..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Tags</Label>
          <TagInput>
            {formData.tags.map(tag => (
              <Tag key={tag}>
                {tag}
                <TagDelete type="button" onClick={() => removeTag(tag)}>
                  ×
                </TagDelete>
              </Tag>
            ))}
            <TagInputField
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags (press Enter)"
            />
          </TagInput>
        </FormGroup>

        <SubmitButton type="submit" disabled={!isFormValid}>
          Create Thread
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateThread;