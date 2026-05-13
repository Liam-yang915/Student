import { useEffect, useMemo, useState } from 'react';
import { authService, type StudentCourseEnrollmentItem, type TeacherSlot, type TeacherSlotsResponse } from '../services/api';

type Props = {
  teacherId: string;
};

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
}

export default function TeacherSlotsPage({ teacherId }: Props) {
  const [teacherData, setTeacherData] = useState<TeacherSlotsResponse['data']>();
  const [enrollments, setEnrollments] = useState<StudentCourseEnrollmentItem[]>([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadPageData();
  }, [teacherId]);

  const groupedSlots = useMemo(() => {
    const map = new Map<string, TeacherSlot[]>();

    for (const slot of teacherData?.slots ?? []) {
      const list = map.get(slot.slot_date) ?? [];
      list.push(slot);
      map.set(slot.slot_date, list);
    }

    return Array.from(map.entries()).map(([slotDate, slots]) => ({
      slotDate,
      label: formatDateLabel(slotDate),
      slots,
    }));
  }, [teacherData]);

  const activeEnrollments = useMemo(() => {
    const now = Date.now();

    return enrollments
      .filter((enrollment) => {
        const activatedAt = enrollment.activated_at ? new Date(enrollment.activated_at).getTime() : Number.POSITIVE_INFINITY;
        const expiresAt = enrollment.expires_at ? new Date(enrollment.expires_at).getTime() : Number.NEGATIVE_INFINITY;

        return (
          enrollment.status === 'active' &&
          enrollment.remaining_class_count > 0 &&
          activatedAt <= now &&
          expiresAt >= now
        );
      })
      .sort((a, b) => {
        const aExpiresAt = a.expires_at ? new Date(a.expires_at).getTime() : Number.MAX_SAFE_INTEGER;
        const bExpiresAt = b.expires_at ? new Date(b.expires_at).getTime() : Number.MAX_SAFE_INTEGER;

        return aExpiresAt - bExpiresAt;
      });
  }, [enrollments]);

  const currentEnrollment = useMemo(
    () => activeEnrollments.find((enrollment) => enrollment.id === selectedEnrollmentId) ?? activeEnrollments[0] ?? null,
    [activeEnrollments, selectedEnrollmentId]
  );

  async function loadPageData() {
    setLoading(true);
    setError('');

    try {
      const [slotsResponse, coursesResponse] = await Promise.all([
        authService.getTeacherSlots(teacherId),
        authService.getCourses(),
      ]);

      if (!slotsResponse.success || !slotsResponse.data) {
        setError(slotsResponse.message || '加载老师课时失败，请稍后重试。');
        return;
      }

      if (!coursesResponse.success || !coursesResponse.data) {
        setError(coursesResponse.message || '加载学生课程失败，请稍后重试。');
        return;
      }

      const now = Date.now();
      const nextActiveEnrollments = coursesResponse.data
        .filter((enrollment) => {
          const activatedAt = enrollment.activated_at ? new Date(enrollment.activated_at).getTime() : Number.POSITIVE_INFINITY;
          const expiresAt = enrollment.expires_at ? new Date(enrollment.expires_at).getTime() : Number.NEGATIVE_INFINITY;

          return (
            enrollment.status === 'active' &&
            enrollment.remaining_class_count > 0 &&
            activatedAt <= now &&
            expiresAt >= now
          );
        })
        .sort((a, b) => {
          const aExpiresAt = a.expires_at ? new Date(a.expires_at).getTime() : Number.MAX_SAFE_INTEGER;
          const bExpiresAt = b.expires_at ? new Date(b.expires_at).getTime() : Number.MAX_SAFE_INTEGER;

          return aExpiresAt - bExpiresAt;
        });

      setTeacherData(slotsResponse.data);
      setEnrollments(coursesResponse.data);
      setSelectedEnrollmentId(nextActiveEnrollments[0]?.id ?? null);
    } catch (err) {
      console.error('Load teacher slots error:', err);
      setError('无法加载预约信息，请检查网络连接。');
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(slotId: number) {
    if (!currentEnrollment) {
      setError('请先选择一个有效课程后再预约。');
      return;
    }

    setBookingSlotId(slotId);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.bookSlot(slotId, currentEnrollment.id);

      if (!response.success) {
        setError(response.message || '预约失败，请稍后重试。');
        await loadPageData();
        return;
      }

      setSuccessMessage(response.message || '预约成功。');
      await loadPageData();
    } catch (err) {
      console.error('Book slot error:', err);
      setError('预约失败，请检查网络连接。');
    } finally {
      setBookingSlotId(null);
    }
  }

  return (
    <main className="student-page">
      <section className="student-shell">
        <header className="student-header-card">
          <div>
            <span className="student-badge">Teacher Schedule</span>
            <h1>{teacherData?.teacher.name || '老师课时表'}</h1>
            <p>{teacherData?.teacher.bio || '请选择一个开放课时完成一对一英语课预约。'}</p>
          </div>
          <div className="student-header-actions">
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/teachers'; }}>
              返回老师列表
            </button>
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/bookings'; }}>
              我的预约
            </button>
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/courses'; }}>
              我的课程
            </button>
            <button className="button button-primary" onClick={() => { window.location.hash = '#/profile'; }}>
              资料页
            </button>
          </div>
        </header>

        {error && <div className="student-status student-status-error">{error}</div>}
        {successMessage && <div className="student-status student-status-success">{successMessage}</div>}

        {!loading && (
          <article className="content-card" style={{ marginBottom: '24px' }}>
            <h3>预约课程</h3>
            <p>系统会自动使用当前有效且最早到期的课程进行预约。</p>

            {activeEnrollments.length === 0 ? (
              <div className="student-status student-status-error" style={{ marginTop: '12px' }}>
                当前没有可用课程，无法预约课时。
              </div>
            ) : currentEnrollment ? (
              <div className="student-profile-list" style={{ marginTop: '16px' }}>
                <div className="student-profile-row student-profile-row-hover">
                  <span className="student-profile-label">当前课程</span>
                  <span className="student-profile-value">{currentEnrollment.course?.name || `Course #${currentEnrollment.id}`}</span>
                </div>
                <div className="student-profile-row student-profile-row-hover">
                  <span className="student-profile-label">剩余课时</span>
                  <span className="student-profile-value">{currentEnrollment.remaining_class_count}</span>
                </div>
                <div className="student-profile-row student-profile-row-hover">
                  <span className="student-profile-label">有效期至</span>
                  <span className="student-profile-value">
                    {currentEnrollment.expires_at ? new Date(currentEnrollment.expires_at).toLocaleDateString('zh-CN') : '未设置'}
                  </span>
                </div>
              </div>
            ) : null}
          </article>
        )}

        {loading ? (
          <div className="student-empty-state">正在加载课时...</div>
        ) : !teacherData || teacherData.slots.length === 0 ? (
          <div className="student-empty-state">这位老师当前没有可预约课时。</div>
        ) : (
          <section className="slot-day-list">
            {groupedSlots.map((group) => (
              <article className="slot-day-card" key={group.slotDate}>
                <div className="slot-day-head">
                  <h2>{group.label}</h2>
                  <span>{group.slots.length} 个可选时间</span>
                </div>

                <div className="slot-chip-list">
                  {group.slots.map((slot) => (
                    <button
                      key={slot.id}
                      className="slot-chip"
                      onClick={() => void handleBook(slot.id)}
                      disabled={bookingSlotId === slot.id || !currentEnrollment}
                    >
                      {bookingSlotId === slot.id ? '预约中...' : slot.start_time}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
