// src/features/home/components/DesignEngineerLanding.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { Plus, Folder, Trash2, ChevronDown, ChevronUp, Copy, Menu, Edit } from 'lucide-react';
import { BackgroundPattern } from './BackgroundPattern';

export const DesignEngineerLanding = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  // **State Declarations**
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
  const [alternateForTag, setAlternateForTag] = useState('');
  const [baseEquipmentType, setBaseEquipmentType] = useState(null);
  const [showAddFluidFlowModal, setShowAddFluidFlowModal] = useState(false);
  const [selectedOptionIdForFluidFlow, setSelectedOptionIdForFluidFlow] = useState(null);
  const [newFluidFlowType, setNewFluidFlowType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectDetailsExpanded, setIsProjectDetailsExpanded] = useState(true);

  // **Derived State**
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // **Constants**
  const equipmentTypes = ['AHU', 'Chiller', 'Cooling Tower', 'Fluid Cooler', 'Custom Skid'];

  const commonFields = {
    AHU: [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'voltage/phase', label: 'Voltage/Phase (V/Ph)', type: 'text' },
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
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'voltage/phase', label: 'Voltage/Phase (V/Ph)', type: 'text' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
      { name: 'connectionSizes', label: 'Connection Sizes', type: 'text' },
      { name: 'controls', label: 'Controls', type: 'text' },
    ],
    'Cooling Tower': [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'material', label: 'Material', type: 'text' },
      { name: 'capacity', label: 'Capacity (tons)', type: 'number' },
      { name: 'wB', label: 'WB (°F)', type: 'number' },
      { name: 'EWT', label: 'EWT (°F)', type: 'number' },
      { name: 'LWT', label: 'LWT (°F)', type: 'number' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'number of fans', label: 'Number of Fans', type: 'number' },
      { name: 'fan HP', label: 'Fan HP', type: 'number' },
      { name: 'voltage/phase', label: 'Voltage/Phase (V/Ph)', type: 'text' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
      { name: 'connectionSizes', label: 'Connection Sizes', type: 'text' },
      { name: 'controls', label: 'Controls', type: 'text' },
      { name: 'water treatment', label: 'Water Treatment', type: 'text' },
    ],
    'Fluid Cooler': [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'material', label: 'Material', type: 'text' },
      { name: 'capacity', label: 'Capacity (tons)', type: 'number' },
      { name: 'wB', label: 'WB (°F)', type: 'number' },
      { name: 'EWT', label: 'EWT (°F)', type: 'number' },
      { name: 'LWT', label: 'LWT (°F)', type: 'number' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'number of fans', label: 'Number of Fans', type: 'number' },
      { name: 'fan HP', label: 'Fan HP', type: 'number' },
      { name: 'voltage/phase', label: 'Voltage/Phase (V/Ph)', type: 'text' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
      { name: 'connectionSizes', label: 'Connection Sizes', type: 'text' },
      { name: 'controls', label: 'Controls', type: 'text' },
    ],
    'Custom Skid': [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'voltage/phase', label: 'Voltage/Phase (V/Ph)', type: 'text' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
      { name: 'connectionSizes', label: 'Connection Sizes', type: 'text' },
      { name: 'controls', label: 'Controls', type: 'text' },
    ],
  };

  const fluidFlowFields = {
    AHU: {
      Air: [
        { name: 'saCFM', label: 'SA CFM', type: 'number' },
        { name: 'saSP', label: 'SA Static Pressure (in. wg)', type: 'number' },
        { name: 'oaCFM', label: 'OA CFM', type: 'number' },
        { name: 'oaSP', label: 'OA Static Pressure (in. wg)', type: 'number' },
        { name: 'raCFM', label: 'RA CFM', type: 'number' },
        { name: 'raSP', label: 'RA Static Pressure (in. wg)', type: 'number' },
        { name: 'exhaustCFM', label: 'Exhaust CFM', type: 'number' },
        { name: 'exhaustSP', label: 'Exhaust Static Pressure (in. wg)', type: 'number' },
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
        { name: 'gpm', label: 'GPM', type: 'number' },
      ],
      Air: [
        { name: 'cfm', label: 'CFM', type: 'number' },
      ],
      Refrigerant: [
        { name: 'capacity', label: 'Capacity (BTU/hr)', type: 'number' },
        { name: 'eat', label: 'EAT (°F)', type: 'number' },
        { name: 'lat', label: 'LAT (°F)', type: 'number' },
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
    'Custom Skid': ['Water'],
  };

  const allowedAdditionalFluidFlows = {
    AHU: ['Water', 'Refrigerant', 'Air'],
    Chiller: ['Water', 'Air', 'Refrigerant'],
    'Cooling Tower': [],
    'Fluid Cooler': ['Water'],
    'Custom Skid': ['Water', 'Air', 'Refrigerant'],
  };

  const projectFields = [
    { name: 'name', label: 'Project Name' },
    { name: 'address', label: 'Address' },
    { name: 'city', label: 'City' },
    { name: 'localASHRAEWeatherStation', label: 'Local ASHRAE Weather Station' },
    { name: 'costPerKwh', label: '$/kWh' },
    { name: 'costPerGpm', label: '$/GPM' },
    { name: 'costPerGpmSewer', label: '$/GPM Sewer' },
    { name: 'costPerMbtuGas', label: '$/MBTU Gas' },
  ];

  // **Functions**

  const addProject = () => {
    if (!newProjectName.trim()) {
      alert('Project name cannot be empty!');
      return;
    }
    if (projects.some(p => p.name.toLowerCase() === newProjectName.toLowerCase())) {
      alert('Project name must be unique!');
      return;
    }
    const newProject = {
      id: Date.now(),
      name: newProjectName,
      address: '',
      city: '',
      localASHRAEWeatherStation: '',
      costPerKwh: '',
      costPerGpm: '',
      costPerGpmSewer: '',
      costPerMbtuGas: '',
      equipmentGroups: [],
    };
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

  const addEquipment = (type, isAlternate = false, alternateForTag = '') => {
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
      const newGroup = {
        id: Date.now(),
        tag: finalTag,
        options: [newEquipment],
      };
      setProjects(projects.map(p =>
        p.id === selectedProject.id
          ? { ...p, equipmentGroups: [...p.equipmentGroups, newGroup] }
          : p
      ));
    } else {
      const group = selectedProject.equipmentGroups.find(g => g.tag === alternateForTag);
      if (!group) {
        alert('Group not found');
        return;
      }
      const altNumber = group.options.length + 1;
      const tag = `${alternateForTag}-alt${altNumber}`;
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
              equipmentGroups: p.equipmentGroups.map(g =>
                g.tag === alternateForTag ? { ...g, options: [...g.options, newEquipment] } : g
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
    setAlternateForTag('');
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

  const handleProjectFieldSave = (fieldName, newValue) => {
    if (fieldName === 'name') {
      if (projects.some(p => p.id !== selectedProjectId && p.name.toLowerCase() === newValue.toLowerCase())) {
        alert('Project name must be unique!');
        return;
      }
    }
    setProjects(projects.map(p =>
      p.id === selectedProjectId ? { ...p, [fieldName]: newValue } : p
    ));
  };

  const deleteEquipmentGroup = (groupId) => {
    if (!confirm('Are you sure you want to delete this equipment group?')) return;
    setProjects(projects.map(p =>
      p.id === selectedProjectId
        ? { ...p, equipmentGroups: p.equipmentGroups.filter(g => g.id !== groupId) }
        : p
    ));
  };

  const deleteAlternateOption = (groupId, optionId) => {
    if (!confirm('Are you sure you want to delete this alternate option?')) return;
    setProjects(projects.map(p =>
      p.id === selectedProjectId
        ? {
            ...p,
            equipmentGroups: p.equipmentGroups.map(g =>
              g.id === groupId ? { ...g, options: g.options.filter(opt => opt.id !== optionId) } : g
            ),
          }
        : p
    ));
  };

  // **Render Functions**

  const EditableField = ({ label, value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => setLocalValue(value), [value]);

    const handleSave = () => {
      onSave(localValue);
      setIsEditing(false);
    };

    return (
      <div>
        {label && <label className="block text-sm text-blue-300">{label}</label>}
        {isEditing ? (
          <input
            type="text"
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            onBlur={handleSave}
            autoFocus
            className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100"
          />
        ) : (
          <div className="flex items-center">
            <span>{value || 'Not set'}</span>
            <button onClick={() => setIsEditing(true)} className="ml-2 text-blue-400">
              <Edit size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

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
          {isAlternate ? `Add Alternate for ${alternateForTag}` : 'Add New Equipment'}
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
            onClick={() => addEquipment(isAlternate ? baseEquipmentType : newEquipmentType, isAlternate, alternateForTag)}
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
      <div key={group.id} className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xl font-semibold text-blue-100">{group.tag} ({group.options[0].type})</h4>
          <button
            onClick={() => setExpandedEquipmentTag(expandedEquipmentTag === group.id ? null : group.id)}
            className="text-blue-100"
          >
            {expandedEquipmentTag === group.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {expandedEquipmentTag === group.id && (
          <div className="mt-4">
            {group.options.map((option, index) => (
              <div key={option.id} className="mb-6 p-4 bg-gray-700/50 rounded-lg relative">
                <h5 className="text-lg font-medium text-blue-200 mb-2">{option.equipmentTag}</h5>
                {index === 0 ? (
                  <button
                    onClick={() => deleteEquipmentGroup(group.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => deleteAlternateOption(group.id, option.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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
        )}
      </div>
    ));
  };

  // **Render**
  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 flex flex-col relative">
      <BackgroundPattern />

      {/* Modals */}
      {showAddProjectModal && renderAddProjectModal()}
      {showEquipmentModal && renderAddEquipmentModal()}
      {showAddFluidFlowModal && renderAddFluidFlowModal()}

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between z-40">
        <h1 className="text-xl font-bold text-blue-100">Bernoullia</h1>
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-blue-100">
            <Menu size={24} />
          </button>
        )}
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 bg-gray-800/90 backdrop-blur-md border-r border-blue-500/20 p-4 flex-shrink-0 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 z-50' : '-translate-x-full z-30'
        } md:translate-x-0 md:static md:w-64 md:z-0`}
      >
        <div className="pt-16 md:pt-0">
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
                    setIsSidebarOpen(false);
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
                      <div key={group.id} className="group relative">
                        <button
                          onClick={() => setExpandedEquipmentTag(expandedEquipmentTag === group.id ? null : group.id)}
                          className="w-full text-left px-2 py-1 text-xs text-blue-300 hover:bg-gray-700 rounded flex items-center justify-between"
                        >
                          {group.tag}
                          {expandedEquipmentTag === group.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {expandedEquipmentTag === group.id && (
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
                                setAlternateForTag(group.tag);
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
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:ml-64 overflow-y-auto mt-16 md:mt-0">
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
          <div>
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-blue-100">Project Details</h3>
                <button
                  onClick={() => setIsProjectDetailsExpanded(!isProjectDetailsExpanded)}
                  className="text-blue-100"
                >
                  {isProjectDetailsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              {isProjectDetailsExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectFields.map(field => (
                    <EditableField
                      key={field.name}
                      label={field.label}
                      value={selectedProject[field.name]}
                      onSave={newValue => handleProjectFieldSave(field.name, newValue)}
                    />
                  ))}
                </div>
              )}
            </section>
            <section className="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 border border-blue-500/20">
              <h3 className="text-xl font-semibold text-blue-100 mb-4">
                Equipment Schedules - {selectedProject.name}
              </h3>
              {renderEquipmentSchedules()}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DesignEngineerLanding;