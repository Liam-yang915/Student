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

export interface TeacherListItem {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  open_slot_count: number;
}

export interface TeacherSlot {
  id: number;
  slot_date: string;
  start_time: string;
}

export interface StudentBookingItem {
  id: number;
  status: string;
  booked_at: string | null;
  teacher: null | {
    id: number;
    name: string;
    email: string;
  };
  schedule: null | {
    id: number;
    slot_date: string;
    start_time: string;
    status: string;
  };
}

export interface TeacherSlotsResponse {
  success: boolean;
  data?: {
    teacher: {
      id: number;
      name: string;
      email: string;
      bio: string | null;
    };
    slots: TeacherSlot[];
  };
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  data?: {
    booking_id: number;
  };
  message?: string;
}

function getToken() {
  return localStorage.getItem('token');
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
    const response = await fetch(`${API_BASE_URL}/student/profile`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
    });

    return await response.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/student/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
    });

    localStorage.removeItem('token');
    localStorage.removeItem('student');
  },

  async getTeachers(): Promise<{ success: boolean; data?: TeacherListItem[]; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/student/teachers`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
    });

    return await response.json();
  },

  async getTeacherSlots(teacherId: string): Promise<TeacherSlotsResponse> {
    const response = await fetch(`${API_BASE_URL}/student/teachers/${teacherId}/slots`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
    });

    return await response.json();
  },

  async getBookings(): Promise<{ success: boolean; data?: StudentBookingItem[]; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/student/bookings`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
    });

    return await response.json();
  },

  async bookSlot(teacherCourseScheduleId: number): Promise<BookingResponse> {
    const response = await fetch(`${API_BASE_URL}/student/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ teacher_course_schedule_id: teacherCourseScheduleId }),
    });

    return await response.json();
  },

  async cancelBooking(bookingId: number): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/student/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
    });

    return await response.json();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getStoredStudent() {
    const student = localStorage.getItem('student');
    return student ? JSON.parse(student) : null;
  }
};
