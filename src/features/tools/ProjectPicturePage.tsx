// ProjectPicturePage.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  Users, 
  Download, 
  Trash2, 
  X, 
  Plus,
  Building2,
  Calendar,
  MapPin,
  Share2,
  Mail,
  Check,
  FolderOpen,
  Image,
  Grid3X3,
  ChevronRight
} from 'lucide-react';

interface Photo {
  id: string;
  file: File;
  url: string;
  uploadedBy: string;
  timestamp: Date;
  location?: string;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
}

interface Project {
  id: string;
  name: string;
  address?: string;
  photos: Photo[];
  coverPhoto?: string;
  createdAt: Date;
  lastUpdated: Date;
  members: ProjectMember[];
  status: 'active' | 'completed' | 'planning';
}

const ProjectPicturePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'bernaldia',
      name: 'Bernaldia Mixed-Use',
      address: '450 Bryant St, San Francisco, CA',
      photos: [],
      createdAt: new Date('2024-01-15'),
      lastUpdated: new Date(),
      members: [
        { id: '1', name: 'John Smith', email: 'john@construction.com', role: 'owner' }
      ],
      status: 'active'
    },
    {
      id: 'ucsf-tower2',
      name: 'UCSF Hospital Tower 2',
      address: '505 Parnassus Ave, San Francisco, CA',
      photos: [],
      createdAt: new Date('2024-02-20'),
      lastUpdated: new Date(),
      members: [
        { id: '1', name: 'John Smith', email: 'john@construction.com', role: 'owner' }
      ],
      status: 'active'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [shareEmail, setShareEmail] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!selectedProject) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [selectedProject]);

  const handleFiles = (files: File[]) => {
    if (!selectedProject) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newPhotos: Photo[] = imageFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
      uploadedBy: 'Current User',
      timestamp: new Date(),
      location: selectedProject.address
    }));

    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === selectedProject.id
          ? {
              ...project,
              photos: [...project.photos, ...newPhotos],
              lastUpdated: new Date(),
              coverPhoto: project.coverPhoto || newPhotos[0]?.url
            }
          : project
      )
    );

    // Update the selected project reference
    setSelectedProject(prev => 
      prev ? { ...prev, photos: [...prev.photos, ...newPhotos] } : null
    );
  };

  const createNewProject = () => {
    const projectName = prompt('Project Name:');
    if (!projectName) return;

    const projectAddress = prompt('Project Address (optional):');
    
    const newProject: Project = {
      id: projectName.toLowerCase().replace(/\s+/g, '-'),
      name: projectName,
      address: projectAddress || undefined,
      photos: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
      members: [
        { id: '1', name: 'Current User', email: 'user@construction.com', role: 'owner' }
      ],
      status: 'active'
    };

    setProjects([...projects, newProject]);
  };

  const shareProject = () => {
    if (!selectedProject || !shareEmail) return;

    // Add member to project
    const newMember: ProjectMember = {
      id: Date.now().toString(),
      name: shareEmail.split('@')[0],
      email: shareEmail,
      role: 'editor'
    };

    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === selectedProject.id
          ? { ...project, members: [...project.members, newMember] }
          : project
      )
    );

    setSelectedProject(prev =>
      prev ? { ...prev, members: [...prev.members, newMember] } : null
    );

    setShareEmail('');
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 3000);
  };

  const deleteSelectedPhotos = () => {
    if (!selectedProject) return;

    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === selectedProject.id
          ? {
              ...project,
              photos: project.photos.filter(photo => !selectedPhotos.has(photo.id))
            }
          : project
      )
    );

    setSelectedProject(prev =>
      prev ? { ...prev, photos: prev.photos.filter(photo => !selectedPhotos.has(photo.id)) } : null
    );

    setSelectedPhotos(new Set());
  };

  const downloadSelectedPhotos = async () => {
    if (!selectedProject) return;

    const photosToDownload = selectedProject.photos.filter(photo => 
      selectedPhotos.has(photo.id)
    );
    
    for (const photo of photosToDownload) {
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = `${selectedProject.name}-${photo.file.name}`;
      link.click();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1833]"> {/* dark blue background */}
      {/* Header */}
      <header className="bg-[#12244a] border-b border-[#1e335c] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-16 py-2 sm:py-0 gap-2 sm:gap-0">
            <div className="flex items-center w-full sm:w-auto">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400 mr-2 sm:mr-3" />
              <h1 className="text-lg sm:text-xl font-bold text-white">Project Photos</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-2 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#1e335c] bg-[#162a4d] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-56 placeholder:text-blue-200"
                />
              </div>
              <button
                onClick={createNewProject}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 w-full sm:w-auto shadow-md shadow-blue-900/10"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden xs:inline">New Project</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Project Grid */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-[#162a4d] rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border border-[#22386a]"
            >
              <div className="h-32 xs:h-36 sm:h-40 bg-[#1e335c] relative">
                {project.coverPhoto ? (
                  <img
                    src={project.coverPhoto}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-blue-200" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs sm:text-sm">
                  {project.photos.length} photos
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-white mb-1 text-base sm:text-lg">{project.name}</h3>
                {project.address && (
                  <div className="flex items-center text-xs sm:text-sm text-blue-200 mb-1 sm:mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{project.address}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs sm:text-sm text-blue-200">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(project.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{project.members.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-[#162a4d] rounded-xl w-full max-w-lg xs:max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-6xl max-h-[95vh] flex flex-col overflow-hidden border border-[#22386a] shadow-2xl shadow-black/30">
            {/* Modal Header */}
            <div className="bg-[#12244a] border-b border-[#22386a] px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedProject.name}</h2>
                  {selectedProject.address && (
                    <p className="text-blue-200 mt-1 text-sm sm:text-base">{selectedProject.address}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setSelectedPhotos(new Set());
                  }}
                  className="p-2 hover:bg-[#22386a] rounded-lg self-end sm:self-auto"
                >
                  <X className="w-6 h-6 text-blue-200" />
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-[#162a4d] border-b border-[#22386a] px-4 sm:px-6 py-2 sm:py-3">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 xs:gap-4">
                <div className="flex flex-row flex-wrap items-center gap-2 xs:gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm shadow shadow-blue-900/10"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
                  </button>
                  {selectedPhotos.size > 0 && (
                    <>
                      <button
                        onClick={downloadSelectedPhotos}
                        className="px-3 py-2 border border-blue-900 text-blue-200 rounded-lg hover:bg-[#22386a] flex items-center space-x-2 text-sm"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download ({selectedPhotos.size})</span>
                      </button>
                      <button
                        onClick={deleteSelectedPhotos}
                        className="px-3 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-900/20 flex items-center space-x-2 text-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete ({selectedPhotos.size})</span>
                      </button>
                    </>
                  )}
                </div>
                {/* Share Section */}
                <div className="flex flex-row flex-wrap items-center gap-2 xs:gap-3">
                  <div className="flex -space-x-2">
                    {selectedProject.members.slice(0, 3).map((member, i) => (
                      <div
                        key={member.id}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-medium border-2 border-[#162a4d]"
                        title={member.name}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {selectedProject.members.length > 3 && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-900 text-blue-200 flex items-center justify-center text-xs sm:text-sm font-medium border-2 border-[#162a4d]">
                        +{selectedProject.members.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center w-32 xs:w-auto">
                    <input
                      type="email"
                      placeholder="Share via email..."
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && shareProject()}
                      className="px-2 py-2 border border-[#22386a] bg-[#12244a] text-white rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm w-full xs:w-auto placeholder:text-blue-200"
                    />
                    <button
                      onClick={shareProject}
                      className="bg-[#22386a] px-2 py-2 border border-l-0 border-[#22386a] rounded-r-lg hover:bg-blue-700"
                    >
                      <Share2 className="w-5 h-5 text-blue-200" />
                    </button>
                  </div>
                  {showShareSuccess && (
                    <div className="flex items-center text-green-400">
                      <Check className="w-5 h-5 mr-1" />
                      <span className="text-xs sm:text-sm">Shared!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Grid */}
            <div
              className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#162a4d]"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedProject.photos.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg h-48 sm:h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-900/10' : 'border-[#22386a] hover:border-blue-400 bg-[#12244a]'
                  }`}
                >
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-200 mb-3" />
                  <p className="text-blue-100 font-medium text-sm sm:text-base">Drop photos here or click to upload</p>
                  <p className="text-blue-300 text-xs sm:text-sm mt-1">Support for JPG, PNG, HEIC files</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
                  {selectedProject.photos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        if (selectedPhotos.has(photo.id)) {
                          setSelectedPhotos(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(photo.id);
                            return newSet;
                          });
                        } else {
                          setSelectedPhotos(prev => new Set(prev).add(photo.id));
                        }
                      }}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                        selectedPhotos.has(photo.id) ? 'ring-4 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.file.name}
                        className="w-full h-28 xs:h-32 sm:h-40 object-cover bg-[#22386a]"
                      />
                      <div className={`absolute inset-0 transition-opacity ${
                        selectedPhotos.has(photo.id)
                          ? 'bg-blue-500 bg-opacity-20'
                          : 'bg-black bg-opacity-0 group-hover:bg-opacity-20'
                      }`}>
                        {selectedPhotos.has(photo.id) && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-[10px] sm:text-xs truncate">{photo.file.name}</p>
                      </div>
                    </div>
                  ))}
                  {/* Add more photos button */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#22386a] rounded-lg h-28 xs:h-32 sm:h-40 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-[#12244a]"
                  >
                    <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-blue-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPicturePage;