import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import useProject from '../hooks/useProject';
import { UserPlus, UserMinus, Shield, User } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import Modal from '../components/Modal';

const Team = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const { project, role: myRole, isLoading: projectLoading, error: projectError } = useProject(id);
  
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', role: 'member' });

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/projects/${id}/members`);
      setMembers(response.data.members);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch team members');
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    if (project) fetchMembers();
  }, [project]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!formData.email) return;
    
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${id}/members`, formData);
      setIsModalOpen(false);
      setFormData({ email: '', role: 'member' });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/projects/${id}/members/${userId}/role`, { role: newRole });
      setMembers(members.map(m => m.id === userId ? { ...m, role: newRole } : m));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      setMembers(members.filter(m => m.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (projectLoading || membersLoading) return <LoadingSpinner fullScreen />;

  const isAdmin = myRole === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project?.name} - Team</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage project members and roles</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            <UserPlus size={18} />
            Add Member
          </button>
        )}
      </div>

      <ErrorAlert message={projectError || error} onDismiss={() => setError('')} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Joined</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                        {member.id === currentUser?.id && <span className="ml-2 text-xs text-gray-500">(You)</span>}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {member.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {isAdmin && member.id !== currentUser?.id ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="rounded-lg border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {member.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(member.joined_at).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      {member.id !== currentUser?.id && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          title="Remove user"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
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
              disabled={isSubmitting || !formData.email}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;
