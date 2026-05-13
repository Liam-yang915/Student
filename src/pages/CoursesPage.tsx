import { useEffect, useMemo, useState } from 'react';
import { authService, type StudentCourseEnrollmentItem } from '../services/api';

function formatDateTime(value: string | null) {
  if (!value) {
    return '未设置';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: '进行中',
    completed: '已完成',
    expired: '已过期',
    cancelled: '已取消',
  };

  return labels[status] || status;
}

function isCurrentlyUsable(enrollment: StudentCourseEnrollmentItem) {
  const now = Date.now();
  const activatedAt = enrollment.activated_at ? new Date(enrollment.activated_at).getTime() : Number.POSITIVE_INFINITY;
  const expiresAt = enrollment.expires_at ? new Date(enrollment.expires_at).getTime() : Number.NEGATIVE_INFINITY;

  return (
    enrollment.status === 'active' &&
    enrollment.remaining_class_count > 0 &&
    activatedAt <= now &&
    expiresAt >= now
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<StudentCourseEnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadCourses();
  }, []);

  const currentEnrollment = useMemo(() => {
    return courses
      .filter(isCurrentlyUsable)
      .sort((a, b) => {
        const aExpiresAt = a.expires_at ? new Date(a.expires_at).getTime() : Number.MAX_SAFE_INTEGER;
        const bExpiresAt = b.expires_at ? new Date(b.expires_at).getTime() : Number.MAX_SAFE_INTEGER;

        return aExpiresAt - bExpiresAt;
      })[0] ?? null;
  }, [courses]);

  async function loadCourses() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getCourses();

      if (!response.success || !response.data) {
        setError(response.message || '加载我的课程失败，请稍后重试。');
        return;
      }

      setCourses(response.data);
    } catch (err) {
      console.error('Load courses error:', err);
      setError('无法加载我的课程，请检查网络连接。');
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
              已预约课时
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
            <span className="section-kicker">My Courses</span>
            <h2>我的课程</h2>
            <p>查看后台已经为你分配的课程、有效期、已用课时和剩余课时。</p>
          </div>

          {error && <div className="student-status student-status-error student-status-animated">{error}</div>}

          {loading ? (
            <div className="student-empty-state student-loading-state">
              <div className="student-spinner"></div>
              <p>正在加载我的课程...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="student-empty-state student-empty-state-enhanced">
              <div className="student-empty-icon">课程</div>
              <p>当前还没有分配课程。</p>
            </div>
          ) : (
            <>
              <div className="content-card" style={{ marginBottom: '24px' }}>
                <h3>课程概览</h3>
                <div className="student-profile-list">
                  <div className="student-profile-row student-profile-row-hover">
                    <span className="student-profile-label">当前可预约课程</span>
                    <span className="student-profile-value">{currentEnrollment?.course?.name || '暂无'}</span>
                  </div>
                  <div className="student-profile-row student-profile-row-hover">
                    <span className="student-profile-label">课程总数</span>
                    <span className="student-profile-value">{courses.length}</span>
                  </div>
                </div>
              </div>

              <div className="card-grid">
                {courses.map((enrollment, index) => {
                  const isCurrentEnrollment = currentEnrollment?.id === enrollment.id;

                  return (
                    <article className="content-card" key={enrollment.id} style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="student-booking-head">
                        <div>
                          <h3>{enrollment.course?.name || `课程 #${enrollment.id}`}</h3>
                          <p>{isCurrentEnrollment ? '当前可预约课程' : getStatusLabel(enrollment.status)}</p>
                        </div>
                        <span className="teacher-card-pill teacher-card-pill-status">
                          {isCurrentEnrollment ? '当前课程' : `剩余 ${enrollment.remaining_class_count}`}
                        </span>
                      </div>

                      <div className="student-booking-info student-booking-info-enhanced">
                        <span>有效期开始</span>
                        <strong>{formatDateTime(enrollment.activated_at)}</strong>
                      </div>

                      <div className="student-booking-info student-booking-info-enhanced">
                        <span>有效期结束</span>
                        <strong>{formatDateTime(enrollment.expires_at)}</strong>
                      </div>

                      <div className="student-booking-info student-booking-info-enhanced">
                        <span>课时使用</span>
                        <strong>{enrollment.used_class_count} / {enrollment.class_count_snapshot}</strong>
                      </div>

                      <div className="student-booking-info student-booking-info-enhanced">
                        <span>课程周期</span>
                        <strong>{enrollment.duration_days_snapshot} 天</strong>
                      </div>

                      <div className="hero-actions">
                        <button
                          className="button button-primary"
                          onClick={() => { window.location.hash = '#/teachers'; }}
                          disabled={!isCurrentEnrollment}
                        >
                          {isCurrentEnrollment ? '去预约课时' : '非当前课程'}
                        </button>
                        <button className="button button-secondary" onClick={() => { window.location.hash = '#/bookings'; }}>
                          查看预约
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
