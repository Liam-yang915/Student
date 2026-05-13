import { useEffect, useState } from 'react';
import { authService, type LibraryTextbookItem } from '../services/api';

export default function LibraryTextbooksPage() {
  const [textbooks, setTextbooks] = useState<LibraryTextbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadTextbooks();
  }, []);

  async function loadTextbooks() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getLibraryTextbooks();

      if (!response.success || !response.data) {
        setError(response.message || '加载课本列表失败，请稍后重试。');
        return;
      }

      setTextbooks(response.data);
    } catch (err) {
      console.error('Load library textbooks error:', err);
      setError('无法加载课本列表，请检查网络连接。');
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
            <span className="section-kicker">Library</span>
            <h2>课本列表</h2>
            <p>浏览可见课本，进入课文列表后可以继续预览每一篇课文的 PDF 内容。</p>
          </div>

          {error && <div className="student-status student-status-error student-status-animated">{error}</div>}

          {loading ? (
            <div className="student-empty-state student-loading-state">
              <div className="student-spinner"></div>
              <p>正在加载课本列表...</p>
            </div>
          ) : textbooks.length === 0 ? (
            <div className="student-empty-state student-empty-state-enhanced">
              <div className="student-empty-icon">课本</div>
              <p>当前还没有可预览的课本。</p>
            </div>
          ) : (
            <div className="card-grid">
              {textbooks.map((textbook, index) => (
                <article className="content-card" key={textbook.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="student-booking-head">
                    <div>
                      <h3>{textbook.name}</h3>
                      <p>{textbook.current_lesson ? `当前学到：${textbook.current_lesson.name}` : `${textbook.lesson_count} 篇课文`}</p>
                    </div>
                    {textbook.current_lesson && (
                      <span className="teacher-card-pill teacher-card-pill-status">当前在学</span>
                    )}
                  </div>

                  <p>{textbook.description || '暂时没有课本简介。'}</p>

                  <div className="hero-actions">
                    <button
                      className="button button-primary"
                      onClick={() => { window.location.hash = `#/library/textbooks/${textbook.id}`; }}
                    >
                      查看课文
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
