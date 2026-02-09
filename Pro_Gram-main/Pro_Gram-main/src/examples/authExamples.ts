/**
 * Example Usage of Local Storage Authentication Service
 * 
 * This file demonstrates how to use the localStorageAuthService
 * for various authentication and user management operations.
 */

import { localStorageAuthService } from '../services/localStorageAuthService';

// ============================================
// EXAMPLE 1: Register a New Student
// ============================================

async function registerStudent() {
  try {
    const { user, token } = await localStorageAuthService.registerUser({
      // Required fields
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@university.edu',
      password: 'SecurePassword123!',
      contactNo: '1234567890',
      gender: 'Male',
      role: 'student',
      skills: ['React', 'TypeScript', 'Node.js'],
      
      // Student specific fields
      rollNumber: 'A12345678901',
      department: 'Computer Science',
      yearOfGraduation: 2025,
      
      // Optional fields
      middleName: 'Michael',
      experience: 2,
      portfolio: 'https://johndoe.dev',
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Full-stack web application built with MERN stack',
          link: 'https://github.com/johndoe/ecommerce'
        }
      ],
      achievements: ['Best Project Award', 'Hackathon Winner'],
      profilePictureUrl: 'https://example.com/photo.jpg',
    });

    console.log('Student registered successfully!');
    console.log('User:', user);
    console.log('Token:', token);
  } catch (error) {
    console.error('Registration failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// EXAMPLE 2: Register a New Faculty
// ============================================

async function registerFaculty() {
  try {
    const { user } = await localStorageAuthService.registerUser({
      // Required fields
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@university.edu',
      password: 'SecurePassword123!',
      contactNo: '9876543210',
      gender: 'Female',
      role: 'faculty',
      skills: ['Machine Learning', 'Data Science', 'Python'],
      
      // Faculty specific fields
      employeeId: '100001',
      designation: 'Associate Professor',
      dateOfJoining: '2020-01-15',
      qualification: 'Ph.D. in Computer Science',
      specialization: 'Machine Learning',
      totalExperience: 10,
      teachingExperience: 8,
      industryExperience: 2,
      
      // Optional fields
      researchProjects: [
        {
          title: 'Deep Learning for Healthcare',
          description: 'Research on applying neural networks to medical diagnosis',
          doi: '10.1234/example.doi'
        }
      ],
    });

    console.log('Faculty registered successfully!');
    console.log('User:', user);
  } catch (error) {
    console.error('Registration failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// EXAMPLE 3: Login
// ============================================

async function loginUser() {
  try {
    const { user, token } = await localStorageAuthService.login({
      email: 'john.doe@university.edu',
      password: 'SecurePassword123!'
    });

    console.log('Login successful!');
    console.log('User:', user);
    console.log('Token:', token);
  } catch (error) {
    console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// EXAMPLE 4: Get Current User
// ============================================

function getCurrentUser() {
  const user = localStorageAuthService.getCurrentUser();
  
  if (user) {
    console.log('Current user:', user);
    console.log('Name:', `${user.firstName} ${user.lastName}`);
    console.log('Role:', user.role);
  } else {
    console.log('No user is currently logged in');
  }
}

// ============================================
// EXAMPLE 5: Check Authentication Status
// ============================================

function checkAuthStatus() {
  const isAuthenticated = localStorageAuthService.isAuthenticated();
  
  if (isAuthenticated) {
    console.log('User is authenticated');
  } else {
    console.log('User is not authenticated');
  }
}

// ============================================
// EXAMPLE 6: Update User Profile
// ============================================

async function updateUserProfile() {
  const currentUser = localStorageAuthService.getCurrentUser();
  
  if (!currentUser) {
    console.log('No user logged in');
    return;
  }

  try {
    const updatedUser = await localStorageAuthService.updateProfile(currentUser.id, {
      bio: 'Passionate software developer with expertise in web technologies',
      location: 'San Francisco, CA',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
    });

    console.log('Profile updated successfully!');
    console.log('Updated user:', updatedUser);
  } catch (error) {
    console.error('Profile update failed:', error instanceof Error ? error.message : 'Unknown error');

  }
}

// ============================================
// EXAMPLE 7: Change Password
// ============================================

async function changeUserPassword() {
  const currentUser = localStorageAuthService.getCurrentUser();
  
  if (!currentUser) {
    console.log('No user logged in');
    return;
  }

  try {
    await localStorageAuthService.changePassword(
      currentUser.id,
      'SecurePassword123!', // old password
      'NewSecurePassword456!' // new password
    );

    console.log('Password changed successfully!');
  } catch (error) {
    console.error('Password change failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// EXAMPLE 8: Check Email Availability
// ============================================

function checkEmailAvailability() {
  const email = 'newuser@university.edu';
  const isAvailable = localStorageAuthService.isEmailAvailable(email);
  
  if (isAvailable) {
    console.log(`Email ${email} is available`);
  } else {
    console.log(`Email ${email} is already registered`);
  }
}

// ============================================
// EXAMPLE 9: Check Roll Number Availability (Students)
// ============================================

function checkRollNumberAvailability() {
  const rollNumber = 'A12345678901';
  const isAvailable = localStorageAuthService.isRollNumberAvailable(rollNumber);
  
  if (isAvailable) {
    console.log(`Roll number ${rollNumber} is available`);
  } else {
    console.log(`Roll number ${rollNumber} is already registered`);
  }
}

// ============================================
// EXAMPLE 10: Get All Registered Users
// ============================================

function getAllUsers() {
  const users = localStorageAuthService.getAllRegisteredUsers();
  
  console.log('All registered users:');
  users.forEach(user => {
    console.log(`- ${user.name} (${user.email}) - ${user.role}`);
  });
}

// ============================================
// EXAMPLE 11: Logout
// ============================================

function logoutUser() {
  localStorageAuthService.logout();
  console.log('User logged out successfully');
}

// ============================================
// EXAMPLE 12: Reset Password (Forgot Password)
// ============================================

async function resetPassword() {
  try {
    await localStorageAuthService.resetPassword(
      'john.doe@university.edu',
      'NewPassword123!'
    );

    console.log('Password reset successful!');
  } catch (error) {
    console.error('Password reset failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// EXAMPLE 13: Delete User Account
// ============================================

async function deleteUserAccount() {
  const currentUser = localStorageAuthService.getCurrentUser();
  
  if (!currentUser) {
    console.log('No user logged in');
    return;
  }

  try {
    await localStorageAuthService.deleteAccount(
      currentUser.id,
      'SecurePassword123!' // Confirm with password
    );

    console.log('Account deleted successfully');
  } catch (error) {
    console.error('Account deletion failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// EXAMPLE 14: Clear All Data (For Testing)
// ============================================

function clearAllData() {
  if (confirm('Are you sure you want to delete all user data?')) {
    localStorageAuthService.clearAllData();
    console.log('All data cleared!');
  }
}

// ============================================
// EXAMPLE 15: Complete Registration & Login Flow
// ============================================

async function completeAuthFlow() {
  try {
    // Step 1: Check if email is available
    const email = 'testuser@university.edu';
    if (!localStorageAuthService.isEmailAvailable(email)) {
      console.log('Email already taken, trying to login...');
      
      // Try to login instead
      const loginResult = await localStorageAuthService.login({
        email,
        password: 'TestPassword123!'
      });
      
      console.log('Logged in successfully:', loginResult.user);
      return;
    }

    // Step 2: Register new user
    console.log('Email available, registering new user...');
    const registerResult = await localStorageAuthService.registerUser({
      firstName: 'Test',
      lastName: 'User',
      email,
      password: 'TestPassword123!',
      contactNo: '5555555555',
      gender: 'Other',
      role: 'student',
      skills: ['JavaScript', 'React'],
      rollNumber: 'A99999999999',
      department: 'Computer Science',
      yearOfGraduation: 2026,
    });

    console.log('Registration successful:', registerResult.user);

    // Step 3: Verify current user
    const currentUser = localStorageAuthService.getCurrentUser();
    console.log('Current logged in user:', currentUser);

    // Step 4: Update profile
    const updatedUser = await localStorageAuthService.updateProfile(currentUser!.id, {
      bio: 'This is my bio',
      location: 'New York',
    });

    console.log('Profile updated:', updatedUser);

    // Step 5: Logout
    localStorageAuthService.logout();
    console.log('Logged out');

    // Step 6: Login again
    const reloginResult = await localStorageAuthService.login({
      email,
      password: 'TestPassword123!'
    });

    console.log('Logged in again:', reloginResult.user);

  } catch (error) {
    console.error('Auth flow failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// Export examples for use in components
// ============================================

export const authExamples = {
  registerStudent,
  registerFaculty,
  loginUser,
  getCurrentUser,
  checkAuthStatus,
  updateUserProfile,
  changeUserPassword,
  checkEmailAvailability,
  checkRollNumberAvailability,
  getAllUsers,
  logoutUser,
  resetPassword,
  deleteUserAccount,
  clearAllData,
  completeAuthFlow,
};

// Uncomment to run an example:
// completeAuthFlow();
