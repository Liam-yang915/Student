import { useEffect, useState } from 'react';
import { authService } from '../services/api';

export default function ProfilePage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    // Get stored student info
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
      // Force logout even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      window.location.hash = '#/login';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="profile-page">
      {/* Top Navigation Bar */}
      <nav className="profile-nav">
        <div className="container profile-nav-inner">
          <a href="#/" className="brand-mark">English Learning</a>
          <div className="profile-nav-actions">
            <span className="profile-nav-user">{student.name}</span>
            <button onClick={handleLogout} className="button button-logout">
              退出登录
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Avatar */}
      <section className="profile-hero">
        <div className="container">
          <div className="profile-hero-content">
            <div className="profile-avatar">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-hero-text">
              <h1>{student.name}</h1>
              <p className="profile-role">学生账户</p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Grid */}
      <section className="profile-content">
        <div className="container">
          <div className="profile-grid">
            {/* Info Card */}
            <div className="profile-info-card">
              <h2 className="profile-section-title">基本信息</h2>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="profile-info-label">学生ID</span>
                  <span className="profile-info-value">#{student.id}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">姓名</span>
                  <span className="profile-info-value">{student.name}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">邮箱</span>
                  <span className="profile-info-value">{student.email}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">手机号</span>
                  <span className="profile-info-value">{student.phone || '未设置'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="profile-actions-card">
              <h2 className="profile-section-title">快捷操作</h2>
              <div className="profile-actions-list">
                <button onClick={() => window.location.hash = '#/'} className="profile-action-btn">
                  <span className="profile-action-icon">🏠</span>
                  <span>返回首页</span>
                </button>
                <button className="profile-action-btn">
                  <span className="profile-action-icon">📚</span>
                  <span>我的课程</span>
                </button>
                <button className="profile-action-btn">
                  <span className="profile-action-icon">⚙️</span>
                  <span>账户设置</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
