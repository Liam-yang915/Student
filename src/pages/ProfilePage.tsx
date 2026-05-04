import { useEffect, useState } from 'react';
import { authService } from '../services/api';

type StudentProfileData = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    const storedStudent = authService.getStoredStudent();
    setStudent(storedStudent);
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.hash = '#/login';
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      window.location.hash = '#/login';
    }
  };

  if (loading) {
    return (
      <main className="student-page">
        <section className="student-shell student-shell-narrow">
          <div className="student-panel">
            <div className="student-empty-state">正在加载学生资料...</div>
          </div>
        </section>
      </main>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <main className="student-page">
      <section className="student-shell student-shell-narrow">
        <header className="student-header-card">
          <div>
            <span className="student-badge">Student Profile</span>
            <h1>个人信息</h1>
            <p>管理你的学生资料，查看已预约课时，或进入老师列表开始预约一对一英语课。</p>
          </div>
          <div className="student-header-actions">
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/bookings'; }}>
              已预约课时
            </button>
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/teachers'; }}>
              预约老师
            </button>
            <button className="button student-button-danger" onClick={handleLogout}>
              退出登录
            </button>
          </div>
        </header>

        <section className="student-profile-card student-panel">
          <div className="student-profile-hero">
            <div className="student-profile-avatar">{student.name.charAt(0).toUpperCase()}</div>
            <h2>{student.name}</h2>
            <p>学生账户</p>
          </div>

          <div className="student-profile-body">
            <div className="student-panel-head">
              <div>
                <h2>基本信息</h2>
                <p>当前登录学生的基础资料</p>
              </div>
            </div>

            <div className="student-profile-list">
              <div className="student-profile-row">
                <span className="student-profile-label">学生 ID</span>
                <span className="student-profile-value">#{student.id}</span>
              </div>
              <div className="student-profile-row">
                <span className="student-profile-label">姓名</span>
                <span className="student-profile-value">{student.name}</span>
              </div>
              <div className="student-profile-row">
                <span className="student-profile-label">邮箱</span>
                <span className="student-profile-value">{student.email}</span>
              </div>
              <div className="student-profile-row">
                <span className="student-profile-label">手机号</span>
                <span className="student-profile-value">{student.phone || '未设置'}</span>
              </div>
            </div>

            <div className="student-profile-actions">
              <button className="button button-secondary" onClick={() => { window.location.hash = '#/bookings'; }}>
                查看已预约课时
              </button>
              <button className="button button-primary" onClick={() => { window.location.hash = '#/teachers'; }}>
                去选老师和课时
              </button>
              <button className="button student-button-danger" onClick={handleLogout}>
                退出登录
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
