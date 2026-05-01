import React, { useEffect, useState } from 'react';
import { authAPI, projectsAPI, tasksAPI, dashboardAPI } from '../services/api';
import Sidebar from './Sidebar';
import './Main.css';

const Main = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    memberIds: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    projectId: '',
    newProjectName: '',
    assignedTo: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchAll();
  }, [statusFilter]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes, usersRes, dashboardRes] = await Promise.all([
        projectsAPI.list(),
        tasksAPI.list(statusFilter === 'ALL' ? {} : { status: statusFilter }),
        authAPI.users(),
        dashboardAPI.get()
      ]);
      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);
      setUsers(usersRes.data || []);
      setDashboard(dashboardRes.data || null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create({
        name: projectForm.name,
        description: projectForm.description,
        memberIds: projectForm.memberIds.split(',').map((id) => id.trim()).filter(Boolean)
      });
      setProjectForm({ name: '', description: '', memberIds: '' });
      setShowProjectForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      let projectId = taskForm.projectId;

      if (projectId === '__new__') {
        const trimmedProjectName = taskForm.newProjectName.trim();
        if (!trimmedProjectName) {
          setError('Please enter a new project name');
          return;
        }

        const memberIds = taskForm.assignedTo ? [taskForm.assignedTo] : [];
        const createdProject = await projectsAPI.create({
          name: trimmedProjectName,
          description: `Auto-created while creating task: ${taskForm.title}`,
          memberIds
        });
        projectId = createdProject?.data?._id;
      }

      await tasksAPI.create({
        title: taskForm.title,
        description: taskForm.description,
        projectId,
        assignedTo: taskForm.assignedTo,
        dueDate: taskForm.dueDate
      });
      setTaskForm({ title: '', description: '', projectId: '', newProjectName: '', assignedTo: '', dueDate: '' });
      setShowTaskForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await tasksAPI.updateStatus(taskId, status);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

  return (
    <div className="main-container">
      <Sidebar
        dashboard={dashboard}
        projects={projects}
        tasks={tasks}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isOpen={sidebarOpen}
      />

      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="main-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1>Team Task Manager</h1>
            <p>Projects and tasks in one clean workspace</p>
          </div>
          <div className="header-right">
            <button className="btn btn-secondary" onClick={() => setShowProjectForm(true)}>Create Project</button>
            <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>Create Task</button>
          </div>
        </div>

        <div className="search-filters">
          <div className="search-box"><strong>Status Filter</strong></div>
          <div className="filters">
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        </div>

        {showProjectForm && (
          <div className="form-overlay">
            <div className="form-modal">
              <div className="form-header">
                <h2>Create Project</h2>
                <button className="close-btn" onClick={() => setShowProjectForm(false)}>✕</button>
              </div>
              <form onSubmit={handleProjectSubmit} className="link-form">
                <div className="form-group">
                  <label>Project Name *</label>
                  <input className="form-input" required value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-textarea" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Member IDs (comma separated)</label>
                  <input className="form-input" value={projectForm.memberIds} onChange={(e) => setProjectForm({ ...projectForm, memberIds: e.target.value })} />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProjectForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTaskForm && (
          <div className="form-overlay">
            <div className="form-modal">
              <div className="form-header">
                <h2>Create Task</h2>
                <button className="close-btn" onClick={() => setShowTaskForm(false)}>✕</button>
              </div>
              <form onSubmit={handleTaskSubmit} className="link-form">
                <div className="form-group">
                  <label>Task Title *</label>
                  <input className="form-input" required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-textarea" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Project *</label>
                    <select className="form-select" required value={taskForm.projectId} onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}>
                      <option value="">Select</option>
                      <option value="__new__">+ Add New Project</option>
                      {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assigned To *</label>
                    <select className="form-select" required value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                      <option value="">Select</option>
                      {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                    </select>
                  </div>
                </div>
                {taskForm.projectId === '__new__' && (
                  <div className="form-group">
                    <label>New Project Name *</label>
                    <input
                      className="form-input"
                      required
                      placeholder="Enter new project name"
                      value={taskForm.newProjectName}
                      onChange={(e) => setTaskForm({ ...taskForm, newProjectName: e.target.value })}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" className="form-input" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowTaskForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="links-container">
          {loading ? <div className="loading">Loading...</div> : error ? (
            <div className="error">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">-</div><h3>No tasks found</h3><p>Create your first task.</p></div>
          ) : (
            <div className="links-grid">
              {tasks.map((task) => (
                <div key={task._id} className="link-card">
                  <div className="link-header">
                    <div className="link-meta">
                      <span className="category-icon">#</span>
                      <span className="category-name">{task.project?.name || 'Project'}</span>
                    </div>
                    <select className="filter-select" value={task.status} onChange={(e) => handleStatusUpdate(task._id, e.target.value)}>
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <div className="link-content">
                    <h3 className="link-title">{task.title}</h3>
                    <p className="link-description">{task.description || 'No description'}</p>
                    <p className="link-url">Assigned To: {task.assignedTo?.name || '-'}</p>
                    <p className="link-url">Created By: {task.createdBy?.name || '-'}</p>
                    <p className="link-url">Due Date: {formatDate(task.dueDate)}</p>
                  </div>
                  <div className="link-footer">
                    <span className="link-date">Created: {formatDate(task.createdAt)}</span>
                    <span className="analysis-date">Status: {task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
