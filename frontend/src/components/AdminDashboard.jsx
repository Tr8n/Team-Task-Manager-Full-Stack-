import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import './AdminDashboard.css';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.admin();
        setData(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="admin-dashboard-state">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="admin-dashboard-state error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System-wide visibility for users, projects, and tasks.</p>
      </div>

      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <span className="admin-metric-label">Total Users</span>
          <span className="admin-metric-value">{data?.users?.total ?? 0}</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Admins</span>
          <span className="admin-metric-value">{data?.users?.admin ?? 0}</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Members</span>
          <span className="admin-metric-value">{data?.users?.member ?? 0}</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Projects</span>
          <span className="admin-metric-value">{data?.projects?.total ?? 0}</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Total Tasks</span>
          <span className="admin-metric-value">{data?.tasks?.total ?? 0}</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Overdue Tasks</span>
          <span className="admin-metric-value">{data?.tasks?.overdue ?? 0}</span>
        </div>
      </div>

      <div className="admin-panels">
        <section className="admin-panel">
          <h2>Task Status</h2>
          <div className="admin-status-list">
            <div className="admin-status-item"><span>TODO</span><strong>{data?.tasks?.status?.TODO ?? 0}</strong></div>
            <div className="admin-status-item"><span>IN PROGRESS</span><strong>{data?.tasks?.status?.IN_PROGRESS ?? 0}</strong></div>
            <div className="admin-status-item"><span>DONE</span><strong>{data?.tasks?.status?.DONE ?? 0}</strong></div>
          </div>
        </section>

        <section className="admin-panel">
          <h2>Recent Users</h2>
          <div className="admin-table">
            {data?.recentUsers?.length ? (
              data.recentUsers.map((user) => (
                <div key={user._id} className="admin-row">
                  <span>{user.name}</span>
                  <span>{user.role}</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="admin-empty">No users found.</div>
            )}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Recent Tasks</h2>
          <div className="admin-table">
            {data?.recentTasks?.length ? (
              data.recentTasks.map((task) => (
                <div key={task._id} className="admin-row admin-row-task">
                  <span>{task.title}</span>
                  <span>{task.project?.name || '-'}</span>
                  <span>{task.status}</span>
                </div>
              ))
            ) : (
              <div className="admin-empty">No tasks found.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
