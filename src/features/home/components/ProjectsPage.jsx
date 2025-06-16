// src/features/home/components/ProjectsPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

const ProjectsPage = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/userdata/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error('Could not load projects:', err);
        setError('Could not load projects.');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <div className="text-center py-12 text-blue-300">Please sign in to view your projects.</div>;
  if (loading) return <div className="text-center py-12 text-blue-300">Loading projects...</div>;
  if (error) return <div className="text-center py-12 text-red-400">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-100 mb-8 text-center">My Projects</h1>
      {projects.length === 0 ? (
        <div className="text-blue-300 text-center">No projects found.</div>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="bg-gray-800 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-100 mb-2">{project.name}</h2>
              <div className="text-blue-300 text-sm mb-1">{project.address}</div>
              <div className="text-blue-300 text-sm mb-1">{project.city}</div>
              <div className="text-blue-300 text-xs">ID: {project.id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPage;
