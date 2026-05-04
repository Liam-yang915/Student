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
    <main className="student-page">
      <section className="student-shell">
        <header className="student-header-card">
          <div>
            <span className="student-badge">Teacher Directory</span>
            <h1>选择老师</h1>
            <p>查看可预约老师，进入课时表后选择你想上的一对一英语课时间。</p>
          </div>
          <div className="student-header-actions">
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/profile'; }}>
              返回资料页
            </button>
          </div>
        </header>

        {error && <div className="student-status student-status-error">{error}</div>}

        {loading ? (
          <div className="student-empty-state">正在加载教师列表...</div>
        ) : teachers.length === 0 ? (
          <div className="student-empty-state">当前还没有可预约的老师。</div>
        ) : (
          <section className="teacher-card-grid">
            {teachers.map((teacher) => (
              <article className="teacher-card" key={teacher.id}>
                <div className="teacher-card-top">
                  <div className="teacher-card-avatar">
                    {teacher.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2>{teacher.name}</h2>
                    <p>{teacher.email}</p>
                  </div>
                </div>

                <p className="teacher-card-bio">
                  {teacher.bio || '这位老师还没有填写个人简介。'}
                </p>

                <div className="teacher-card-meta">
                  <span className="teacher-card-pill">开放课时 {teacher.open_slot_count}</span>
                </div>

                <button
                  className="button button-primary"
                  onClick={() => { window.location.hash = `#/teachers/${teacher.id}`; }}
                >
                  查看课时表
                </button>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
