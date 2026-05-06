import { useState, useEffect } from 'react';
import api from '../api/axios';

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data.project);
        
        // Find current user's role from members list
        // Assuming we store userId in localStorage or we can fetch /projects to find role.
        // Wait, the backend doesn't explicitly return `req.userRole` in `GET /projects/:id` root object unless we add it.
        // Let's get user from localstorage.
        const user = JSON.parse(localStorage.getItem('user'));
        const member = response.data.project.members.find(m => m.id === user?.id);
        setRole(member?.role || 'member');
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project details');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  return { project, role, isLoading, error };
};

export default useProject;
