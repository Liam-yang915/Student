import { useEffect, useState } from 'react';
import { authService, type LessonPreviewResponse } from '../services/api';

type Props = {
  lessonId: string;
};

export default function LessonPreviewPage({ lessonId }: Props) {
  const [pageData, setPageData] = useState<LessonPreviewResponse['data']>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    void loadLesson();
  }, [lessonId]);

  async function loadLesson() {
    setLoading(true);
    setError('');

    try {
      const response = await authService.getLessonPreview(lessonId);

      if (!response.success || !response.data) {
        setError(response.message || '加载课文预览失败，请稍后重试。');
        return;
      }

      setPageData(response.data);
    } catch (err) {
      console.error('Load lesson preview error:', err);
      setError('无法加载课文预览，请检查网络连接。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="home-header">
        <div className="container home-header-inner">
          <a
            href={pageData?.textbook ? `#/library/textbooks/${pageData.textbook.id}` : '#/library'}
            className="brand-mark"
          >
            English Learning
          </a>
          <div className="hero-actions">
            <button
              className="button button-secondary"
              onClick={() => {
                window.location.hash = pageData?.textbook ? `#/library/textbooks/${pageData.textbook.id}` : '#/library';
              }}
            >
              返回课文列表
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
            <span className="section-kicker">Lesson Preview</span>
            <h2>{pageData?.name || '课文预览'}</h2>
            <p>{pageData?.textbook ? `来自课本：${pageData.textbook.name}` : '正在加载课文内容。'}</p>
          </div>

          {error && <div className="student-status student-status-error student-status-animated">{error}</div>}

          {loading ? (
            <div className="student-empty-state student-loading-state">
              <div className="student-spinner"></div>
              <p>正在加载课文预览...</p>
            </div>
          ) : !pageData ? (
            <div className="student-empty-state student-empty-state-enhanced">
              <div className="student-empty-icon">预览</div>
              <p>当前无法预览这篇课文。</p>
            </div>
          ) : (
            <div className="content-card">
              <div className="hero-actions" style={{ marginBottom: '16px' }}>
                <button
                  className="button button-secondary"
                  onClick={() => {
                    if (pageData.previous_lesson_id) {
                      window.location.hash = `#/library/lessons/${pageData.previous_lesson_id}`;
                    }
                  }}
                  disabled={!pageData.previous_lesson_id}
                >
                  上一课
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => {
                    if (pageData.next_lesson_id) {
                      window.location.hash = `#/library/lessons/${pageData.next_lesson_id}`;
                    }
                  }}
                  disabled={!pageData.next_lesson_id}
                >
                  下一课
                </button>
                <a className="button button-secondary" href={pageData.pdf_url} target="_blank" rel="noreferrer">
                  新窗口打开 PDF
                </a>
              </div>

              <div style={{ width: '100%', minHeight: '72vh', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                <iframe
                  src={pageData.pdf_url}
                  title={pageData.name}
                  style={{ width: '100%', height: '72vh', border: '0' }}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
