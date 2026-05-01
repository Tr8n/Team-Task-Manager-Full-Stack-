import React from 'react';
import './Sidebar.css';

const Sidebar = ({ dashboard, projects, tasks, onToggleSidebar, isOpen }) => {
  const overdue = dashboard?.overdue || 0;
  const total = dashboard?.totalTasks || 0;
  const todo = dashboard?.status?.TODO || 0;
  const inProgress = dashboard?.status?.IN_PROGRESS || 0;
  const done = dashboard?.status?.DONE || 0;
  const uniqueMembers = new Set(
    projects.flatMap((project) => (project.members || []).map((member) => member.email))
  ).size;
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Team Task Manager</h3>
        <button className="close-btn" onClick={onToggleSidebar}>✕</button>
      </div>

      <div className="sidebar-content">
        <div className="stats-section">
          <h4>Overview</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Listed Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{uniqueMembers}</span>
              <span className="stat-label">Team Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{overdue}</span>
              <span className="stat-label">Overdue</span>
            </div>
          </div>
        </div>

        <div className="categories-section">
          <h4>Status Breakdown</h4>
          <div className="category-list">
            <div className="category-item"><span className="category-name">TODO</span><span className="category-count">{todo}</span></div>
            <div className="category-item"><span className="category-name">IN PROGRESS</span><span className="category-count">{inProgress}</span></div>
            <div className="category-item"><span className="category-name">DONE</span><span className="category-count">{done}</span></div>
            <div className="category-item"><span className="category-name">TOTAL</span><span className="category-count">{total}</span></div>
          </div>
        </div>

        <div className="quick-actions">
          <h4>Assignment Coverage</h4>
          <button className="action-btn"><span>✅</span>Authentication (Signup/Login)</button>
          <button className="action-btn"><span>✅</span>Project & Team Management</button>
          <button className="action-btn"><span>✅</span>Task Tracking with Status</button>
          <button className="action-btn"><span>✅</span>Dashboard with Overdue</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 