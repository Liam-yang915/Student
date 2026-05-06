import { useEffect, useState } from 'react';
import { authService, type TeacherListItem } from '../services/api';

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadTeachers();
  }, []);

  async function loadTeachers() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getTeachers();

      if (!response.success || !response.data) {
        setError(response.message || '加载教师列表失败，请稍后重试。');
        return;
      }

      setTeachers(response.data);
    } catch (err) {
      console.error('Load teachers error:', err);
      setError('无法加载教师列表，请检查网络连接。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="home-header">
        <div className="container home-header-inner">
          <a href="#/profile" className="brand-mark">
            English Learning
          </a>
          <div className="hero-actions">
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/bookings'; }}>
              我的预约
            </button>
            <button className="button button-primary" onClick={() => { window.location.hash = '#/profile'; }}>
              返回资料页
            </button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Teacher Directory</span>
            <h2>选择老师</h2>
            <p>先选择老师，再进入该老师的课时表挑选可预约的一对一英语课时间。</p>
          </div>

          {error && <div className="student-status student-status-error student-status-animated">{error}</div>}

          {loading ? (
            <div className="student-empty-state student-loading-state">
              <div className="student-spinner"></div>
              <p>正在加载教师列表...</p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="student-empty-state student-empty-state-enhanced">
              <div className="student-empty-icon">教师</div>
              <p>当前还没有可预约的老师。</p>
            </div>
          ) : (
            <div className="card-grid">
              {teachers.map((teacher, index) => (
                <article className="content-card" key={teacher.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="teacher-card-top">
                    <div className="teacher-card-avatar teacher-avatar-pulse">
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{teacher.name}</h3>
                      <p>{teacher.email}</p>
                    </div>
                  </div>

                  <p className="teacher-card-bio">
                    {teacher.bio || '这位老师还没有填写个人简介。'}
                  </p>

                  <div className="teacher-card-meta">
                    <span className="teacher-card-pill teacher-card-pill-animated">开放课时 {teacher.open_slot_count}</span>
                  </div>

                  <button
                    className="button button-primary"
                    onClick={() => { window.location.hash = `#/teachers/${teacher.id}`; }}
                  >
                    查看课时表
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
