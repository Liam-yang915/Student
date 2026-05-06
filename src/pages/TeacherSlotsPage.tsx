import { useEffect, useMemo, useState } from 'react';
import { authService, type TeacherSlot, type TeacherSlotsResponse } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadTeacherSlots();
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

  async function loadTeacherSlots() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getTeacherSlots(teacherId);

      if (!response.success || !response.data) {
        setError(response.message || '加载老师课时失败，请稍后重试。');
        return;
      }

      setTeacherData(response.data);
    } catch (err) {
      console.error('Load teacher slots error:', err);
      setError('无法加载老师课时，请检查网络连接。');
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(slotId: number) {
    setBookingSlotId(slotId);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.bookSlot(slotId);

      if (!response.success) {
        setError(response.message || '预约失败，请稍后重试。');
        await loadTeacherSlots();
        return;
      }

      setSuccessMessage(response.message || '预约成功。');
      await loadTeacherSlots();
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
            <button className="button button-primary" onClick={() => { window.location.hash = '#/profile'; }}>
              资料页
            </button>
          </div>
        </header>

        {error && <div className="student-status student-status-error">{error}</div>}
        {successMessage && <div className="student-status student-status-success">{successMessage}</div>}

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
                      disabled={bookingSlotId === slot.id}
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
