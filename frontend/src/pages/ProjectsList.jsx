import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, LayoutDashboard, Users, CheckSquare } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/projects', formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchProjects(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      {projects.length === 0 ? (
        <EmptyState 
          icon={LayoutDashboard}
          title="No projects found"
          description="Get started by creating a new project."
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              <Plus size={18} />
              Create Project
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-700"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                  {project.name}
                </h3>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  project.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {project.role}
                </span>
              </div>
              
              <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                {project.description || 'No description provided.'}
              </p>
              
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CheckSquare size={16} />
                  <span>{project.task_count} tasks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={16} />
                  <span>{project.member_count} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label-[for="name"] className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label-[for="name"]>
            <input
              id="name"
              type="text"
              required
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              placeholder="e.g. Website Redesign"
            />
          </div>
          <div>
            <label-[for="description"] className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label-[for="description"]>
            <textarea
              id="description"
              rows={3}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              placeholder="Brief description of the project..."
            />
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
              disabled={isSubmitting || !formData.name}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsList;
