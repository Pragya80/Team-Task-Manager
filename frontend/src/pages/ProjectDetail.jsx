import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import useProject from '../hooks/useProject';
import { Plus, Trash2, Filter, CheckSquare } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { project, role, isLoading: projectLoading, error: projectError } = useProject(id);
  
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [overdueFilter, setOverdueFilter] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', assigned_to: '', due_date: ''
  });

  const fetchTasks = async () => {
    setTasksLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (assigneeFilter) params.append('assignee', assigneeFilter);
      if (overdueFilter) params.append('overdue', 'true');

      const response = await api.get(`/projects/${id}/tasks?${params.toString()}`);
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      fetchTasks();
    }
  }, [project, statusFilter, assigneeFilter, overdueFilter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.assigned_to) delete payload.assigned_to;
      if (!payload.due_date) delete payload.due_date;

      await api.post(`/projects/${id}/tasks`, payload);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 'medium', assigned_to: '', due_date: '' });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/projects/${id}/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  if (projectLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project?.name} - Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project?.description}</p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            <Plus size={18} />
            New Task
          </button>
        )}
      </div>

      <ErrorAlert message={projectError || error} onDismiss={() => setError('')} />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="rounded-lg border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Assignees</option>
          <option value={user?.id}>Assigned to me</option>
          {project?.members?.filter(m => m.id !== user?.id).map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={overdueFilter}
            onChange={(e) => setOverdueFilter(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          Overdue only
        </label>
      </div>

      {/* Task List */}
      {tasksLoading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks found" description="Create a task or adjust filters." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {tasks.map(task => {
              const canUpdateStatus = role === 'admin' || task.assigned_to?.id === user?.id;
              
              return (
                <li key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          {task.title}
                        </h4>
                        {task.is_overdue && <StatusBadge status="overdue" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <PriorityBadge priority={task.priority} />
                        {task.due_date && <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                        {task.assigned_to ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                              {task.assigned_to.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{task.assigned_to.name}</span>
                          </div>
                        ) : (
                          <span className="italic">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        disabled={!canUpdateStatus}
                        className={`rounded-lg py-1.5 pl-3 pr-8 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                          !canUpdateStatus ? 'opacity-60 cursor-not-allowed border-transparent' : 'border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      {role === 'admin' && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              required
              maxLength={150}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
            <textarea
              rows={3}
              maxLength={2000}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign To</label>
            <select
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="">Unassigned</option>
              {project?.members?.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
