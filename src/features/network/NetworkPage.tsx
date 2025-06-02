import React, { useState, useEffect } from 'react';

// Interfaces
interface Team {
  id: string;
  name: string;
  type: 'discipline' | 'project' | 'management' | 'custom';
  description?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  outcomes?: string[];
  date?: string;
}

interface Endorsement {
  id: string;
  skill: string;
  endorserId: string;
  endorserName: string;
  endorserTitle: string;
}

interface Person {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  teamIds: string[];
  services?: string[];
  linkedIn?: string;
  twitter?: string;
  website?: string;
  projects?: Project[];
  endorsements?: Endorsement[];
}

interface Organization {
  id: string;
  name: string;
  industry: string;
  description?: string;
  website?: string;
  logo?: string;
  teams: Team[];
  people: Person[];
}

// Form Components
const PersonForm = ({ onSave, onCancel, initial, currentOrg }: any) => {
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    title: initial?.title || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    bio: initial?.bio || '',
    expertise: initial?.expertise?.join(', ') || '',
    services: initial?.services?.join(', ') || '',
    teamIds: initial?.teamIds || []
  });

  return (
    <div className="bg-blue-950 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-100 mb-4">
        {initial ? 'Edit Person' : 'Add New Person'}
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <textarea
          placeholder="Bio"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
        <input
          type="text"
          placeholder="Expertise (comma-separated)"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.expertise}
          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
        />
        <input
          type="text"
          placeholder="Services (comma-separated)"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.services}
          onChange={(e) => setFormData({ ...formData, services: e.target.value })}
        />
        {currentOrg && (
          <div>
            <p className="text-blue-200 mb-2">Assign to Teams:</p>
            {currentOrg.teams.map((team: Team) => (
              <label key={team.id} className="flex items-center text-blue-100 mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.teamIds.includes(team.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, teamIds: [...formData.teamIds, team.id] });
                    } else {
                      setFormData({ ...formData, teamIds: formData.teamIds.filter(id => id !== team.id) });
                    }
                  }}
                />
                {team.name}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            const processedData = {
              ...formData,
              expertise: formData.expertise.split(',').map(e => e.trim()).filter(e => e),
              services: formData.services.split(',').map(s => s.trim()).filter(s => s)
            };
            onSave(processedData);
          }}
        >
          Save
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const TeamForm = ({ onSave, onCancel, initial }: any) => {
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    type: initial?.type || 'discipline',
    description: initial?.description || ''
  });

  return (
    <div className="bg-blue-950 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-100 mb-4">
        {initial ? 'Edit Team' : 'Add New Team'}
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Team Name"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <select
          className="w-full p-2 rounded bg-blue-900 text-blue-100"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
        >
          <option value="discipline">Discipline</option>
          <option value="project">Project</option>
          <option value="management">Management</option>
          <option value="custom">Custom</option>
        </select>
        <textarea
          placeholder="Description"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={() => onSave(formData)}>
          Save
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const OrgForm = ({ onSave, onCancel, initial }: any) => {
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    industry: initial?.industry || '',
    description: initial?.description || '',
    website: initial?.website || ''
  });

  return (
    <div className="bg-blue-950 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-100 mb-4">
        {initial ? 'Edit Organization' : 'Add New Organization'}
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Organization Name"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Industry"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="url"
          placeholder="Website"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={() => onSave(formData)}>
          Save
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProjectForm = ({ onSave, onCancel, initial }: any) => {
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    role: initial?.role || '',
    outcomes: initial?.outcomes?.join('\n') || '',
    date: initial?.date || ''
  });

  return (
    <div className="bg-blue-950 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-100 mb-4">
        {initial ? 'Edit Project' : 'Add Project'}
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Project Name"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Your Role"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        <textarea
          placeholder="Key Outcomes (one per line)"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          rows={3}
          value={formData.outcomes}
          onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
        />
        <input
          type="text"
          placeholder="Date (e.g., Jan 2024 - Present)"
          className="w-full p-2 rounded bg-blue-900 text-blue-100 placeholder-blue-400"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            const processedData = {
              ...formData,
              outcomes: formData.outcomes.split('\n').filter(o => o.trim())
            };
            onSave(processedData);
          }}
        >
          Save
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function NetworkPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'org' | 'person'>('list');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setOrganizations([
      {
        id: '1',
        name: 'TechCorp Industries',
        industry: 'Technology',
        description: 'Leading innovation in enterprise software',
        website: 'https://techcorp.com',
        teams: [
          { id: 't1', name: 'Engineering', type: 'discipline', description: 'Software development team' },
          { id: 't2', name: 'Product Design', type: 'discipline', description: 'UX/UI and product strategy' },
          { id: 't3', name: 'Project Alpha', type: 'project', description: 'Next-gen platform development' }
        ],
        people: [
          {
            id: 'p1',
            name: 'Sarah Chen',
            title: 'Senior Software Engineer',
            expertise: ['React', 'Node.js', 'Cloud Architecture'],
            email: 'sarah.chen@techcorp.com',
            phone: '+1 555-0123',
            teamIds: ['t1', 't3'],
            services: ['Technical consulting', 'Code reviews', 'Architecture design'],
            bio: 'Passionate about building scalable solutions',
            linkedIn: 'linkedin.com/in/sarahchen',
            projects: [
              {
                id: 'proj1',
                name: 'E-Commerce Platform Redesign',
                description: 'Led the frontend architecture for a complete platform overhaul',
                role: 'Lead Frontend Engineer',
                outcomes: ['Improved load times by 60%', 'Increased conversion rate by 25%'],
                date: 'Jan 2024 - Present'
              }
            ],
            endorsements: [
              {
                id: 'e1',
                skill: 'React',
                endorserId: 'p2',
                endorserName: 'Marcus Johnson',
                endorserTitle: 'Product Designer'
              }
            ]
          },
          {
            id: 'p2',
            name: 'Marcus Johnson',
            title: 'Product Designer',
            expertise: ['UI/UX', 'Figma', 'Design Systems'],
            email: 'marcus.j@techcorp.com',
            teamIds: ['t2'],
            services: ['Design consultation', 'Prototyping', 'User research'],
            bio: 'Creating delightful user experiences',
            projects: [],
            endorsements: []
          }
        ]
      }
    ]);
  }, []);

  // Add Organization
  const handleAddOrg = (orgData: any) => {
    const newOrg: Organization = {
      ...orgData,
      id: Date.now().toString(),
      teams: [],
      people: []
    };
    setOrganizations([...organizations, newOrg]);
    setShowAddOrg(false);
    setSelectedOrg(newOrg);
  };

  // Edit Organization
  const handleEditOrg = (orgData: any) => {
    if (!editingOrg) return;
    setOrganizations(orgs => orgs.map(org => 
      org.id === editingOrg.id ? { ...org, ...orgData } : org
    ));
    setSelectedOrg(prev => prev?.id === editingOrg.id ? { ...prev, ...orgData } : prev);
    setEditingOrg(null);
    setShowAddOrg(false);
  };

  // Delete Organization
  const handleDeleteOrg = (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(orgs => orgs.filter(org => org.id !== id));
      if (selectedOrg?.id === id) {
        setSelectedOrg(null);
        setMobileView('list');
      }
    }
  };

  // Add Person
  const handleAddPerson = (personData: any) => {
    if (!selectedOrg) return;
    const newPerson: Person = {
      ...personData,
      id: Date.now().toString(),
      projects: [],
      endorsements: []
    };
    setOrganizations(orgs => orgs.map(org => 
      org.id === selectedOrg.id 
        ? { ...org, people: [...org.people, newPerson] }
        : org
    ));
    setSelectedOrg(prev => prev ? { ...prev, people: [...prev.people, newPerson] } : prev);
    setShowAddPerson(false);
  };

  // Edit Person
  const handleEditPerson = (personData: any) => {
    if (!selectedOrg || !editingPerson) return;
    setOrganizations(orgs => orgs.map(org => 
      org.id === selectedOrg.id 
        ? { 
            ...org, 
            people: org.people.map(p => 
              p.id === editingPerson.id ? { ...p, ...personData } : p
            ) 
          }
        : org
    ));
    setSelectedOrg(prev => prev ? {
      ...prev,
      people: prev.people.map(p => 
        p.id === editingPerson.id ? { ...p, ...personData } : p
      )
    } : prev);
    if (selectedPerson?.id === editingPerson.id) {
      setSelectedPerson({ ...selectedPerson, ...personData });
    }
    setEditingPerson(null);
    setShowAddPerson(false);
  };

  // Delete Person
  const handleDeletePerson = (personId: string) => {
    if (!selectedOrg) return;
    if (confirm('Are you sure you want to delete this person?')) {
      setOrganizations(orgs => orgs.map(org => 
        org.id === selectedOrg.id 
          ? { ...org, people: org.people.filter(p => p.id !== personId) }
          : org
      ));
      setSelectedOrg(prev => prev ? {
        ...prev,
        people: prev.people.filter(p => p.id !== personId)
      } : prev);
      if (selectedPerson?.id === personId) {
        setSelectedPerson(null);
        setMobileView('org');
      }
    }
  };

  // Add Team
  const handleAddTeam = (teamData: any) => {
    if (!selectedOrg) return;
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString()
    };
    setOrganizations(orgs => orgs.map(org => 
      org.id === selectedOrg.id 
        ? { ...org, teams: [...org.teams, newTeam] }
        : org
    ));
    setSelectedOrg(prev => prev ? { ...prev, teams: [...prev.teams, newTeam] } : prev);
    setShowAddTeam(false);
  };

  // Edit Team
  const handleEditTeam = (teamData: any) => {
    if (!selectedOrg || !editingTeam) return;
    setOrganizations(orgs => orgs.map(org => 
      org.id === selectedOrg.id 
        ? { 
            ...org, 
            teams: org.teams.map(t => 
              t.id === editingTeam.id ? { ...t, ...teamData } : t
            ) 
          }
        : org
    ));
    setSelectedOrg(prev => prev ? {
      ...prev,
      teams: prev.teams.map(t => 
        t.id === editingTeam.id ? { ...t, ...teamData } : t
      )
    } : prev);
    setEditingTeam(null);
    setShowAddTeam(false);
  };

  // Delete Team
  const handleDeleteTeam = (teamId: string) => {
    if (!selectedOrg) return;
    if (confirm('Are you sure you want to delete this team?')) {
      setOrganizations(orgs => orgs.map(org => 
        org.id === selectedOrg.id 
          ? { 
              ...org, 
              teams: org.teams.filter(t => t.id !== teamId),
              people: org.people.map(p => ({
                ...p,
                teamIds: p.teamIds.filter(id => id !== teamId)
              }))
            }
          : org
      ));
      setSelectedOrg(prev => prev ? {
        ...prev,
        teams: prev.teams.filter(t => t.id !== teamId),
        people: prev.people.map(p => ({
          ...p,
          teamIds: p.teamIds.filter(id => id !== teamId)
        }))
      } : prev);
    }
  };

  // Add Project to Person
  const handleAddProject = (projectData: any) => {
    if (!selectedOrg || !selectedPerson) return;
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString()
    };
    const updatedPerson = {
      ...selectedPerson,
      projects: [...(selectedPerson.projects || []), newProject]
    };
    handleEditPerson(updatedPerson);
    setSelectedPerson(updatedPerson);
    setShowAddProject(false);
  };

  // Edit Project
  const handleEditProject = (projectData: any) => {
    if (!selectedOrg || !selectedPerson || !editingProject) return;
    const updatedPerson = {
      ...selectedPerson,
      projects: selectedPerson.projects?.map(p => 
        p.id === editingProject.id ? { ...p, ...projectData } : p
      ) || []
    };
    handleEditPerson(updatedPerson);
    setSelectedPerson(updatedPerson);
    setEditingProject(null);
    setShowAddProject(false);
  };

  // Delete Project
  const handleDeleteProject = (projectId: string) => {
    if (!selectedOrg || !selectedPerson) return;
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedPerson = {
        ...selectedPerson,
        projects: selectedPerson.projects?.filter(p => p.id !== projectId) || []
      };
      handleEditPerson(updatedPerson);
      setSelectedPerson(updatedPerson);
    }
  };

  // Add Endorsement
  const handleEndorseSkill = (skill: string, endorser: Person) => {
    if (!selectedOrg || !selectedPerson) return;
    const newEndorsement: Endorsement = {
      id: Date.now().toString(),
      skill,
      endorserId: endorser.id,
      endorserName: endorser.name,
      endorserTitle: endorser.title
    };
    const updatedPerson = {
      ...selectedPerson,
      endorsements: [...(selectedPerson.endorsements || []), newEndorsement]
    };
    handleEditPerson(updatedPerson);
    setSelectedPerson(updatedPerson);
  };

  // Filter people based on search
  const filteredPeople = organizations.flatMap(org => 
    org.people.filter(person => 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase())) ||
      person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (filterTag && person.expertise.includes(filterTag))
    ).map(person => ({ ...person, organization: org }))
  );

  // Get all unique expertise tags
  const allExpertiseTags = [...new Set(
    organizations.flatMap(org => org.people.flatMap(person => person.expertise))
  )];

  // Reset to initial view
  const resetToHome = () => {
    setMobileView('list');
    setSelectedOrg(null);
    setSelectedPerson(null);
  };

  // Person Card Component
  const PersonCard = ({ person, org }: { person: Person; org: Organization }) => (
    <div
      className="bg-blue-900 rounded-lg p-4 hover:bg-blue-800 transition-colors cursor-pointer"
      onClick={() => {
        setSelectedPerson(person);
        setSelectedOrg(org);
        setMobileView('person');
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {person.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-blue-100">{person.name}</h3>
            <p className="text-sm text-blue-300">{person.title}</p>
          </div>
        </div>
        <button
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle message
          }}
        >
          <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
      
      <p className="text-sm text-blue-400 mb-3">{org.name}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {person.expertise.slice(0, 3).map((exp, idx) => (
          <span key={idx} className="px-2 py-1 bg-blue-800 text-blue-200 text-xs rounded-full">
            {exp}
          </span>
        ))}
        {person.expertise.length > 3 && (
          <span className="px-2 py-1 bg-blue-950 text-blue-300 text-xs rounded-full">
            +{person.expertise.length - 3}
          </span>
        )}
      </div>
      
      {person.endorsements && person.endorsements.length > 0 && (
        <div className="text-xs text-blue-300">
          <span className="font-medium">{person.endorsements.length} endorsements</span>
        </div>
      )}
    </div>
  );

  // Person Detail View
  const PersonDetailView = () => {
    if (!selectedPerson || !selectedOrg) return null;
    
    const personTeams = selectedOrg.teams.filter(team => 
      selectedPerson.teamIds.includes(team.id)
    );

    // Group endorsements by skill
    const endorsementsBySkill = selectedPerson.endorsements?.reduce((acc, end) => {
      if (!acc[end.skill]) acc[end.skill] = [];
      acc[end.skill].push(end);
      return acc;
    }, {} as Record<string, Endorsement[]>) || {};

    return (
      <div className="bg-blue-950 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <button
          className="lg:hidden mb-4 flex items-center text-blue-300 hover:text-blue-100"
          onClick={() => setMobileView('org')}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {selectedOrg.name}
        </button>
        
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {selectedPerson.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-100">{selectedPerson.name}</h2>
              <p className="text-blue-300">{selectedPerson.title}</p>
              <p className="text-sm text-blue-400">{selectedOrg.name}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setEditingPerson(selectedPerson);
                setShowAddPerson(true);
              }}
            >
              Edit
            </button>
            <button 
              className="btn btn-error btn-sm"
              onClick={() => handleDeletePerson(selectedPerson.id)}
            >
              Delete
            </button>
          </div>
        </div>

        {selectedPerson.bio && (
          <p className="text-blue-200 mb-6">{selectedPerson.bio}</p>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Expertise & Endorsements
            </h3>
            <div className="space-y-3">
              {selectedPerson.expertise.map((exp, idx) => (
                <div key={idx} className="bg-blue-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-100">{exp}</span>
                    <span className="text-sm text-blue-400">
                      {endorsementsBySkill[exp]?.length || 0} endorsements
                    </span>
                  </div>
                  {endorsementsBySkill[exp] && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {endorsementsBySkill[exp].map(end => (
                        <div key={end.id} className="text-xs text-blue-300 bg-blue-800 rounded px-2 py-1">
                          {end.endorserName} • {end.endorserTitle}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedOrg.people.length > 1 && !endorsementsBySkill[exp]?.some(e => e.endorserId === 'current-user') && (
                    <button
                      className="mt-2 text-xs text-blue-300 hover:text-blue-100"
                      onClick={() => {
                        // In a real app, this would use the current user
                        const otherPerson = selectedOrg.people.find(p => p.id !== selectedPerson.id);
                        if (otherPerson) handleEndorseSkill(exp, otherPerson);
                      }}
                    >
                      + Endorse this skill
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {personTeams.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                Teams
              </h3>
              <div className="space-y-2">
                {personTeams.map(team => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-blue-100">{team.name}</span>
                    <span className="text-xs text-blue-400">({team.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPerson.services && selectedPerson.services.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                Services Offered
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedPerson.services.map((service, idx) => (
                  <li key={idx} className="text-blue-200">{service}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                Project Portfolio
              </h3>
              <button
                className="text-blue-300 hover:text-blue-100 text-sm"
                onClick={() => {
                  setEditingProject(null);
                  setShowAddProject(true);
                }}
              >
                + Add Project
              </button>
            </div>
            {selectedPerson.projects && selectedPerson.projects.length > 0 ? (
              <div className="space-y-3">
                {selectedPerson.projects.map(project => (
                  <div key={project.id} className="bg-blue-900 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-blue-100">{project.name}</h4>
                        <p className="text-sm text-blue-300">{project.role} • {project.date}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="text-blue-400 hover:text-blue-200 p-1"
                          onClick={() => {
                            setEditingProject(project);
                            setShowAddProject(true);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 p-1"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-blue-200 mb-2">{project.description}</p>
                    {project.outcomes && project.outcomes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-blue-400 mb-1">Key Outcomes:</p>
                        <ul className="list-disc list-inside text-sm text-blue-200">
                          {project.outcomes.map((outcome, idx) => (
                            <li key={idx}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-400 text-sm">No projects added yet.</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Contact
            </h3>
            <div className="space-y-2">
              {selectedPerson.email && (
                <a href={`mailto:${selectedPerson.email}`} className="flex items-center space-x-2 text-blue-300 hover:text-blue-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{selectedPerson.email}</span>
                </a>
              )}
              {selectedPerson.phone && (
                <a href={`tel:${selectedPerson.phone}`} className="flex items-center space-x-2 text-blue-300 hover:text-blue-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{selectedPerson.phone}</span>
                </a>
              )}
              {selectedPerson.linkedIn && (
                <a href={`https://${selectedPerson.linkedIn}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-300 hover:text-blue-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button className="flex-1 btn btn-primary flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Send Message
          </button>
          <button className="flex-1 btn btn-secondary">
            Schedule Meeting
          </button>
        </div>
      </div>
    );
  };

  // Organization View
  const OrganizationView = () => {
    if (!selectedOrg) return null;

    return (
      <div className="bg-blue-950 rounded-xl shadow-lg p-6">
        <button
          className="lg:hidden mb-4 flex items-center text-blue-300 hover:text-blue-100"
          onClick={() => setMobileView('list')}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Organizations
        </button>
        
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-blue-100 mb-2">{selectedOrg.name}</h2>
              <p className="text-blue-300">{selectedOrg.industry}</p>
              {selectedOrg.description && (
                <p className="text-blue-200 mt-2">{selectedOrg.description}</p>
              )}
              {selectedOrg.website && (
                <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 hover:text-blue-300 mt-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  {selectedOrg.website}
                </a>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditingOrg(selectedOrg);
                  setShowAddOrg(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleDeleteOrg(selectedOrg.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-100">Teams</h3>
            <button
              className="text-blue-300 hover:text-blue-100 flex items-center text-sm"
              onClick={() => setShowAddTeam(true)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Team
            </button>
          </div>
          <div className="grid gap-3">
            {selectedOrg.teams.map(team => (
              <div key={team.id} className="bg-blue-900 rounded-lg p-3 hover:bg-blue-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-100">{team.name}</h4>
                    <p className="text-sm text-blue-300 capitalize">{team.type} Team</p>
                    {team.description && (
                      <p className="text-sm text-blue-200 mt-1">{team.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-400">
                      {selectedOrg.people.filter(p => p.teamIds.includes(team.id)).length} members
                    </span>
                    <button
                      className="text-blue-400 hover:text-blue-200 p-1"
                      onClick={() => {
                        setEditingTeam(team);
                        setShowAddTeam(true);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 p-1"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-100">People</h3>
            <button
              className="text-blue-300 hover:text-blue-100 flex items-center text-sm"
              onClick={() => setShowAddPerson(true)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Person
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {selectedOrg.people.map(person => (
              <PersonCard key={person.id} person={person} org={selectedOrg} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-blue-950 border-b border-blue-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-xl font-bold text-blue-100 cursor-pointer"
              onClick={resetToHome}
            >
              Network
            </h1>
            <button
              className="lg:hidden p-2 hover:bg-blue-900 rounded-lg"
              onClick={() => setShowAddOrg(true)}
            >
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-blue-950 border-b border-blue-900 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search people, expertise, or organizations..."
                className="w-full pl-10 pr-4 py-2 bg-blue-900 border border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100 placeholder-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 bg-blue-900 border border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              <option value="">All Expertise</option>
              {allExpertiseTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Sidebar - Organizations */}
          <div className={`lg:col-span-3 ${mobileView !== 'list' ? 'hidden lg:block' : ''}`}>
            <div className="bg-blue-950 rounded-lg shadow-lg border border-blue-900">
              <div className="p-4 border-b border-blue-900 flex items-center justify-between">
                <h2 className="font-semibold text-blue-100">Organizations</h2>
                <button
                  className="text-blue-300 hover:text-blue-100"
                  onClick={() => setShowAddOrg(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="divide-y divide-blue-900">
                {organizations.map(org => (
                  <button
                    key={org.id}
                    className={`w-full text-left p-4 hover:bg-blue-900 transition-colors ${
                      selectedOrg?.id === org.id ? 'bg-blue-800 border-l-4 border-blue-600' : ''
                    }`}
                    onClick={() => {
                      setSelectedOrg(org);
                      setMobileView('org');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-blue-100">{org.name}</h3>
                        <p className="text-sm text-blue-300">{org.industry}</p>
                      </div>
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-blue-400">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {org.people.length} people · {org.teams.length} teams
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`lg:col-span-9 ${(mobileView === 'list' && !selectedOrg) ? 'hidden lg:block' : ''}`}>
            {searchQuery || filterTag ? (
              <div className="bg-blue-950 rounded-lg shadow-lg border border-blue-900 p-6">
                <h2 className="text-lg font-semibold text-blue-100 mb-4">
                  Search Results ({filteredPeople.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredPeople.map(({ organization, ...person }) => (
                    <PersonCard key={person.id} person={person} org={organization} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {mobileView === 'person' ? (
                  <PersonDetailView />
                ) : mobileView === 'org' && selectedOrg ? (
                  <OrganizationView />
                ) : !selectedOrg ? (
                  <div className="bg-blue-950 rounded-lg shadow-lg border border-blue-900 p-12 text-center">
                    <svg className="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-blue-300">Select an organization to view its people and teams</p>
                  </div>
                ) : (
                  <OrganizationView />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => { setShowAddOrg(false); setEditingOrg(null); }} />
          <div className="relative z-10">
            <OrgForm
              onSave={editingOrg ? handleEditOrg : handleAddOrg}
              onCancel={() => { setShowAddOrg(false); setEditingOrg(null); }}
              initial={editingOrg}
            />
          </div>
        </div>
      )}

      {showAddPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => { setShowAddPerson(false); setEditingPerson(null); }} />
          <div className="relative z-10">
            <PersonForm
              onSave={editingPerson ? handleEditPerson : handleAddPerson}
              onCancel={() => { setShowAddPerson(false); setEditingPerson(null); }}
              initial={editingPerson}
              currentOrg={selectedOrg}
            />
          </div>
        </div>
      )}

      {showAddTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => { setShowAddTeam(false); setEditingTeam(null); }} />
          <div className="relative z-10">
            <TeamForm
              onSave={editingTeam ? handleEditTeam : handleAddTeam}
              onCancel={() => { setShowAddTeam(false); setEditingTeam(null); }}
              initial={editingTeam}
            />
          </div>
        </div>
      )}

      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => { setShowAddProject(false); setEditingProject(null); }} />
          <div className="relative z-10">
            <ProjectForm
              onSave={editingProject ? handleEditProject : handleAddProject}
              onCancel={() => { setShowAddProject(false); setEditingProject(null); }}
              initial={editingProject}
            />
          </div>
        </div>
      )}
    </div>
  );
}