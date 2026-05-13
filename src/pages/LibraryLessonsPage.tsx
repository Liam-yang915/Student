import { useEffect, useState } from 'react';
import { authService, type LibraryLessonsResponse } from '../services/api';

type Props = {
  textbookId: string;
};

export default function LibraryLessonsPage({ textbookId }: Props) {
  const [pageData, setPageData] = useState<LibraryLessonsResponse['data']>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadLessons();
  }, [textbookId]);

  async function loadLessons() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getLibraryLessons(textbookId);

      if (!response.success || !response.data) {
        setError(response.message || '加载课文列表失败，请稍后重试。');
        return;
      }

      setPageData(response.data);
    } catch (err) {
      console.error('Load library lessons error:', err);
      setError('无法加载课文列表，请检查网络连接。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="home-header">
        <div className="container home-header-inner">
          <a href="#/library" className="brand-mark">
            English Learning
          </a>
          <div className="hero-actions">
            <button className="button button-secondary" onClick={() => { window.location.hash = '#/library'; }}>
              返回课本列表
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
            <span className="section-kicker">Lessons</span>
            <h2>{pageData?.textbook.name || '课文列表'}</h2>
            <p>{pageData?.textbook.description || '点击任意课文后可以进入预览页查看 PDF。'}</p>
          </div>

          {error && <div className="student-status student-status-error student-status-animated">{error}</div>}

          {loading ? (
            <div className="student-empty-state student-loading-state">
              <div className="student-spinner"></div>
              <p>正在加载课文列表...</p>
            </div>
          ) : !pageData || pageData.lessons.length === 0 ? (
            <div className="student-empty-state student-empty-state-enhanced">
              <div className="student-empty-icon">课文</div>
              <p>这本课本当前还没有可预览的课文。</p>
            </div>
          ) : (
            <div className="card-grid">
              {pageData.lessons.map((lesson, index) => (
                <article className="content-card" key={lesson.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="student-booking-head">
                    <div>
                      <h3>{lesson.name}</h3>
                      <p>{lesson.is_current ? '当前正在学习' : 'PDF 预览'}</p>
                    </div>
                    {lesson.is_current && (
                      <span className="teacher-card-pill teacher-card-pill-status">当前课文</span>
                    )}
                  </div>

                  <div className="hero-actions">
                    <button
                      className="button button-primary"
                      onClick={() => { window.location.hash = `#/library/lessons/${lesson.id}`; }}
                    >
                      预览课文
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
