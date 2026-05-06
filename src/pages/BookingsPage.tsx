import { useEffect, useState } from 'react';
import { authService, type StudentBookingItem } from '../services/api';

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<StudentBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmBooking, setConfirmBooking] = useState<StudentBookingItem | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getBookings();

      if (!response.success || !response.data) {
        setError(response.message || '加载已预约课时失败，请稍后重试。');
        return;
      }

      setBookings(response.data);
    } catch (err) {
      console.error('Load bookings error:', err);
      setError('无法加载已预约课时，请检查网络连接。');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: number) {
    setCancellingId(bookingId);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.cancelBooking(bookingId);

      if (!response.success) {
        setError(response.message || '取消预约失败，请稍后重试。');
        return;
      }

      setSuccessMessage(response.message || '预约已取消。');
      await loadBookings();
      setConfirmBooking(null);
    } catch (err) {
      console.error('Cancel booking error:', err);
      setError('取消预约失败，请检查网络连接。');
    } finally {
      setCancellingId(null);
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
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/teachers'; }}>
              继续预约
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
            <span className="section-kicker">My Bookings</span>
            <h2>已预约课时</h2>
            <p>查看你已经预约的一对一英语课时，也可以为对应老师选择当前教材。</p>
          </div>

          {error && <div className="student-status student-status-error student-status-animated">{error}</div>}
          {successMessage && <div className="student-status student-status-success student-status-animated">{successMessage}</div>}

          {loading ? (
            <div className="student-empty-state student-loading-state">
              <div className="student-spinner"></div>
              <p>正在加载已预约课时...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="student-empty-state student-empty-state-enhanced">
              <div className="student-empty-icon">预约</div>
              <p>你当前还没有预约任何课时。</p>
            </div>
          ) : (
            <div className="card-grid">
              {bookings.map((booking, index) => (
                <article className="content-card" key={booking.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="student-booking-head">
                    <div>
                      <h3>{booking.teacher?.name || '老师信息缺失'}</h3>
                      <p>{booking.teacher?.email || '暂无邮箱信息'}</p>
                    </div>
                    <span className="teacher-card-pill teacher-card-pill-status">
                      {booking.status === 'booked' ? '已预约' : '已完成'}
                    </span>
                  </div>

                  <div className="student-booking-info student-booking-info-enhanced">
                    <span>上课日期</span>
                    <strong>{booking.schedule ? formatDateLabel(booking.schedule.slot_date) : '未知'}</strong>
                  </div>

                  <div className="student-booking-info student-booking-info-enhanced">
                    <span>上课时间</span>
                    <strong>{booking.schedule?.start_time || '未知'}</strong>
                  </div>

                  <div className="student-booking-info student-booking-info-enhanced">
                    <span>当前教材</span>
                    <strong>{booking.current_textbook?.name || '还未选择教材'}</strong>
                  </div>

                  <div className="hero-actions">
                    <button
                      className="button button-secondary"
                      onClick={() => {
                        if (booking.teacher) {
                          window.location.hash = `#/teachers/${booking.teacher.id}/textbooks`;
                        }
                      }}
                      disabled={!booking.teacher}
                    >
                      {booking.current_textbook ? '更换教材' : '选择教材'}
                    </button>
                    <button className="button button-secondary" onClick={() => { window.location.hash = '#/teachers'; }}>
                      再选其他课时
                    </button>
                    <button
                      className="button student-button-danger"
                      onClick={() => setConfirmBooking(booking)}
                      disabled={booking.status !== 'booked' || cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? '取消中...' : '取消预约'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {confirmBooking && (
        <div className="student-modal-backdrop student-modal-fade-in" onClick={() => setConfirmBooking(null)}>
          <div className="student-modal-card student-modal-scale-in" onClick={(event) => event.stopPropagation()}>
            <span className="section-kicker">Confirm Cancel</span>
            <h2>确认取消这个课时？</h2>
            <p>
              你将取消 <strong>{confirmBooking.teacher?.name || '该老师'}</strong> 的课程预约。
            </p>
            <div className="student-modal-summary student-modal-summary-enhanced">
              <div className="student-booking-info">
                <span>上课日期</span>
                <strong>
                  {confirmBooking.schedule ? formatDateLabel(confirmBooking.schedule.slot_date) : '未知'}
                </strong>
              </div>
              <div className="student-booking-info">
                <span>上课时间</span>
                <strong>{confirmBooking.schedule?.start_time || '未知'}</strong>
              </div>
            </div>
            <div className="hero-actions">
              <button
                className="button button-secondary"
                onClick={() => setConfirmBooking(null)}
                disabled={cancellingId === confirmBooking.id}
              >
                先保留
              </button>
              <button
                className="button student-button-danger"
                onClick={() => void handleCancel(confirmBooking.id)}
                disabled={cancellingId === confirmBooking.id}
              >
                {cancellingId === confirmBooking.id ? '取消中...' : '确认取消'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
