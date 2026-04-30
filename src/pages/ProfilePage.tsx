import { useEffect, useState } from 'react';
import { authService } from '../services/api';

export default function ProfilePage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    // Get stored student info
    const storedStudent = authService.getStoredStudent();
    setStudent(storedStudent);
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.hash = '#/login';
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      window.location.hash = '#/login';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '4px'
            }}>
              个人信息
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              查看和管理您的个人资料
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            退出登录
          </button>
        </header>

        {/* Profile Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Avatar Section */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'white',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#667eea'
            }}>
              {student.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '4px'
            }}>
              {student.name}
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px'
            }}>
              学生
            </p>
          </div>

          {/* Information Section */}
          <div style={{ padding: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px'
            }}>
              基本信息
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* ID */}
              <div style={{
                display: 'flex',
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '120px',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  学生ID
                </div>
                <div style={{
                  flex: 1,
                  color: '#111827',
                  fontSize: '14px'
                }}>
                  #{student.id}
                </div>
              </div>

              {/* Name */}
              <div style={{
                display: 'flex',
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '120px',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  姓名
                </div>
                <div style={{
                  flex: 1,
                  color: '#111827',
                  fontSize: '14px'
                }}>
                  {student.name}
                </div>
              </div>

              {/* Email */}
              <div style={{
                display: 'flex',
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '120px',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  邮箱
                </div>
                <div style={{
                  flex: 1,
                  color: '#111827',
                  fontSize: '14px'
                }}>
                  {student.email}
                </div>
              </div>

              {/* Phone */}
              <div style={{
                display: 'flex',
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '120px',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  手机号
                </div>
                <div style={{
                  flex: 1,
                  color: '#111827',
                  fontSize: '14px'
                }}>
                  {student.phone || '未设置'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => window.location.hash = '#/'}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
