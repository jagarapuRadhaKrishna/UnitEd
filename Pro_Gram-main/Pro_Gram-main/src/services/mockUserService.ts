/**
 * Mock User Service
 * Provides dummy user operations without backend
 */

// Helper to simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockUserService = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<{ success: boolean; data: any }> {
    await delay();
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        success: true,
        data: user,
      };
    }

    throw new Error('User not found');
  },

  /**
   * Update profile
   */
  async updateProfile(updates: any): Promise<{ success: boolean; data: any }> {
    await delay();
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return {
        success: true,
        data: updatedUser,
      };
    }

    throw new Error('User not found');
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<{ success: boolean; data: any }> {
    await delay();
    // Return mock user data
    return {
      success: true,
      data: {
        id,
        firstName: 'Mock',
        lastName: 'User',
        email: `user${id}@test.com`,
        role: 'student',
        profilePictureUrl: `https://ui-avatars.com/api/?name=Mock+User`,
      },
    };
  },

  /**
   * Search users
   */
  async search(_query: string): Promise<{ success: boolean; data: any[] }> {
    await delay();
    return {
      success: true,
      data: [],
    };
  },

  /**
   * Update password
   */
  async updatePassword(_oldPassword: string, _newPassword: string): Promise<{ success: boolean; message: string }> {
    await delay();
    return {
      success: true,
      message: 'Password updated successfully (mock)',
    };
  },
};
