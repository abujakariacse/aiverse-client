import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldAlert, Trash2, CheckCircle, AlertTriangle, Eye, Calendar, User } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminReports = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load reported prompts list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token]);

  const handleReportAction = async (reportId, targetAction) => {
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: targetAction }),
      });

      if (response.ok) {
        toast.success(`Action '${targetAction}' executed successfully.`);
        // Remove from list or set to resolved
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to execute report action');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error executing report action');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Only show pending reports to keep view actionable
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Reported Prompts Moderation Queue</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Review community warnings, warn creators, dismiss complaints, or remove posts.</p>
      </div>

      {pendingReports.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          No reported items pending review. Outstanding job!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pendingReports.map((report) => (
            <div key={report._id} className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <AlertTriangle size={12} /> Reason: {report.reason}
                  </span>
                  <h3 style={{ fontSize: '1.15rem' }}>
                    Prompt: {report.promptId?.title || <span style={{ color: '#64748b', fontStyle: 'italic' }}>Deleted Prompt Template</span>}
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  <span>Reported on {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              {report.description && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  color: '#94a3b8',
                }}>
                  <strong>Report Details:</strong> "{report.description}"
                </div>
              )}

              {/* Meta information */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                  <User size={12} />
                  <span>Reported by: {report.reporterId?.name || 'Unknown'} ({report.reporterId?.email || 'N/A'})</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {report.promptId && (
                    <button
                      onClick={() => navigate(`/prompts/${report.promptId._id}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleReportAction(report._id, 'dismiss')}
                    className="btn btn-secondary btn-sm text-success"
                    style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}
                  >
                    <CheckCircle size={12} style={{ color: '#10b981' }} />
                    <span>Dismiss</span>
                  </button>
                  <button
                    onClick={() => handleReportAction(report._id, 'warn')}
                    className="btn btn-secondary btn-sm text-warning"
                    style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}
                  >
                    <AlertTriangle size={12} style={{ color: '#f59e0b' }} />
                    <span>Warn Creator</span>
                  </button>
                  <button
                    onClick={() => handleReportAction(report._id, 'remove')}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={12} />
                    <span>Remove Prompt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;

// Admin warnings and purging definitions
