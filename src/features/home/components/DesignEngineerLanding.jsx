// src/features/home/components/DesignEngineerLanding.jsx
import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { 
  Wrench, 
  Calculator, 
  Copy, 
  Plus, 
  Folder, 
  ArrowRight, 
  Trash2, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { BackgroundPattern } from './BackgroundPattern';
import { UserDropdown } from './UserDropdown';

export const DesignEngineerLanding = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  // State
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Equipment types
  const equipmentTypes = [
    'AHU', 'Chiller', 'Cooling Tower', 'Skid', 'Custom Equipment'
  ];

  // Equipment type-specific fields
  const equipmentFields = {
    AHU: [
      { name: 'name', label: 'Equipment Name', type: 'text', required: true },
      { name: 'type', label: 'AHU Type', type: 'select', options: ['DX', 'CHW/HHW', 'Evap', 'Gas'], required: true },
      { name: 'capacity', label: 'Cooling Capacity (Tons)', type: 'number' },
      { name: 'power', label: 'Power Input (kW)', type: 'number' },
      { name: 'cost', label: 'Initial Cost ($)', type: 'number' },
      { name: 'efficiency', label: 'Efficiency (EER)', type: 'number' },
    ],
    Chiller: [
      { name: 'name', label: 'Equipment Name', type: 'text', required: true },
      { name: 'capacity', label: 'Cooling Capacity (Tons)', type: 'number' },
      { name: 'power', label: 'Power Input (kW)', type: 'number' },
      { name: 'cost', label: 'Initial Cost ($)', type: 'number' },
      { name: 'cop', label: 'COP', type: 'number' },
      { name: 'waterFlow', label: 'Water Flow (GPM)', type: 'number' },
    ],
    'Cooling Tower': [
      { name: 'name', label: 'Equipment Name', type: 'text', required: true },
      { name: 'capacity', label: 'Cooling Capacity (Tons)', type: 'number' },
      { name: 'power', label: 'Fan Power (kW)', type: 'number' },
      { name: 'cost', label: 'Initial Cost ($)', type: 'number' },
      { name: 'waterFlow', label: 'Water Flow (GPM)', type: 'number' },
      { name: 'approach', label: 'Approach (°F)', type: 'number' },
    ],
    Skid: [
      { name: 'name', label: 'Equipment Name', type: 'text', required: true },
      { name: 'capacity', label: 'Capacity (Tons)', type: 'number' },
      { name: 'power', label: 'Power Input (kW)', type: 'number' },
      { name: 'cost', label: 'Initial Cost ($)', type: 'number' },
    ],
    'Custom Equipment': [
      { name: 'name', label: 'Equipment Name', type: 'text', required: true },
      { name: 'capacity', label: 'Capacity (Units)', type: 'number' },
      { name: 'power', label: 'Power Input (kW)', type: 'number' },
      { name: 'cost', label: 'Initial Cost ($)', type: 'number' },
    ],
  };

  // Add new project
  const addProject = () => {
    const projectName = prompt('Enter a unique project name:');
    if (!projectName) return;
    if (projects.some(p => p.name.toLowerCase() === projectName.toLowerCase())) {
      alert('Project name must be unique!');
      return;
    }
    const newProject = { id: Date.now(), name: projectName, equipment: [] };
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
    setEquipmentOptions([]);
  };

  // Delete project
  const deleteProject = (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
      setEquipmentOptions([]);
    }
  };

  // Add equipment to selected project
  const addEquipment = (type) => {
    if (!selectedProject) {
      alert('Please select or create a project first');
      return;
    }
    const newEquipment = { id: Date.now(), type, ...Object.fromEntries(
      equipmentFields[type].map(field => [field.name, ''])
    ) };
    const updatedEquipment = [...selectedProject.equipment, newEquipment];
    setProjects(prev =>
      prev.map(p => p.id === selectedProject.id ? { ...p, equipment: updatedEquipment } : p)
    );
    setEquipmentOptions(updatedEquipment);
  };

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    const updatedOptions = equipmentOptions.map(option =>
      option.id === id ? { ...option, [field]: value } : option
    );
    setEquipmentOptions(updatedOptions);
    setProjects(prev =>
      prev.map(p =>
        p.id === selectedProject.id ? { ...p, equipment: updatedOptions } : p
      )
    );
  };

  // Delete equipment
  const deleteEquipment = (id) => {
    const updatedOptions = equipmentOptions.filter(option => option.id !== id);
    setEquipmentOptions(updatedOptions);
    setProjects(prev =>
      prev.map(p =>
        p.id === selectedProject.id ? { ...p, equipment: updatedOptions } : p
      )
    );
    if (selectedOption?.id === id) setSelectedOption(null);
  };

  // Calculate metrics
  const calculateMetrics = (options) => {
    return options.map(option => {
      const capacity = parseFloat(option.capacity) || 0;
      const power = parseFloat(option.power) || 0;
      const cost = parseFloat(option.cost) || 0;
      return {
        ...option,
        costPerTon: capacity > 0 ? (cost / capacity).toFixed(2) : 'N/A',
        powerPerTon: capacity > 0 ? (power / capacity).toFixed(2) : 'N/A',
        operatingCost: power * 0.12 * 8760, // $0.12/kWh, 8760 hours/year
      };
    });
  };

  const metrics = calculateMetrics(equipmentOptions);

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/50 backdrop-blur-md border-r border-blue-500/20 p-6 flex-shrink-0 overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-100 mb-6 flex items-center">
          <Folder className="mr-2" /> Projects
        </h2>
        <div className="space-y-2">
          {projects.map(project => (
            <div key={project.id}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setEquipmentOptions(project.equipment);
                    setExpandedProject(expandedProject === project.id ? null : project.id);
                  }}
                  className={`flex-1 text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedProject?.id === project.id ? 'bg-blue-600 text-blue-100' : 'text-blue-300 hover:bg-gray-700'
                  }`}
                >
                  {project.name}
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1 ml-2 text-red-400 hover:bg-red-500/20 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {expandedProject === project.id && (
                <div className="ml-4 mt-2 space-y-1">
                  {equipmentTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => addEquipment(type)}
                      className="w-full text-left px-3 py-1 text-sm text-blue-300 hover:bg-gray-700 rounded"
                    >
                      + {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addProject}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <Plus className="mr-2" size={16} /> Add Project
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-500/20">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-100">BERNOULLIA</h1>
            {isAuthenticated ? <UserDropdown /> : (
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/login')} className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors">
                  Sign In
                </button>
                <button onClick={() => navigate('/register')} className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors">
                  Join Community
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">
          {!selectedProject ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-blue-100 mb-4">
                Welcome to Design Engineer Hub
              </h2>
              <p className="text-blue-300 mb-6">
                Create a project to start comparing equipment options for your MEP designs.
              </p>
              <button
                onClick={addProject}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Plus className="mr-2" /> Start New Project
              </button>
            </div>
          ) : (
            <section className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue...
              rounded-xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-semibold text-blue-100 mb-6 flex items-center">
                <Calculator className="mr-2" /> {selectedProject.name} - Equipment Comparison
              </h3>

              {/* Equipment Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {equipmentOptions.map(option => (
                  <div key={option.id} className="space-y-4 p-4 bg-gray-700/50 rounded-lg relative">
                    <button
                      onClick={() => deleteEquipment(option.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500/20 rounded-full text-red-400 hover:bg-red-500/40"
                    >
                      <Trash2 size={16} />
                    </button>
                    {equipmentFields[option.type].map(field => (
                      <div key={field.name}>
                        {field.type === 'select' ? (
                          <select
                            value={option[field.name] || ''}
                            onChange={e => handleInputChange(option.id, field.name, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="" disabled>{field.label}</option>
                            {field.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.label}
                            value={option[field.name] || ''}
                            onChange={e => handleInputChange(option.id, field.name, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Excel-Style Editable Schedule Table */}
              {equipmentOptions.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-blue-100 mb-4">Equipment Schedule</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-blue-100 border-collapse">
                      <thead className="bg-gray-700">
                        <tr>
                          {['Type', ...equipmentFields[equipmentOptions[0].type].map(f => f.label), 'Cost/Ton', 'Power/Ton', 'Annual Cost', 'Actions'].map((header, idx) => (
                            <th key={idx} className="p-4 border border-blue-500/20">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.map(option => (
                          <tr key={option.id} className="border-b border-blue-500/20 hover:bg-gray-700/50">
                            <td className="p-4 border border-blue-500/20">{option.type}</td>
                            {equipmentFields[option.type].map(field => (
                              <td key={field.name} className="p-4 border border-blue-500/20">
                                <input
                                  type={field.type === 'number' ? 'number' : 'text'}
                                  value={option[field.name] || ''}
                                  onChange={e => handleInputChange(option.id, field.name, e.target.value)}
                                  className="w-full bg-transparent border-none text-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                />
                              </td>
                            ))}
                            <td className="p-4 border border-blue-500/20">{option.costPerTon}</td>
                            <td className="p-4 border border-blue-500/20">{option.powerPerTon}</td>
                            <td className="p-4 border border-blue-500/20">${option.operatingCost.toFixed(2)}</td>
                            <td className="p-4 border border-blue-500/20">
                              <button
                                onClick={() => copyToClipboard(generateSchedule(option))}
                                className="text-blue-400 hover:text-blue-300 flex items-center"
                              >
                                <Copy size={16} className="mr-1" /> Copy
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>

        <footer className="bg-gray-900/80 border-t border-blue-500/20 py-4 text-center text-blue-300">
          © 2025 Bernoullia. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

// Generate equipment schedule (for clipboard)
const generateSchedule = (option) => {
  const fields = Object.entries(option).filter(([key]) => key !== 'id' && key !== 'type');
  return `
EQUIPMENT SCHEDULE
----------------------------------------
Equipment Type: ${option.type}
${fields.map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join('\n')}
----------------------------------------
  `.trim();
};

export default DesignEngineerLanding;