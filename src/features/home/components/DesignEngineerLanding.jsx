// src/features/home/components/DesignEngineerLanding.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { Plus, Folder, Trash2, ChevronDown, ChevronUp, Copy, Menu } from 'lucide-react';
import { BackgroundPattern } from './BackgroundPattern';

export const DesignEngineerLanding = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  // State Declarations
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedEquipmentTag, setExpandedEquipmentTag] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [newEquipmentTag, setNewEquipmentTag] = useState('');
  const [newEquipmentType, setNewEquipmentType] = useState('');
  const [isAlternate, setIsAlternate] = useState(false);
  const [baseEquipmentType, setBaseEquipmentType] = useState(null);
  const [showAddFluidFlowModal, setShowAddFluidFlowModal] = useState(false);
  const [selectedOptionIdForFluidFlow, setSelectedOptionIdForFluidFlow] = useState(null);
  const [newFluidFlowType, setNewFluidFlowType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derived state
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Constants
  const equipmentTypes = ['AHU', 'Chiller', 'Cooling Tower', 'Fluid Cooler', 'Custom Skid'];

  const commonFields = {
    AHU: [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
      { name: 'connectionSizes', label: 'Connection Sizes', type: 'text' },
      { name: 'controls', label: 'Controls', type: 'text' },
    ],
    Chiller: [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'capacity', label: 'Capacity (tons)', type: 'number' },
    ],
    'Cooling Tower': [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
    ],
    'Fluid Cooler': [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
    ],
    'Custom Skid': [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
    ],
  };

  const fluidFlowFields = {
    AHU: {
      Air: [
        { name: 'saCFM', label: 'SA CFM', type: 'number' },
        { name: 'saSP', label: 'SA Static Pressure (in. wg)', type: 'number' },
        { name: 'raCFM', label: 'RA CFM', type: 'number' },
      ],
      Water: [
        { name: 'waterType', label: 'Water Type', type: 'select', options: ['CHW', 'HHW', 'CW'] },
        { name: 'ewt', label: 'EWT (°F)', type: 'number' },
        { name: 'lwt', label: 'LWT (°F)', type: 'number' },
        { name: 'gpm', label: 'GPM', type: 'number' },
      ],
      Refrigerant: [
        { name: 'dxBTU', label: 'DX BTU/hr', type: 'number' },
        { name: 'eat', label: 'EAT (°F)', type: 'number' },
        { name: 'lat', label: 'LAT (°F)', type: 'number' },
      ],
    },
    Chiller: {
      Water: [
        { name: 'waterType', label: 'Water Type', type: 'select', options: ['CHW', 'CW'] },
        { name: 'ewt', label: 'EWT (°F)', type: 'number' },
        { name: 'lwt', label: 'LWT (°F)', type: 'number' },
      ],
      Air: [
        { name: 'cfm', label: 'CFM', type: 'number' },
      ],
      Refrigerant: [
        { name: 'capacity', label: 'Capacity (BTU/hr)', type: 'number' },
      ],
    },
    'Cooling Tower': {
      Water: [
        { name: 'flowRate', label: 'Flow Rate (GPM)', type: 'number' },
      ],
      Air: [
        { name: 'cfm', label: 'CFM', type: 'number' },
      ],
    },
    'Fluid Cooler': {
      Water: [
        { name: 'flowRate', label: 'Flow Rate (GPM)', type: 'number' },
      ],
      Air: [
        { name: 'cfm', label: 'CFM', type: 'number' },
      ],
    },
    'Custom Skid': {
      Air: [],
      Water: [],
      Refrigerant: [],
    },
  };

  const defaultFluidFlows = {
    AHU: ['Air'],
    Chiller: ['Water'],
    'Cooling Tower': ['Water', 'Air'],
    'Fluid Cooler': ['Water', 'Air'],
    'Custom Skid': [],
  };

  const allowedAdditionalFluidFlows = {
    AHU: ['Water', 'Refrigerant', 'Air'],
    Chiller: ['Water', 'Air', 'Refrigerant'],
    'Cooling Tower': [],
    'Fluid Cooler': ['Water'],
    'Custom Skid': ['Water', 'Air', 'Refrigerant'],
  };

  // Functions
  const addProject = () => {
    if (!newProjectName.trim()) {
      alert('Project name cannot be empty!');
      return;
    }
    if (projects.some(p => p.name.toLowerCase() === newProjectName.toLowerCase())) {
      alert('Project name must be unique!');
      return;
    }
    const newProject = { id: Date.now(), name: newProjectName, equipmentGroups: [] };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setShowAddProjectModal(false);
    setNewProjectName('');
  };

  const deleteProject = (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
  };

  const addEquipment = (type, isAlternate = false, baseTag = '') => {
    if (!selectedProject) {
      alert('Please select or create a project first');
      return;
    }
    if (!equipmentTypes.includes(type)) {
      alert('Please select a valid equipment type');
      return;
    }
    if (!isAlternate) {
      const tag = newEquipmentTag.trim();
      if (!tag) {
        alert('Equipment tag is required!');
        return;
      }
      if (selectedProject.equipmentGroups.some(g => g.tag === tag)) {
        alert('Equipment tag must be unique within the project!');
        return;
      }
      const finalTag = tag;
      const defaultFlows = defaultFluidFlows[type] || [];
      const fluidFlows = defaultFlows.map(flowType => ({
        id: Date.now() + Math.random(),
        type: flowType,
        fields: Object.fromEntries(fluidFlowFields[type][flowType].map(field => [field.name, ''])),
      }));
      const newEquipment = {
        id: Date.now(),
        type,
        equipmentTag: finalTag,
        commonFields: Object.fromEntries(commonFields[type].map(field => [field.name, ''])),
        fluidFlows,
      };
      setProjects(projects.map(p =>
        p.id === selectedProject.id
          ? { ...p, equipmentGroups: [...p.equipmentGroups, { tag: finalTag, options: [newEquipment] }] }
          : p
      ));
    } else {
      const tag = `${baseTag}-alt${(selectedProject.equipmentGroups.find(g => g.tag === baseTag)?.options.length || 0) + 1}`;
      const defaultFlows = defaultFluidFlows[type] || [];
      const fluidFlows = defaultFlows.map(flowType => ({
        id: Date.now() + Math.random(),
        type: flowType,
        fields: Object.fromEntries(fluidFlowFields[type][flowType].map(field => [field.name, ''])),
      }));
      const newEquipment = {
        id: Date.now(),
        type,
        equipmentTag: tag,
        commonFields: Object.fromEntries(commonFields[type].map(field => [field.name, ''])),
        fluidFlows,
      };
      setProjects(projects.map(p =>
        p.id === selectedProject.id
          ? {
              ...p,
              equipmentGroups: p.equipmentGroups.map(group =>
                group.tag === baseTag ? { ...group, options: [...group.options, newEquipment] } : group
              ),
            }
          : p
      ));
    }
    setShowEquipmentModal(false);
    setNewEquipmentTag('');
    setNewEquipmentType('');
    setIsAlternate(false);
    setBaseEquipmentType(null);
  };

  const addFluidFlow = (optionId) => {
    if (!newFluidFlowType) {
      alert('Please select a fluid type');
      return;
    }
    setProjects(projects.map(p => p.id === selectedProjectId ? {
      ...p,
      equipmentGroups: p.equipmentGroups.map(group => ({
        ...group,
        options: group.options.map(opt => opt.id === optionId ? {
          ...opt,
          fluidFlows: [
            ...opt.fluidFlows,
            {
              id: Date.now() + Math.random(),
              type: newFluidFlowType,
              fields: Object.fromEntries(
                fluidFlowFields[opt.type][newFluidFlowType].map(field => [field.name, ''])
              ),
            },
          ],
        } : opt),
      })),
    } : p));
    setShowAddFluidFlowModal(false);
    setNewFluidFlowType('');
  };

  const removeFluidFlow = (optionId, flowId) => {
    setProjects(projects.map(p => p.id === selectedProjectId ? {
      ...p,
      equipmentGroups: p.equipmentGroups.map(group => ({
        ...group,
        options: group.options.map(opt => opt.id === optionId ? {
          ...opt,
          fluidFlows: opt.fluidFlows.filter(flow => flow.id !== flowId),
        } : opt),
      })),
    } : p));
  };

  const handleCommonFieldChange = (optionId, fieldName, value) => {
    setProjects(projects.map(p => p.id === selectedProjectId ? {
      ...p,
      equipmentGroups: p.equipmentGroups.map(group => ({
        ...group,
        options: group.options.map(opt => opt.id === optionId ? {
          ...opt,
          commonFields: { ...opt.commonFields, [fieldName]: value },
        } : opt),
      })),
    } : p));
  };

  const handleFluidFlowFieldChange = (optionId, flowId, fieldName, value) => {
    setProjects(projects.map(p => p.id === selectedProjectId ? {
      ...p,
      equipmentGroups: p.equipmentGroups.map(group => ({
        ...group,
        options: group.options.map(opt => opt.id === optionId ? {
          ...opt,
          fluidFlows: opt.fluidFlows.map(flow => flow.id === flowId ? {
            ...flow,
            fields: { ...flow.fields, [fieldName]: value },
          } : flow),
        } : opt),
      })),
    } : p));
  };

  const generateSchedule = (option) => {
    const commonText = commonFields[option.type]
      .map(field => `${field.label}: ${option.commonFields[field.name] || ''}`)
      .join('\n');
    const fluidFlowsText = option.fluidFlows
      .map((flow, index) => {
        const fieldsText = fluidFlowFields[option.type][flow.type]
          .map(field => `${field.label}: ${flow.fields[field.name] || ''}`)
          .join('\n');
        return `${flow.type} Flow ${index + 1}:\n${fieldsText}`;
      })
      .join('\n\n');
    return `
EQUIPMENT SCHEDULE
----------------------------------------
Tag: ${option.equipmentTag}
Type: ${option.type}
${commonText}
----------------------------------------
Fluid Flows:
${fluidFlowsText || 'None'}
----------------------------------------
    `.trim();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Schedule copied to clipboard!');
  };

  // Render Functions
  const renderAddProjectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/20 w-full max-w-sm max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-blue-100 mb-4">Add New Project</h3>
        <input
          type="text"
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          placeholder="Enter unique project name"
          className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 mb-4 text-sm"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowAddProjectModal(false)}
            className="px-4 py-2 bg-gray-600 text-blue-100 rounded-lg hover:bg-gray-500 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={addProject}
            className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddEquipmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/20 w-full max-w-sm max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-blue-100 mb-4">
          {isAlternate ? `Add Alternate for ${newEquipmentTag}` : 'Add New Equipment'}
        </h3>
        {isAlternate ? (
          <p className="text-blue-300 mb-4 text-sm">Type: {baseEquipmentType}</p>
        ) : (
          <select
            value={newEquipmentType}
            onChange={e => setNewEquipmentType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 mb-4 text-sm"
          >
            <option value="">Select Equipment Type</option>
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        )}
        {!isAlternate && (
          <input
            type="text"
            value={newEquipmentTag}
            onChange={e => setNewEquipmentTag(e.target.value)}
            placeholder="Equipment Tag (e.g., AHU-1)"
            className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 mb-4 text-sm"
          />
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowEquipmentModal(false)}
            className="px-4 py-2 bg-gray-600 text-blue-100 rounded-lg hover:bg-gray-500 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => addEquipment(newEquipmentType, isAlternate, isAlternate ? newEquipmentTag : undefined)}
            className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddFluidFlowModal = () => {
    const option = selectedProject?.equipmentGroups
      .flatMap(g => g.options)
      .find(opt => opt.id === selectedOptionIdForFluidFlow);
    if (!option) return null;
    const allowedFlows = allowedAdditionalFluidFlows[option.type] || [];
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/20 w-full max-w-sm max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-blue-100 mb-4">Add Fluid Flow to {option.equipmentTag}</h3>
          <select
            value={newFluidFlowType}
            onChange={e => setNewFluidFlowType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 mb-4 text-sm"
          >
            <option value="">Select Fluid Type</option>
            {allowedFlows.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddFluidFlowModal(false)}
              className="px-4 py-2 bg-gray-600 text-blue-100 rounded-lg hover:bg-gray-500 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => addFluidFlow(selectedOptionIdForFluidFlow)}
              className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEquipmentSchedules = () => {
    if (!selectedProject) return null;
    return selectedProject.equipmentGroups.map(group => (
      <div key={group.tag} className="mb-6">
        <h4 className="text-lg font-semibold text-blue-100 mb-3">{group.tag} ({group.options[0].type})</h4>
        {group.options.map(option => (
          <div key={option.id} className="mb-4 p-4 bg-gray-700/50 rounded-lg">
            <h5 className="text-md font-medium text-blue-200 mb-2">{option.equipmentTag}</h5>
            {/* Common Fields */}
            <div className="grid grid-cols-1 gap-3 mb-3">
              {commonFields[option.type].map(field => (
                <div key={field.name}>
                  <label className="block text-xs text-blue-300">{field.label}</label>
                  <input
                    type={field.type}
                    value={option.commonFields[field.name] || ''}
                    onChange={e => handleCommonFieldChange(option.id, field.name, e.target.value)}
                    className="w-full px-2 py-1 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 text-sm"
                  />
                </div>
              ))}
            </div>
            {/* Fluid Flows */}
            {option.fluidFlows.map(flow => (
              <div key={flow.id} className="mb-3 p-3 bg-gray-600/50 rounded-lg">
                <h6 className="text-sm font-medium text-blue-200 mb-2">{flow.type} Flow</h6>
                <div className="grid grid-cols-1 gap-3">
                  {fluidFlowFields[option.type][flow.type].map(field => (
                    <div key={field.name}>
                      <label className="block text-xs text-blue-300">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          value={flow.fields[field.name] || ''}
                          onChange={e => handleFluidFlowFieldChange(option.id, flow.id, field.name, e.target.value)}
                          className="w-full px-2 py-1 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 text-sm"
                        >
                          <option value="">Select</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={flow.fields[field.name] || ''}
                          onChange={e => handleFluidFlowFieldChange(option.id, flow.id, field.name, e.target.value)}
                          className="w-full px-2 py-1 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => removeFluidFlow(option.id, flow.id)}
                  className="mt-2 text-red-400 hover:text-red-300 text-sm"
                >
                  Remove Flow
                </button>
              </div>
            ))}
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  setSelectedOptionIdForFluidFlow(option.id);
                  setShowAddFluidFlowModal(true);
                }}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                <Plus size={14} className="mr-1" /> Add Fluid Flow
              </button>
              <button
                onClick={() => copyToClipboard(generateSchedule(option))}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                <Copy size={14} className="mr-1" /> Copy Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 flex flex-col relative">
      <BackgroundPattern />

      {/* Modals */}
      {showAddProjectModal && renderAddProjectModal()}
      {showEquipmentModal && renderAddEquipmentModal()}
      {showAddFluidFlowModal && renderAddFluidFlowModal()}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-gray-800 rounded-full text-blue-100"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-gray-800/90 backdrop-blur-md border-r border-blue-500/20 p-4 flex-shrink-0 overflow-y-auto transform transition-transform duration-300 ease-in-out z-30 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-64`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-100 flex items-center">
            <Folder className="mr-2" size={20} /> Projects
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-blue-100">
            <Menu size={24} />
          </button>
        </div>
        <div className="space-y-2">
          {projects.map(project => (
            <div key={project.id} className="group relative">
              <button
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setExpandedProject(expandedProject === project.id ? null : project.id);
                  setExpandedEquipmentTag(null);
                  setIsSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-blue-300 hover:bg-gray-700 text-sm ${
                  selectedProjectId === project.id ? 'font-bold border-2 border-blue-500' : ''
                }`}
              >
                {project.name}
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-red-400 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              {expandedProject === project.id && (
                <div className="ml-3 mt-2 space-y-1 border-l-2 border-blue-500 pl-2">
                  {project.equipmentGroups.map(group => (
                    <div key={group.tag} className="group relative">
                      <button
                        onClick={() => setExpandedEquipmentTag(expandedEquipmentTag === group.tag ? null : group.tag)}
                        className="w-full text-left px-2 py-1 text-xs text-blue-300 hover:bg-gray-700 rounded flex items-center justify-between"
                      >
                        {group.tag}
                        {expandedEquipmentTag === group.tag ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      {expandedEquipmentTag === group.tag && (
                        <div className="ml-3 mt-1 space-y-1">
                          {group.options.map(opt => (
                            <div key={opt.id} className="text-xs text-blue-300 hover:bg-gray-700 rounded px-2 py-1">
                              {opt.equipmentTag}
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setNewEquipmentTag(group.tag);
                              setBaseEquipmentType(group.options[0].type);
                              setNewEquipmentType(group.options[0].type);
                              setIsAlternate(true);
                              setShowEquipmentModal(true);
                            }}
                            className="w-full text-left px-2 py-1 text-xs text-blue-300 hover:bg-gray-700 rounded"
                          >
                            + Add Alternate
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setIsAlternate(false);
                      setNewEquipmentTag('');
                      setNewEquipmentType('');
                      setShowEquipmentModal(true);
                    }}
                    className="w-full text-left px-2 py-1 text-xs text-blue-300 hover:bg-gray-700 rounded flex items-center"
                  >
                    <Plus size={14} className="mr-1" /> Equipment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAddProjectModal(true)}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 text-sm"
        >
          <Plus className="mr-2" size={16} /> Add Project
        </button>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:ml-64 overflow-y-auto">
        {!selectedProject ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-blue-100 mb-3">Welcome to Design Engineer Hub</h2>
            <p className="text-blue-300 mb-4 text-sm">Create a project to start managing equipment options.</p>
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="inline-flex items-center px-5 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 text-sm"
            >
              <Plus className="mr-2" size={16} /> Start New Project
            </button>
          </div>
        ) : (
          <section className="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 border border-blue-500/20">
            <h3 className="text-xl font-semibold text-blue-100 mb-4">
              Equipment Schedules - {selectedProject.name}
            </h3>
            {renderEquipmentSchedules()}
          </section>
        )}
      </main>
    </div>
  );
};

export default DesignEngineerLanding;