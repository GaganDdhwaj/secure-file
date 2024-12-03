import { create } from 'zustand';
import { AuthState } from '../types/auth';

const ADMIN_CREDENTIALS = {
  username: 'Gagan',
  password: '123456',
};

// Simulated user database
let users: any[] = [];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  otpVerified: false,
  currentOtp: null,
  biometricVerified: false,
  tempRegistrationData: null,

  adminLogin: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        set({
          user: {
            id: 'admin-1',
            username: 'Gagan',
            role: 'admin',
            email: 'admin@example.com',
            mobile: '',
            lastLogin: new Date(),
          },
          isAuthenticated: true,
        });
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const user = users.find(u => u.username === username);
      if (user && user.password === password) {
        set({ user, isAuthenticated: false, otpVerified: false });
        return;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      otpVerified: false,
      biometricVerified: false,
      currentOtp: null,
    });
  },

  generateOtp: () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    set({ currentOtp: otp });
    return otp;
  },

  verifyOtp: (otp: string) => {
    const { currentOtp } = get();
    const isValid = otp === currentOtp;
    if (isValid) {
      set({ otpVerified: true });
    }
    return isValid;
  },

  registerUser: async (userData: Partial<User>) => {
    set({ isLoading: true });
    try {
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        role: 'user',
      };
      users.push(newUser);
      set({ tempRegistrationData: null });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyBiometric: async (type: 'face' | 'fingerprint', data: string) => {
    const { user } = get();
    if (!user) return false;

    if (type === 'face' && user.faceData === data) {
      set({ biometricVerified: true, isAuthenticated: true });
      return true;
    }

    if (type === 'fingerprint' && user.fingerprintData === data) {
      set({ biometricVerified: true, isAuthenticated: true });
      return true;
    }

    return false;
  },

  setTempRegistrationData: (data: Partial<User>) => {
    set({ tempRegistrationData: data });
  },

  clearTempRegistrationData: () => {
    set({ tempRegistrationData: null });
  },
}));