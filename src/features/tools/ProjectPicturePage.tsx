// ProjectPicturePage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Grid, 
  List, 
  Calendar, 
  User, 
  Tag, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  FileImage,
  Folder,
  Plus,
  Settings
} from 'lucide-react';

// Types
interface ProjectPhoto {
  id: string;
  filename: string;
  url: string;
  thumbnail: string;
  uploadedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  uploadedAt: string;
  takenAt?: string;
  category: 'progress' | 'equipment' | 'safety' | 'quality' | 'documentation' | 'other';
  tags: string[];
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  metadata: {
    size: number;
    dimensions: {
      width: number;
      height: number;
    };
    device?: string;
  };
}

interface PhotoFolder {
  id: string;
  name: string;
  description?: string;
  photoCount: number;
  lastUpdated: string;
  color: string;
}

const ProjectPicturePage: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [folders, setFolders] = useState<PhotoFolder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState<ProjectPhoto[]>(photos);
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // TODO: Replace with real data fetching
    setPhotos([
      {
        id: '1',
        filename: 'photo1.jpg',
        url: 'https://via.placeholder.com/800x600.png?text=Photo+1',
        thumbnail: 'https://via.placeholder.com/150x100.png?text=Photo+1',
        uploadedBy: { id: 'u1', name: 'Alice', avatar: 'https://via.placeholder.com/50x50.png?text=Alice' },
        uploadedAt: '2023-10-01T10:00:00Z',
        takenAt: '2023-09-30T15:00:00Z',
        category: 'progress',
        tags: ['construction', 'site'],
        description: 'Photo 1 description',
        location: { lat: 37.7749, lng: -122.4194, address: '1 Infinite Loop, Cupertino, CA' },
        metadata: { size: 2048, dimensions: { width: 800, height: 600 }, device: 'iPhone 12' }
      },
      // Add more photos as needed
    ]);
    setFilteredPhotos(photos);

    setFolders([
      { id: 'f1', name: 'Progress', description: 'Photos showing project progress', photoCount: 10, lastUpdated: '2023-10-01T12:00:00Z', color: 'blue' },
      // Add more folders as needed
    ]);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter(photo => photo.filename.toLowerCase().includes(term.toLowerCase())));
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: ProjectPhoto[] = Array.from(files).map(file => ({
        id: file.name,
        filename: file.name,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        uploadedBy: { id: 'u1', name: 'Alice' },
        uploadedAt: new Date().toISOString(),
        takenAt: new Date().toISOString(),
        category: 'progress',
        tags: [],
        description: '',
        location: { lat: 0, lng: 0 },
        metadata: { size: file.size, dimensions: { width: 800, height: 600 }, device: '' }
      }));
      setPhotos([...photos, ...newPhotos]);
      setFilteredPhotos([...photos, ...newPhotos]);
    }
  };

  const handleDelete = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
    setFilteredPhotos(filteredPhotos.filter(photo => photo.id !== id));
  };

  const handleOpenModal = (photo: ProjectPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Project Picture Tool</h1>
          <div className="flex items-center">
            <button 
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')} 
              className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-all mr-2"
              aria-label={`Switch to ${view === 'grid' ? 'list' : 'grid'} view`}
            >
              {view === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-all mr-2"
              aria-label="Upload new photos"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              className="hidden"
              multiple
            />
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="p-2 rounded-md bg-green-600 hover:bg-green-500 transition-all"
              aria-label="Open upload folder"
            >
              <Folder className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="mb-4">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => handleSearch(e.target.value)} 
            placeholder="Search photos by filename..." 
            className="w-full p-3 rounded-md bg-gray-800 text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {filteredPhotos.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10">
              <p className="text-blue-300">No photos found. Try uploading some photos or adjust your search criteria.</p>
            </div>
          ) : (
            filteredPhotos.map(photo => (
              <div key={photo.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg cursor-pointer">
                <img 
                  src={photo.thumbnail} 
                  alt={photo.filename} 
                  className="w-full h-32 object-cover"
                  onClick={() => handleOpenModal(photo)}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{photo.filename}</h3>
                  <p className="text-blue-300 text-sm mb-2">{photo.description}</p>
                  <div className="flex items-center justify-between text-xs text-blue-400">
                    <span>{new Date(photo.uploadedAt).toLocaleString()}</span>
                    <div className="flex items-center">
                      <span className="mr-2">{photo.tags.join(', ')}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }} 
                        className="p-1 rounded-md bg-red-600 hover:bg-red-500 transition-all"
                        aria-label="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="text-center text-blue-300 text-sm mt-4">
          <p>&copy; 2023 Project Picture Tool. All rights reserved.</p>
        </footer>
      </div>

      {isModalOpen && selectedPhoto && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-75" onClick={handleCloseModal}></div>
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg max-w-lg w-full z-10">
            <div className="relative">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.filename} 
                className="w-full h-auto"
              />
              <button 
                onClick={handleCloseModal} 
                className="absolute top-2 right-2 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-all"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{selectedPhoto.filename}</h3>
              <p className="text-blue-300 text-sm mb-2">{selectedPhoto.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPhoto.tags.map(tag => (
                  <span key={tag} className="text-xs rounded-full bg-blue-600 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-blue-400 mb-4">
                <span>{new Date(selectedPhoto.uploadedAt).toLocaleString()}</span>
                <span>{`Size: ${(selectedPhoto.metadata.size / 1024).toFixed(2)} KB`}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {}} // TODO: Implement download
                  className="flex-1 p-2 rounded-md bg-green-600 hover:bg-green-500 transition-all"
                  aria-label="Download photo"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button 
                  onClick={() => {}} // TODO: Implement share
                  className="flex-1 p-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-all"
                  aria-label="Share photo"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPicturePage;
