import { useEffect, useState } from 'react';
import { authService, type StudentTextbookItem, type TeacherTextbooksResponse } from '../services/api';

type Props = {
  teacherId: string;
};

export default function TextbookSelectionPage({ teacherId }: Props) {
  const [pageData, setPageData] = useState<TeacherTextbooksResponse['data']>();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadTextbooks();
  }, [teacherId]);

  async function loadTextbooks() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getTeacherTextbooks(teacherId);

      if (!response.success || !response.data) {
        setError(response.message || '加载教材列表失败，请稍后重试。');
        return;
      }

      setPageData(response.data);
    } catch (err) {
      console.error('Load textbooks error:', err);
      setError('无法加载教材列表，请检查网络连接。');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(textbook: StudentTextbookItem) {
    setSavingId(textbook.id);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.selectTeacherTextbook(teacherId, textbook.id);

      if (!response.success) {
        setError(response.message || '选择教材失败，请稍后重试。');
        return;
      }

      setSuccessMessage(response.message || '教材选择成功。');
      window.location.hash = '#/bookings';
    } catch (err) {
      console.error('Select textbook error:', err);
      setError('选择教材失败，请检查网络连接。');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="page-shell">
      <header className="home-header">
        <div className="container home-header-inner">
          <a href="#/bookings" className="brand-mark">
            English Learning
          </a>
          <div className="hero-actions">
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/bookings'; }}>
              返回预约页
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
            <span className="section-kicker">Textbook Selection</span>
            <h2>选择教材</h2>
            <p>
              {pageData?.teacher
                ? `为 ${pageData.teacher.name} 的课程选择当前教材。选择后会自动初始化第一课进度。`
                : '选择当前教材后，系统会自动初始化第一课进度。'}
            </p>
          </div>

          {error && <div className="student-status student-status-error student-status-animated">{error}</div>}
          {successMessage && <div className="student-status student-status-success student-status-animated">{successMessage}</div>}

          {pageData?.current_textbook && (
            <div className="content-card" style={{ marginBottom: '24px' }}>
              <h3>当前教材</h3>
              <p>{pageData.current_textbook.name}</p>
              {pageData.current_textbook.description && <p>{pageData.current_textbook.description}</p>}
            </div>
          )}

          {loading ? (
            <div className="student-empty-state student-loading-state">
              <div className="student-spinner"></div>
              <p>正在加载教材列表...</p>
            </div>
          ) : !pageData || pageData.textbooks.length === 0 ? (
            <div className="student-empty-state student-empty-state-enhanced">
              <div className="student-empty-icon">教材</div>
              <p>当前还没有可选教材。</p>
            </div>
          ) : (
            <div className="card-grid">
              {pageData.textbooks.map((textbook, index) => (
                <article className="content-card" key={textbook.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="student-booking-head">
                    <div>
                      <h3>{textbook.name}</h3>
                      <p>{textbook.selected ? '当前已选教材' : '可作为当前教材'}</p>
                    </div>
                    {textbook.selected && (
                      <span className="teacher-card-pill teacher-card-pill-status">当前教材</span>
                    )}
                  </div>

                  <p>{textbook.description || '暂时没有教材简介。'}</p>

                  <div className="hero-actions">
                    <button
                      className="button button-primary"
                      onClick={() => void handleSelect(textbook)}
                      disabled={savingId === textbook.id || textbook.selected}
                    >
                      {textbook.selected ? '已选择' : savingId === textbook.id ? '保存中...' : '选择这本教材'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
