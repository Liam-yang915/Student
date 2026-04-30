const API_BASE_URL = 'http://management.local/api';

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    student: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
  };
  message?: string;
  errors?: {
    email?: string[];
  };
}

export interface StudentProfile {
  success: boolean;
  data?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/student/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  },

  async getProfile(): Promise<StudentProfile> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/student/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    return await response.json();
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/student/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    localStorage.removeItem('token');
    localStorage.removeItem('student');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getStoredStudent() {
    const student = localStorage.getItem('student');
    return student ? JSON.parse(student) : null;
  }
};
