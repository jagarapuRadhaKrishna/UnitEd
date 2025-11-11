/**
 * Validation utilities for profile forms
 */

// Validate Employee ID (6 digits in 100*** format)
export const validateEmployeeId = (id: string): { isValid: boolean; error?: string } => {
  const pattern = /^100\d{3}$/;
  
  if (!id) {
    return { isValid: false, error: 'Employee ID is required' };
  }
  
  if (!pattern.test(id)) {
    return { isValid: false, error: 'Employee ID must be 6 digits in format 100***' };
  }
  
  return { isValid: true };
};

// Validate Roll Number (12 digits in A*********** format)
export const validateRollNumber = (rollNo: string): { isValid: boolean; error?: string } => {
  const pattern = /^A\d{11}$/;
  
  if (!rollNo) {
    return { isValid: false, error: 'Roll number is required' };
  }
  
  if (!pattern.test(rollNo)) {
    return { isValid: false, error: 'Roll number must be 12 characters in format A***********' };
  }
  
  return { isValid: true };
};

// Validate University Email
export const validateUniversityEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailPattern.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  // Optional: Add specific university domain check
  // if (!email.endsWith('@university.edu')) {
  //   return { isValid: false, error: 'Please use your university email address' };
  // }
  
  return { isValid: true };
};

// Validate Contact Number
export const validateContactNumber = (phone: string): { isValid: boolean; error?: string } => {
  const phonePattern = /^[0-9]{10}$/;
  
  if (!phone) {
    return { isValid: false, error: 'Contact number is required' };
  }
  
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!phonePattern.test(cleanedPhone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true };
};

// Validate URL
export const validateURL = (url: string, fieldName: string = 'URL'): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: true }; // Optional field
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: `Please enter a valid ${fieldName}` };
  }
};

// Validate Year of Graduation
export const validateYearOfGraduation = (year: number): { isValid: boolean; error?: string } => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 10;
  const maxYear = currentYear + 10;
  
  if (!year) {
    return { isValid: false, error: 'Year of graduation is required' };
  }
  
  if (year < minYear || year > maxYear) {
    return { isValid: false, error: `Year must be between ${minYear} and ${maxYear}` };
  }
  
  return { isValid: true };
};

// Validate required field
export const validateRequired = (value: any, fieldName: string): { isValid: boolean; error?: string } => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

// Validate file upload (Resume/CV)
export const validateFileUpload = (
  file: File | null, 
  options: {
    required?: boolean;
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { isValid: boolean; error?: string } => {
  const { required = false, maxSizeMB = 5, allowedTypes = ['.pdf', '.doc', '.docx'] } = options;
  
  if (!file) {
    if (required) {
      return { isValid: false, error: 'File is required' };
    }
    return { isValid: true };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  // Check file type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return { isValid: false, error: `File type must be ${allowedTypes.join(', ')}` };
  }
  
  return { isValid: true };
};

// Validate image upload (Profile Picture)
export const validateImageUpload = (
  file: File | null,
  options: {
    required?: boolean;
    maxSizeMB?: number;
  } = {}
): { isValid: boolean; error?: string } => {
  const { required = false, maxSizeMB = 2 } = options;
  
  if (!file) {
    if (required) {
      return { isValid: false, error: 'Profile picture is required' };
    }
    return { isValid: true };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `Image size must be less than ${maxSizeMB}MB` };
  }
  
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }
  
  return { isValid: true };
};

// Validate experience (in years)
export const validateExperience = (years: number, fieldName: string = 'Experience'): { isValid: boolean; error?: string } => {
  if (years === undefined || years === null) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (years < 0 || years > 50) {
    return { isValid: false, error: `${fieldName} must be between 0 and 50 years` };
  }
  
  return { isValid: true };
};

// Validate date
export const validateDate = (date: string, fieldName: string = 'Date'): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `Please enter a valid ${fieldName}` };
  }
  
  return { isValid: true };
};
