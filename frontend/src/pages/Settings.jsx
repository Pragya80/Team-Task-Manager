import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import api from '../api/axios';
import useProject from '../hooks/useProject';
import { Save, AlertTriangle, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const Settings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, role, isLoading, error: projectError } = useProject(id);
  
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || ''
      });
    }
  }, [project]);

  if (isLoading) return <LoadingSpinner fullScreen />;

  // Only admins can access settings
  if (role && role !== 'admin') {
    return <Navigate to={`/projects/${id}`} replace />;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      await api.put(`/projects/${id}`, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmMessage = "Are you ABSOLUTELY sure? This will delete the project and all associated tasks and memberships permanently. This action cannot be undone.";
    if (!window.confirm(confirmMessage)) return;

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your project details and danger zone actions</p>
      </div>

      <ErrorAlert message={projectError || error} onDismiss={() => setError('')} />
      
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">Project settings updated successfully!</p>
        </div>
      )}

      {/* General Settings */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Information</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                rows={4}
                maxLength={500}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-70 transition-colors"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-white shadow-sm dark:border-red-900/30 dark:bg-gray-900 mt-8">
        <div className="border-b border-red-100 dark:border-red-900/30 px-6 py-4 bg-red-50/50 dark:bg-red-900/10">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle size={20} />
            Danger Zone
          </h2>
        </div>
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Delete this project</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
              Once you delete a project, there is no going back. Please be certain.
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors whitespace-nowrap"
          >
            <Trash2 size={18} />
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
