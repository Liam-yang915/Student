import { useState, FormEvent, useEffect } from 'react';
import { authService } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      window.location.hash = '#/profile';
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);

      if (data.success && data.data) {
        // Store token and student info
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('student', JSON.stringify(data.data.student));

        // Redirect to profile page
        window.location.hash = '#/profile';
      } else {
        // Handle error
        if (data.message) {
          setError(data.message);
        } else if (data.errors && data.errors.email) {
          setError(data.errors.email[0]);
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and ensure the backend server is running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <span className="login-badge">Student Portal</span>
          <h1>学生登录</h1>
          <p>登录后可查看课程安排、上课记录、教师反馈和学习进度。</p>
          <a href="#/" className="back-link">
            返回首页
          </a>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="student-account">账号</label>
            <input
              id="student-account"
              name="account"
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-password">密码</label>
            <input
              id="student-password"
              name="password"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="login-options">
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <span>记住我</span>
            </label>
            <a href="#/">忘记密码？</a>
          </div>

          <button
            type="submit"
            className="button button-primary button-block"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>

          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '4px', fontSize: '14px' }}>
            <strong>测试账号：</strong><br />
            邮箱: student@test.com<br />
            密码: password123
          </div>
        </form>
      </section>

      <aside className="login-aside">
        <div className="aside-card">
          <span className="login-badge">学习入口</span>
          <h2>一个更清晰的学生端起点</h2>
          <p>这版先把登录做得简单直观，后面你可以继续接：</p>
          <ul className="aside-list">
            <li>登录接口和 token 处理</li>
            <li>学生首页 dashboard</li>
            <li>课程列表和上课入口</li>
            <li>作业、反馈、学习报告</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
