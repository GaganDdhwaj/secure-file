export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  email: string;
  mobile: string;
  faceData?: string;
  fingerprintData?: string;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpVerified: boolean;
  currentOtp: string | null;
  biometricVerified: boolean;
  tempRegistrationData: Partial<User> | null;
  login: (username: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  generateOtp: () => string;
  verifyOtp: (otp: string) => boolean;
  registerUser: (userData: Partial<User>) => Promise<void>;
  verifyBiometric: (type: 'face' | 'fingerprint', data: string) => Promise<boolean>;
  setTempRegistrationData: (data: Partial<User>) => void;
  clearTempRegistrationData: () => void;
}