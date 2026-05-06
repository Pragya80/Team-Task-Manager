import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import useProject from '../hooks/useProject';
import { AlertTriangle, CheckSquare, ListTodo, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import PriorityBadge from '../components/PriorityBadge';

const Dashboard = () => {
  const { id } = useParams();
  const { project, isLoading: projectLoading, error: projectError } = useProject(id);
  
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(`/projects/${id}/dashboard`);
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setStatsLoading(false);
      }
    };

    if (id) fetchDashboard();
  }, [id]);

  if (projectLoading || statsLoading) return <LoadingSpinner fullScreen />;

  const { summary, overdueTasks } = stats;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project?.name} - Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Project statistics and overdue items</p>
      </div>

      <ErrorAlert message={projectError || error} onDismiss={() => setError('')} />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
              <CheckSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
              <ListTodo className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To Do</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{summary.todo}</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">In Progress</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-blue-900 dark:text-white">{summary.in_progress}</p>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50/50 p-6 shadow-sm dark:border-green-900/30 dark:bg-green-900/10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
              <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Done</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-green-900 dark:text-white">{summary.done}</p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/50">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Overdue</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-red-900 dark:text-red-400">{summary.overdue}</p>
        </div>
      </div>

      {/* Overdue Tasks Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overdue Tasks</h3>
        {overdueTasks.length === 0 ? (
          <EmptyState 
            icon={CheckSquare} 
            title="All caught up!" 
            description="There are no overdue tasks in this project." 
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm dark:border-red-900/30 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Task Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                  {overdueTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-300">
                          {task.assignee_name || <span className="italic text-gray-500">Unassigned</span>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400">
                        {new Date(task.due_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
