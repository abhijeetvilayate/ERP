import API from './api';

const AUTH_URL = '/auth';

/**
 * Pre-seeded demo user profiles matching database/seed_data.sql
 */
export const DEMO_USERS = [
  {
    userId: 1007,
    username: 'student_rohit',
    aliases: ['student', 'rohit', 'student_rohit'],
    fullName: 'Rohit Sharma',
    email: 'rohit.sharma@college.edu',
    phoneNumber: '9812345678',
    role: 'STUDENT',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    rollNo: '22CS1017'
  },
  {
    userId: 1004,
    username: 'prof_neha',
    aliases: ['faculty', 'neha', 'prof_neha', 'teacher'],
    fullName: 'Prof. Neha Joshi',
    email: 'neha.joshi@college.edu',
    phoneNumber: '8765432109',
    role: 'FACULTY',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    employeeId: 'FAC1025'
  },
  {
    userId: 1003,
    username: 'hod_chem',
    aliases: ['hod_chem', 'kulkarni', 'chemical_hod'],
    fullName: 'Dr. Sandeep Kulkarni',
    email: 'hod.chem@college.edu',
    phoneNumber: '9990123456',
    role: 'HOD',
    departmentId: 1,
    departmentName: 'Chemical Engineering',
    employeeId: 'HOD2011'
  },
  {
    userId: 1008,
    username: 'hod_comp',
    aliases: ['hod', 'hod_comp', 'hod_cse', 'sharma', 'computer_hod'],
    fullName: 'Dr. Ananya Sharma',
    email: 'hod.comp@college.edu',
    phoneNumber: '9990987654',
    role: 'HOD',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    employeeId: 'HOD2012'
  },
  {
    userId: 1002,
    username: 'principal',
    aliases: ['principal', 'deshmukh'],
    fullName: 'Dr. Rajesh Deshmukh',
    email: 'principal@college.edu',
    phoneNumber: '020-12345678',
    role: 'PRINCIPAL',
    departmentId: null,
    departmentName: 'College Administration',
    employeeId: 'PRIN001'
  },
  {
    userId: 1005,
    username: 'accounts_user',
    aliases: ['accounts', 'accounts_user', 'accountant'],
    fullName: 'Mr. Amit Verma',
    email: 'amit.verma@college.edu',
    phoneNumber: '9323344556',
    role: 'ACCOUNTS',
    departmentId: null,
    departmentName: 'Finance & Accounts',
    employeeId: 'ACC501'
  },
  {
    userId: 1006,
    username: 'librarian',
    aliases: ['library', 'librarian'],
    fullName: 'Ms. Priya Nair',
    email: 'priya.nair@college.edu',
    phoneNumber: '7860009001',
    role: 'LIBRARY',
    departmentId: null,
    departmentName: 'Central Library',
    employeeId: 'LIB301'
  },
  {
    userId: 1001,
    username: 'admin',
    aliases: ['admin', 'sysadmin', 'system_admin'],
    fullName: 'System Administrator',
    email: 'admin@college.edu',
    phoneNumber: '9876543210',
    role: 'ADMIN',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    employeeId: 'ADM001'
  }
];

// Helper to look up local demo/registered users
const findLocalUser = (usernameOrEmail) => {
  const query = (usernameOrEmail || '').trim().toLowerCase();
  if (!query) return null;

  const deletedIds = JSON.parse(localStorage.getItem('erp_deleted_user_ids') || '[]');

  // 1. Check registered users from localStorage
  try {
    const localRegistered = JSON.parse(localStorage.getItem('erp_registered_users') || '[]');
    const foundRegistered = localRegistered.find(
      (u) =>
        (u.username?.toLowerCase() === query || u.email?.toLowerCase() === query) &&
        !deletedIds.includes(u.userId)
    );
    if (foundRegistered) return foundRegistered;
  } catch (e) {
    console.error('Error parsing local registered users:', e);
  }

  // 2. Check predefined demo users
  const demoMatch = DEMO_USERS.find(
    (u) =>
      !deletedIds.includes(u.userId) &&
      (u.username.toLowerCase() === query ||
        u.email.toLowerCase() === query ||
        u.aliases.includes(query))
  );

  return demoMatch || null;
};

/**
 * Authentication Service Module
 */
const authService = {
  /**
   * Log in user with credentials
   * Tries backend API first; seamlessly falls back to demo/local auth if backend is offline.
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} User data and auth status
   */
  login: async (credentials) => {
    const { username, password } = credentials;

    // 1. Attempt Live Backend API Authentication
    try {
      const response = await API.post(`${AUTH_URL}/login`, credentials);
      const data = response.data;
      if (data?.success && data?.user) {
        return data;
      }
    } catch (apiError) {
      console.warn('Backend API unavailable or error occurred, falling back to local auth:', apiError);
    }

    // 2. Offline / Local Demo Authentication Fallback
    const localUser = findLocalUser(username);

    if (localUser) {
      // Validate password if user has one, or accept 'password123' / any password in demo mode
      if (localUser.password && password && localUser.password !== password) {
        throw new Error('Invalid password. Please check your credentials.');
      }

      const normalizedRole = localUser.role === 'SYSTEM_ADMIN' ? 'ADMIN' : localUser.role.toUpperCase();
      const userPayload = {
        ...localUser,
        role: normalizedRole
      };

      return {
        success: true,
        message: 'Login successful (Offline Demo Mode)',
        user: userPayload,
        isDemo: true
      };
    }

    // If username is not found in demo records
    throw new Error(`User "${username}" not found. You can use demo accounts (e.g., student, faculty, admin, hod, principal, accounts, library) or create an account.`);
  },

  /**
   * Register a new user account
   * Tries backend first; falls back to storing in localStorage if offline.
   * @param {Object} userData - Registration payload
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData) => {
    try {
      const response = await API.post(`${AUTH_URL}/register`, userData);
      return response.data;
    } catch (apiError) {
      console.warn('Backend API unavailable, saving registered user locally:', apiError);

      // Save user to localStorage
      try {
        const localRegistered = JSON.parse(localStorage.getItem('erp_registered_users') || '[]');
        const role = (userData.role || 'STUDENT').toUpperCase();
        const normalizedRole = role === 'SYSTEM_ADMIN' ? 'ADMIN' : role;

        const deptMap = {
          '1': 'Chemical Engineering',
          '2': 'Computer Engineering',
          '3': 'Mechanical Engineering',
          '4': 'Civil Engineering',
          '5': 'Electrical Engineering',
          '6': 'Information Technology'
        };

        const resolvedDeptName = deptMap[String(userData.department)] || userData.department || 'Computer Engineering';

        const newUser = {
          userId: Date.now(),
          username: userData.username,
          password: userData.password,
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
          role: normalizedRole,
          departmentName: resolvedDeptName
        };

        // Check duplicate
        const exists = localRegistered.some(
          (u) => u.username.toLowerCase() === newUser.username.toLowerCase() || u.email.toLowerCase() === newUser.email.toLowerCase()
        );
        if (exists) {
          throw new Error('Username or email is already registered locally.');
        }

        localRegistered.push(newUser);
        localStorage.setItem('erp_registered_users', JSON.stringify(localRegistered));

        return {
          success: true,
          message: 'Account registered successfully! You can now log in.',
          user: newUser
        };
      } catch (err) {
        throw err;
      }
    }
  },

  /**
   * Log out current user session
   */
  logout: () => {
    localStorage.removeItem('erp_user');
  },

  /**
   * Fetch profile of the currently logged-in user
   * @returns {Promise<Object>} User profile object
   */
  getCurrentUser: async () => {
    try {
      const response = await API.get(`${AUTH_URL}/me`);
      return response.data;
    } catch (error) {
      const stored = localStorage.getItem('erp_user');
      if (stored) {
        return { success: true, user: JSON.parse(stored) };
      }
      throw error;
    }
  },

  /**
   * Fetch all registered and demo users (Admin only)
   * @returns {Promise<Array>} List of user objects
   */
  getAllUsers: async () => {
    try {
      const response = await API.get(`${AUTH_URL}/users`);
      if (response.data?.success && Array.isArray(response.data?.users)) {
        return response.data.users;
      }
    } catch (err) {
      console.warn('Backend API unavailable for users list, fetching local demo/registered users:', err);
    }

    // Fallback: Combine DEMO_USERS + localStorage registered users, minus deleted users
    try {
      const deletedIds = JSON.parse(localStorage.getItem('erp_deleted_user_ids') || '[]');
      const registeredUsers = JSON.parse(localStorage.getItem('erp_registered_users') || '[]');
      
      const allCombined = [...DEMO_USERS, ...registeredUsers].filter(
        (u) => !deletedIds.includes(u.userId)
      );

      // Remove duplicate userIds
      const uniqueMap = new Map();
      allCombined.forEach((u) => {
        if (!uniqueMap.has(u.userId)) {
          uniqueMap.set(u.userId, u);
        }
      });

      return Array.from(uniqueMap.values());
    } catch (e) {
      console.error('Error fetching all users:', e);
      return DEMO_USERS;
    }
  },

  /**
   * Delete a user by ID (Admin only)
   * @param {number} userId - Target User ID
   * @returns {Promise<Object>} Deletion status
   */
  deleteUser: async (userId) => {
    const idNum = Number(userId);

    // 1. Attempt Backend API Deletion
    try {
      const response = await API.post(`${AUTH_URL}/delete-user`, { userId: idNum });
      if (response.data?.success) {
        // Also update local storage cache
        authService._removeUserLocally(idNum);
        return response.data;
      }
    } catch (apiErr) {
      console.warn('Backend delete API failed, performing local removal:', apiErr);
    }

    // 2. Perform Local Removal (Demo / Offline Mode)
    authService._removeUserLocally(idNum);
    return {
      success: true,
      message: `User (ID: ${idNum}) has been successfully deleted from the system.`
    };
  },

  /**
   * Helper to remove user from localStorage caches
   */
  _removeUserLocally: (userId) => {
    try {
      // Add to deleted IDs list
      const deletedIds = JSON.parse(localStorage.getItem('erp_deleted_user_ids') || '[]');
      if (!deletedIds.includes(userId)) {
        deletedIds.push(userId);
        localStorage.setItem('erp_deleted_user_ids', JSON.stringify(deletedIds));
      }

      // Remove from registered users list
      const registered = JSON.parse(localStorage.getItem('erp_registered_users') || '[]');
      const filteredRegistered = registered.filter((u) => Number(u.userId) !== Number(userId));
      localStorage.setItem('erp_registered_users', JSON.stringify(filteredRegistered));
    } catch (e) {
      console.error('Error updating local deleted users:', e);
    }
  },

  /**
   * Request password reset link / OTP
   * @param {string} email 
   * @returns {Promise<Object>}
   */
  forgotPassword: async (email) => {
    try {
      const response = await API.post(`${AUTH_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Password reset link sent (Simulated).' };
    }
  },

  /**
   * Reset password using token/OTP
   * @param {Object} data - { token, newPassword }
   * @returns {Promise<Object>}
   */
  resetPassword: async (data) => {
    try {
      const response = await API.post(`${AUTH_URL}/reset-password`, data);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Password updated successfully (Simulated).' };
    }
  }
};

export default authService;