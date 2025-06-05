import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Building, Users, Filter, Star, Bookmark, ExternalLink } from 'lucide-react';

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  category: 'mechanical' | 'electrical' | 'plumbing' | 'construction' | 'manufacturing' | 'facilities';
  salary: {
    min: number;
    max: number;
    period: 'hourly' | 'annually';
  };
  description: string;
  requirements: string[];
  postedDate: string;
  isRemote: boolean;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  featured: boolean;
  saved: boolean;
}

interface FreelanceProject {
  id: string;
  title: string;
  client: string;
  budget: {
    min: number;
    max: number;
  };
  duration: string;
  category: 'mechanical' | 'electrical' | 'plumbing' | 'construction' | 'manufacturing' | 'facilities';
  description: string;
  skillsNeeded: string[];
  teamSize: number;
  currentTeamMembers: number;
  deadline: string;
  postedDate: string;
  featured: boolean;
  saved: boolean;
}

const JobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'freelance'>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [freelanceProjects, setFreelanceProjects] = useState<FreelanceProject[]>([]);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Mechanical Engineer - HVAC Systems',
        company: 'TechMech Solutions',
        location: 'San Francisco, CA',
        type: 'full-time',
        category: 'mechanical',
        salary: { min: 95000, max: 125000, period: 'annually' },
        description: 'Design and optimize HVAC systems for commercial buildings. Lead project teams and ensure compliance with energy efficiency standards.',
        requirements: ["Bachelor's in Mechanical Engineering", '5+ years HVAC experience', 'AutoCAD proficiency', 'PE license preferred'],
        postedDate: '2025-06-02',
        isRemote: false,
        experienceLevel: 'senior',
        featured: true,
        saved: false
      },
      {
        id: '2',
        title: 'Electrical Project Manager',
        company: 'PowerGrid Industries',
        location: 'Austin, TX',
        type: 'full-time',
        category: 'electrical',
        salary: { min: 80000, max: 110000, period: 'annually' },
        description: 'Manage electrical installation projects for industrial facilities. Coordinate with contractors and ensure project timeline adherence.',
        requirements: ['Electrical Engineering degree', 'PMP certification', '3+ years project management', 'Industrial experience'],
        postedDate: '2025-06-01',
        isRemote: true,
        experienceLevel: 'mid',
        featured: false,
        saved: true
      },
      {
        id: '3',
        title: 'Plumbing Systems Designer',
        company: 'AquaTech Engineering',
        location: 'Denver, CO',
        type: 'contract',
        category: 'plumbing',
        salary: { min: 45, max: 65, period: 'hourly' },
        description: 'Design plumbing systems for residential and commercial developments. Work with CAD software and coordinate with construction teams.',
        requirements: ['Plumbing design experience', 'Revit/AutoCAD skills', 'Knowledge of local codes', '2+ years experience'],
        postedDate: '2025-05-30',
        isRemote: false,
        experienceLevel: 'mid',
        featured: false,
        saved: false
      }
    ];

    const mockFreelanceProjects: FreelanceProject[] = [
      {
        id: '1',
        title: 'Smart Building Automation System Design',
        client: 'Metro Real Estate',
        budget: { min: 15000, max: 25000 },
        duration: '3 months',
        category: 'electrical',
        description: 'Design and implement a comprehensive building automation system for a 20-story office complex. Need expertise in IoT integration and energy management.',
        skillsNeeded: ['Building Automation', 'IoT Systems', 'Energy Management', 'Control Systems'],
        teamSize: 4,
        currentTeamMembers: 2,
        deadline: '2025-09-15',
        postedDate: '2025-06-01',
        featured: true,
        saved: false
      },
      {
        id: '2',
        title: 'Industrial HVAC Retrofit Project',
        client: 'Manufacturing Corp',
        budget: { min: 8000, max: 12000 },
        duration: '6 weeks',
        category: 'mechanical',
        description: 'Retrofit existing HVAC system in manufacturing facility to improve energy efficiency and air quality. Looking for mechanical engineers and technicians.',
        skillsNeeded: ['HVAC Design', 'Energy Efficiency', 'Industrial Systems', 'Project Management'],
        teamSize: 3,
        currentTeamMembers: 1,
        deadline: '2025-08-01',
        postedDate: '2025-05-28',
        featured: false,
        saved: true
      }
    ];

    setJobs(mockJobs);
    setFreelanceProjects(mockFreelanceProjects);
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'electrical', label: 'Electrical Engineering' },
    { value: 'plumbing', label: 'Plumbing Systems' },
    { value: 'construction', label: 'Construction' },
    { value: 'manufacturing', label: 'Equipment Manufacturing' },
    { value: 'facilities', label: 'Facilities Engineering' }
  ];

  const jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesType;
  });

  const filteredProjects = freelanceProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const toggleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const toggleSaveProject = (projectId: string) => {
    setFreelanceProjects(freelanceProjects.map(project => 
      project.id === projectId ? { ...project, saved: !project.saved } : project
    ));
  };

  const formatSalary = (salary: Job['salary']) => {
    const { min, max, period } = salary;
    const formatNum = (num: number) => period === 'annually' ? `$${(num / 1000).toFixed(0)}k` : `$${num}`;
    return `${formatNum(min)} - ${formatNum(max)} ${period === 'annually' ? '/year' : '/hour'}`;
  };

  const formatBudget = (budget: FreelanceProject['budget']) => {
    return `$${(budget.min / 1000).toFixed(0)}k - $${(budget.max / 1000).toFixed(0)}k`;
  };

  const daysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-dark-primary text-blue-100">
      {/* Header */}
      <div className="bg-blue-950 border-b border-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-blue-100 mb-2">MEP Engineering Jobs</h1>
            <p className="text-blue-300">Find opportunities in Mechanical, Electrical, and Plumbing engineering</p>
          </div>
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-blue-900">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'jobs'
                  ? 'border-bernoullia-500 text-bernoullia-400'
                  : 'border-transparent text-blue-300 hover:text-blue-100 hover:border-blue-400'
              }`}
            >
              Job Listings ({filteredJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('freelance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'freelance'
                  ? 'border-bernoullia-500 text-bernoullia-400'
                  : 'border-transparent text-blue-300 hover:text-blue-100 hover:border-blue-400'
              }`}
            >
              Freelance Projects ({filteredProjects.length})
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bernoullia-card p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'jobs' ? 'jobs' : 'projects'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-blue-900 text-blue-100 border border-blue-800 rounded-lg focus:ring-2 focus:ring-bernoullia-500 focus:border-bernoullia-500 placeholder-blue-400"
              />
            </div>
            {/* Location Filter (Jobs only) */}
            {activeTab === 'jobs' && (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full sm:w-48 pl-10 pr-4 py-2 bg-blue-900 text-blue-100 border border-blue-800 rounded-lg focus:ring-2 focus:ring-bernoullia-500 focus:border-bernoullia-500 placeholder-blue-400"
                />
              </div>
            )}
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-blue-900 text-blue-100 border border-blue-800 rounded-lg focus:ring-2 focus:ring-bernoullia-500 focus:border-bernoullia-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className="bg-blue-900 text-blue-100">
                  {category.label}
                </option>
              ))}
            </select>
            {/* Job Type Filter (Jobs only) */}
            {activeTab === 'jobs' && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-blue-900 text-blue-100 border border-blue-800 rounded-lg focus:ring-2 focus:ring-bernoullia-500 focus:border-bernoullia-500"
              >
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-blue-900 text-blue-100">
                    {type.label}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-blue-800 rounded-lg hover:bg-blue-900 flex items-center gap-2 text-blue-300"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bernoullia-card">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-blue-100">{job.title}</h3>
                        {job.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100/10 text-yellow-300 text-xs font-medium rounded-full">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-blue-300 mb-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                          {job.isRemote && <span className="text-green-400 ml-1">(Remote OK)</span>}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {daysAgo(job.postedDate)}
                        </span>
                      </div>
                      <p className="text-blue-200 mb-4 text-sm line-clamp-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-900/60 text-blue-200 text-xs rounded-full">
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-3 py-1 bg-blue-900/60 text-blue-200 text-xs rounded-full">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-end gap-2 md:ml-6">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-full ${job.saved ? 'text-bernoullia-400 bg-blue-900' : 'text-blue-300 hover:text-blue-100 hover:bg-blue-900'}`}
                        aria-label={job.saved ? 'Unsave job' : 'Save job'}
                      >
                        <Bookmark className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
                      </button>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-100 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatSalary(job.salary)}
                        </div>
                        <div className="text-xs text-blue-300 capitalize">
                          {job.type.replace('-', ' ')} • {job.experienceLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-blue-900 gap-3">
                    <span className="inline-flex items-center px-3 py-1 bg-bernoullia-500/10 text-bernoullia-400 text-xs font-medium rounded-full capitalize">
                      {job.category.replace('-', ' ')}
                    </span>
                    <button className="bernoullia-button flex items-center gap-2 w-full sm:w-auto justify-center">
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Freelance Projects Tab */}
        {activeTab === 'freelance' && (
          <div className="space-y-4">
            {filteredProjects.map(project => (
              <div key={project.id} className="bernoullia-card">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-blue-100">{project.title}</h3>
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100/10 text-yellow-300 text-xs font-medium rounded-full">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-blue-300 mb-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {project.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Team: {project.currentTeamMembers}/{project.teamSize}
                        </span>
                      </div>
                      <p className="text-blue-200 mb-4 text-sm line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skillsNeeded.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-green-900/60 text-green-300 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-blue-300">
                        <span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()} •
                        <span className="font-medium ml-2">Posted:</span> {daysAgo(project.postedDate)}
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-end gap-2 md:ml-6">
                      <button
                        onClick={() => toggleSaveProject(project.id)}
                        className={`p-2 rounded-full ${project.saved ? 'text-bernoullia-400 bg-blue-900' : 'text-blue-300 hover:text-blue-100 hover:bg-blue-900'}`}
                        aria-label={project.saved ? 'Unsave project' : 'Save project'}
                      >
                        <Bookmark className={`w-5 h-5 ${project.saved ? 'fill-current' : ''}`} />
                      </button>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-100 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatBudget(project.budget)}
                        </div>
                        <div className="text-xs text-blue-300">Project Budget</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-blue-900 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-purple-900/40 text-purple-300 text-xs font-medium rounded-full capitalize">
                        {project.category.replace('-', ' ')}
                      </span>
                      {project.currentTeamMembers < project.teamSize && (
                        <span className="inline-flex items-center px-3 py-1 bg-orange-900/40 text-orange-300 text-xs font-medium rounded-full">
                          Hiring {project.teamSize - project.currentTeamMembers} more
                        </span>
                      )}
                    </div>
                    <button className="bernoullia-button flex items-center gap-2 w-full sm:w-auto justify-center bg-green-600 hover:bg-green-500">
                      Join Team
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* No Results */}
        {((activeTab === 'jobs' && filteredJobs.length === 0) || 
          (activeTab === 'freelance' && filteredProjects.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-blue-900 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-blue-100 mb-2">No results found</h3>
            <p className="text-blue-300">
              Try adjusting your search criteria or filters to find more {activeTab}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
