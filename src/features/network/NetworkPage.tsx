import React, { useState, useEffect } from 'react';
import CompanyForm from './CompanyForm';
import IndividualForm from './IndividualForm';
import ProjectForm from './ProjectForm.tsx';

interface EquipmentGroup {
  id: string;
  tag: string;
  options: EquipmentOption[];
}

interface EquipmentOption {
  id: string;
  type: string;
  equipmentTag: string;
  commonFields: Record<string, any>;
  fluidFlows: FluidFlow[];
  attachments?: Attachment[];
}

interface FluidFlow {
  id: string;
  type: string;
  fields: Record<string, any>;
}

interface Attachment {
  id: string;
  type: string;
  fileName: string;
}

interface Project {
  id: string;
  name: string;
  address?: string;
  city?: string;
  localASHRAEWeatherStation?: string;
  costPerKwh?: string;
  costPerGpm?: string;
  costPerGpmSewer?: string;
  costPerMbtuGas?: string;
  equipmentGroups: EquipmentGroup[];
  peopleIds: string[];
  description?: string;
}

interface Individual {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  notes?: string;
  individuals: Individual[];
  projects: Project[];
}

export default function NetworkPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showIndividualForm, setShowIndividualForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingIndividual, setEditingIndividual] = useState<Individual | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [draggedPersonId, setDraggedPersonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch companies on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/v1/companies')
      .then(res => res.json())
      .then(data => {
        setCompanies(data.companies || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load companies');
        setLoading(false);
      });
  }, []);

  // Helper to show success message
  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 2000);
  };

  // Add Company
  const handleAddCompany = async (company: { name: string; industry?: string; website?: string; notes?: string }) => {
    const newCompany = { ...company, id: Date.now().toString(), individuals: [], projects: [] };
    setCompanies(prev => [
      ...prev,
      newCompany
    ]);
    setSelectedCompany(newCompany); // Reselect to force UI update
    setShowCompanyForm(false);

    // Persist to backend
    try {
      await fetch('/api/v1/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany),
      });
    } catch (err) {
      setError('Failed to add company');
    }
  };

  // Edit Company
  const handleEditCompany = async (company: { name: string; industry?: string; website?: string; notes?: string }) => {
    if (!editingCompany) return;
    setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...company } : c));
    setSelectedCompany(prev => prev && prev.id === editingCompany.id ? { ...prev, ...company } : prev);
    setEditingCompany(null);
    setShowCompanyForm(false);

    // Persist to backend
    try {
      await fetch('/api/v1/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingCompany, ...company }),
      });
    } catch (err) {
      setError('Failed to edit company');
    }
  };

  // Delete Company
  const handleDeleteCompany = async (id: string) => {
    fetch(`/api/v1/companies/${id}`, { method: 'DELETE' });
    setCompanies(prev => prev.filter(c => c.id !== id));
    setSelectedCompany(null);

    // Persist to backend
    try {
      await fetch(`/api/v1/companies/${id}`, { method: 'DELETE' });
    } catch (err) {
      setError('Failed to delete company');
    }
  };

  // Add Individual (optimistic)
  const handleAddIndividual = async (person: Omit<Individual, 'id'>) => {
    if (!selectedCompany) return;
    setLoading(true);
    setError(null);
    const optimisticId = Date.now().toString();
    const optimisticCompany = {
      ...selectedCompany,
      individuals: [...selectedCompany.individuals, { ...person, id: optimisticId }],
    };
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? optimisticCompany : c));
    setSelectedCompany(optimisticCompany);
    setShowIndividualForm(false);
    try {
      const response = await fetch(`/api/v1/companies/${selectedCompany.id}/individuals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person),
      });
      if (!response.ok) throw new Error('Failed to add individual');
      const updatedCompany: Company = await response.json();
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      setSelectedCompany(updatedCompany);
      showSuccess('Person added!');
    } catch (err: any) {
      setError(err.message || 'Failed to add individual');
      // Revert optimistic update
      setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? selectedCompany : c));
      setSelectedCompany(selectedCompany);
    } finally {
      setLoading(false);
    }
  };

  // Edit Individual (optimistic)
  const handleEditIndividual = async (person: Omit<Individual, 'id'>) => {
    if (!selectedCompany || !editingIndividual) return;
    setLoading(true);
    setError(null);
    const prevCompany = selectedCompany;
    const optimisticCompany = {
      ...selectedCompany,
      individuals: selectedCompany.individuals.map(p => p.id === editingIndividual.id ? { ...p, ...person } : p),
    };
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? optimisticCompany : c));
    setSelectedCompany(optimisticCompany);
    setEditingIndividual(null);
    setShowIndividualForm(false);
    try {
      const response = await fetch(`/api/v1/companies/${selectedCompany.id}/individuals/${editingIndividual.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person),
      });
      if (!response.ok) throw new Error('Failed to edit individual');
      const updatedCompany: Company = await response.json();
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      setSelectedCompany(updatedCompany);
      showSuccess('Person updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to edit individual');
      setCompanies(prev => prev.map(c => c.id === prevCompany.id ? prevCompany : c));
      setSelectedCompany(prevCompany);
    } finally {
      setLoading(false);
    }
  };

  // Delete Individual (optimistic)
  const handleDeleteIndividual = async (id: string) => {
    if (!selectedCompany) return;
    setLoading(true);
    setError(null);
    const prevCompany = selectedCompany;
    const optimisticCompany = {
      ...selectedCompany,
      individuals: selectedCompany.individuals.filter(p => p.id !== id),
    };
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? optimisticCompany : c));
    setSelectedCompany(optimisticCompany);
    try {
      const response = await fetch(`/api/v1/companies/${selectedCompany.id}/individuals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete individual');
      const updatedCompany: Company = await response.json();
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      setSelectedCompany(updatedCompany);
      showSuccess('Person deleted!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete individual');
      setCompanies(prev => prev.map(c => c.id === prevCompany.id ? prevCompany : c));
      setSelectedCompany(prevCompany);
    } finally {
      setLoading(false);
    }
  };

  // Add Project (optimistic)
  const handleAddProject = async (project: Omit<Project, 'id' | 'peopleIds'>) => {
    if (!selectedCompany) return;
    setLoading(true);
    setError(null);
    const optimisticId = Date.now().toString();
    const optimisticCompany = {
      ...selectedCompany,
      projects: [...(selectedCompany.projects || []), { ...project, id: optimisticId, peopleIds: [] }],
    };
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? optimisticCompany : c));
    setSelectedCompany(optimisticCompany);
    setShowProjectForm(false);
    try {
      const response = await fetch(`/api/v1/companies/${selectedCompany.id}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to add project');
      const updatedCompany: Company = await response.json();
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      setSelectedCompany(updatedCompany);
      showSuccess('Project added!');
    } catch (err: any) {
      setError(err.message || 'Failed to add project');
      setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? selectedCompany : c));
      setSelectedCompany(selectedCompany);
    } finally {
      setLoading(false);
    }
  };

  // Edit Project (optimistic)
  const handleEditProject = async (project: Omit<Project, 'id' | 'peopleIds'>) => {
    if (!selectedCompany || !editingProject) return;
    setLoading(true);
    setError(null);
    const prevCompany = selectedCompany;
    const optimisticCompany = {
      ...selectedCompany,
      projects: selectedCompany.projects.map(p => p.id === editingProject.id ? { ...p, ...project } : p),
    };
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? optimisticCompany : c));
    setSelectedCompany(optimisticCompany);
    setEditingProject(null);
    setShowProjectForm(false);
    try {
      const response = await fetch(`/api/v1/companies/${selectedCompany.id}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to edit project');
      const updatedCompany: Company = await response.json();
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      setSelectedCompany(updatedCompany);
      showSuccess('Project updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to edit project');
      setCompanies(prev => prev.map(c => c.id === prevCompany.id ? prevCompany : c));
      setSelectedCompany(prevCompany);
    } finally {
      setLoading(false);
    }
  };

  // Delete Project (optimistic)
  const handleDeleteProject = async (id: string) => {
    if (!selectedCompany) return;
    setLoading(true);
    setError(null);
    const prevCompany = selectedCompany;
    const optimisticCompany = {
      ...selectedCompany,
      projects: selectedCompany.projects.filter(p => p.id !== id),
    };
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? optimisticCompany : c));
    setSelectedCompany(optimisticCompany);
    try {
      const response = await fetch(`/api/v1/companies/${selectedCompany.id}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      const updatedCompany: Company = await response.json();
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      setSelectedCompany(updatedCompany);
      showSuccess('Project deleted!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      setCompanies(prev => prev.map(c => c.id === prevCompany.id ? prevCompany : c));
      setSelectedCompany(prevCompany);
    } finally {
      setLoading(false);
    }
  };

  // Link/Unlink People to Project (optimistic)
  const handleTogglePersonOnProject = async (projectId: string, personId: string) => {
    if (!selectedCompany) return;
    setLoading(true);
    setError(null);
    const prevCompany = selectedCompany;
    const optimisticCompany = {
      ...selectedCompany,
      projects: selectedCompany.projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              peopleIds: p.peopleIds.includes(personId)
                ? p.peopleIds.filter(id => id !== personId)
                : [...p.peopleIds, personId],
            }
          : p
      ),
    };
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? optimisticCompany : c));
    setSelectedCompany(optimisticCompany);
    try {
      const response = await fetch(`/api/v1/companies/${selectedCompany.id}/projects/${projectId}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId }),
      });
      if (!response.ok) throw new Error('Failed to update project people');
      const updatedCompany: Company = await response.json();
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      setSelectedCompany(updatedCompany);
      showSuccess('Project people updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to update project people');
      setCompanies(prev => prev.map(c => c.id === prevCompany.id ? prevCompany : c));
      setSelectedCompany(prevCompany);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      {loading && <div className="text-blue-300 mb-4">Loading companies...</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <h1 className="text-4xl font-extrabold mb-10 text-blue-200 tracking-tight">Network CRM</h1>
      <div className="flex gap-10">
        {/* Companies List */}
        <div className="w-1/4 bg-blue-950 rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-100">Companies</h2>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingCompany(null); setShowCompanyForm(true); }}>
              +
            </button>
          </div>
          <ul className="divide-y divide-blue-900">
            {companies.map(company => (
              <li
                key={company.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCompany?.id === company.id ? 'bg-blue-800 text-blue-100' : 'hover:bg-blue-900 text-blue-300'}`}
                onClick={() => setSelectedCompany(company)}
              >
                <div className="font-semibold">{company.name}</div>
                <div className="text-xs text-blue-400">{company.industry}</div>
              </li>
            ))}
            {companies.length === 0 && (
              <li className="p-3 text-blue-400">No companies yet.</li>
            )}
          </ul>
        </div>
        {/* Main Panel: People & Projects */}
        <div className="flex-1 bg-blue-950 rounded-xl shadow-lg p-6">
          {selectedCompany ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-100">{selectedCompany.name}</h2>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => { setEditingIndividual(null); setShowIndividualForm(true); }}>+ Person</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditingProject(null); setShowProjectForm(true); }}>+ Project</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditingCompany(selectedCompany); setShowCompanyForm(true); }}>Edit</button>
                  <button className="btn btn-error btn-sm" onClick={() => handleDeleteCompany(selectedCompany.id)}>Delete</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* People List */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-200 mb-2">People</h3>
                  <ul className="bg-blue-900 rounded-lg divide-y divide-blue-800">
                    {selectedCompany.individuals.map(person => (
                      <li
                        key={person.id}
                        className="p-3 flex justify-between items-center cursor-move"
                        draggable
                        onDragStart={() => setDraggedPersonId(person.id)}
                        onDragEnd={() => setDraggedPersonId(null)}
                      >
                        <div>
                          <div className="font-medium text-blue-100">{person.name}</div>
                          <div className="text-xs text-blue-400">{person.email || person.phone}</div>
                        </div>
                        <span>
                          <button className="btn btn-xs btn-ghost" onClick={() => { setEditingIndividual(person); setShowIndividualForm(true); }}>Edit</button>
                          <button className="btn btn-xs btn-error" onClick={() => handleDeleteIndividual(person.id)}>Delete</button>
                        </span>
                      </li>
                    ))}
                    {selectedCompany.individuals.length === 0 && (
                      <li className="p-3 text-blue-400">No individuals yet.</li>
                    )}
                  </ul>
                </div>
                {/* Projects List */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-200 mb-2">Projects</h3>
                  <ul className="bg-blue-900 rounded-lg divide-y divide-blue-800">
                    {selectedCompany.projects && selectedCompany.projects.map(project => (
                      <li key={project.id} className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-blue-100">{project.name}</div>
                            <div className="text-xs text-blue-400">{project.description}</div>
                          </div>
                          <span>
                            <button className="btn btn-xs btn-ghost" onClick={() => { setEditingProject(project); setShowProjectForm(true); }}>Edit</button>
                            <button className="btn btn-xs btn-error" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                          </span>
                        </div>
                        {/* Drag-and-drop People Assignment */}
                        <div className="mt-2">
                          <div className="text-xs text-blue-300 mb-1">People on this project:</div>
                          <div
                            className="flex flex-wrap gap-2 min-h-[32px] border border-blue-700 rounded p-2 bg-blue-950"
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => {
                              if (draggedPersonId) handleTogglePersonOnProject(project.id, draggedPersonId);
                              setDraggedPersonId(null);
                            }}
                          >
                            {selectedCompany.individuals.filter(person => project.peopleIds.includes(person.id)).map(person => (
                              <div
                                key={person.id}
                                className="px-2 py-1 bg-blue-800 text-blue-100 rounded cursor-move"
                                draggable
                                onDragStart={() => setDraggedPersonId(person.id)}
                                onDragEnd={() => setDraggedPersonId(null)}
                              >
                                {person.name}
                                <button
                                  className="ml-2 text-xs text-red-300 hover:text-red-100"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleTogglePersonOnProject(project.id, person.id);
                                  }}
                                  title="Remove from project"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {/* Show a placeholder if no people assigned */}
                            {selectedCompany.individuals.filter(person => project.peopleIds.includes(person.id)).length === 0 && (
                              <span className="text-blue-400 text-xs">Drag people here to assign.</span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                    {(!selectedCompany.projects || selectedCompany.projects.length === 0) && (
                      <li className="p-3 text-blue-400">No projects yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-blue-400 mt-10 text-lg">Select a company to view its people and projects.</div>
          )}
        </div>
      </div>
      {/* Company Form Modal */}
      {showCompanyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => { setShowCompanyForm(false); setEditingCompany(null); }} />
          <div className="relative z-10">
            <CompanyForm
              onSave={editingCompany ? handleEditCompany : handleAddCompany}
              onCancel={() => { setShowCompanyForm(false); setEditingCompany(null); }}
              initial={editingCompany || undefined}
            />
          </div>
        </div>
      )}
      {/* Individual Form Modal */}
      {showIndividualForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => { setShowIndividualForm(false); setEditingIndividual(null); }} />
          <div className="relative z-10">
            <IndividualForm
              onSave={editingIndividual ? handleEditIndividual : handleAddIndividual}
              onCancel={() => { setShowIndividualForm(false); setEditingIndividual(null); }}
              initial={editingIndividual || undefined}
            />
          </div>
        </div>
      )}
      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => { setShowProjectForm(false); setEditingProject(null); }} />
          <div className="relative z-10">
            <ProjectForm
              onSave={editingProject ? handleEditProject : handleAddProject}
              onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
              initial={editingProject || undefined}
            />
          </div>
        </div>
      )}
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-lg z-50">
          {success}
        </div>
      )}
    </div>
  );
}
