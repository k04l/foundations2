// src/features/home/components/DesignEngineerLanding.jsx
import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { Plus, Folder, Trash2, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { BackgroundPattern } from './BackgroundPattern';

export const DesignEngineerLanding = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  // State
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedEquipmentTag, setExpandedEquipmentTag] = useState(null);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
  const [newEquipmentTag, setNewEquipmentTag] = useState('');
  const [newEquipmentType, setNewEquipmentType] = useState('');
  const [isAlternate, setIsAlternate] = useState(false);
  const [alertedFields, setAlertedFields] = useState(new Set()); // Track alerted fields to prevent loops

  // Equipment types
  const equipmentTypes = ['AHU', 'Chiller', 'Cooling Tower', 'Fluid Cooler', 'Custom Skid'];

  // Equipment type-specific fields
  const equipmentFields = {
    AHU: [
      { name: 'equipmentTag', label: 'Equipment Tag', type: 'text', required: true },
      { name: 'ahuType', label: 'AHU Type', type: 'select', options: ['CHW/HW', 'DX', 'Evap', 'Gas Fired (Direct)', 'Gas Fired (Indirect)', 'Steam'], required: true },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'summerEntAirTempDB', label: 'Summer Ent. Air Temp DB (°F)', type: 'number' },
      { name: 'summerEntAirTempWB', label: 'Summer Ent. Air Temp WB (°F)', type: 'number' },
      { name: 'winterEntAirTempDB', label: 'Winter Ent. Air Temp DB (°F)', type: 'number' },
      { name: 'winterEntAirTempWB', label: 'Winter Ent. Air Temp WB (°F)', type: 'number' },
      { name: 'summerSupAirDB', label: 'Summer Sup. Air DB (°F)', type: 'number' },
      { name: 'summerSupAirWB', label: 'Summer Sup. Air WB (°F)', type: 'number' },
      { name: 'winterSupAirDB', label: 'Winter Sup. Air DB (°F)', type: 'number' },
      { name: 'winterSupAirWB', label: 'Winter Sup. Air WB (°F)', type: 'number' },
      { name: 'supplyFanQty', label: 'Supply Fan Qty', type: 'number' },
      { name: 'supplyFanCFMEach', label: 'Supply Fan CFM Each', type: 'number' },
      { name: 'supplyFanTotalCFM', label: 'Supply Fan Total CFM', type: 'number' },
      { name: 'supplyFanStaticPressure', label: 'Supply Fan Static Press. (in. wg)', type: 'number' },
      { name: 'supplyFanSoundData', label: 'Supply Fan Sound (dB)', type: 'text' },
      { name: 'exhaustFanCFMEach', label: 'Exhaust Fan CFM Each', type: 'number' },
      { name: 'exhaustFanTotalCFM', label: 'Exhaust Fan Total CFM', type: 'number' },
      { name: 'exhaustFanStaticPressure', label: 'Exhaust Fan Static Press. (in. wg)', type: 'number' },
      { name: 'exhaustFanSoundData', label: 'Exhaust Fan Sound (dB)', type: 'text' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'filtrationType', label: 'Filtration Type', type: 'text' },
      { name: 'ewt', label: 'EWT (°F)', type: 'number', conditional: 'ahuType', condition: 'CHW/HW' },
      { name: 'lwt', label: 'LWT (°F)', type: 'number', conditional: 'ahuType', condition: 'CHW/HW' },
      { name: 'flowRate', label: 'Flow Rate (GPM)', type: 'number', conditional: 'ahuType', condition: 'CHW/HW' },
      { name: 'coilPressureDrop', label: 'Coil Press. Drop (psi)', type: 'number', conditional: 'ahuType', condition: 'CHW/HW' },
      { name: 'pipeConnectionSize', label: 'Pipe Conn. Size (in)', type: 'text', conditional: 'ahuType', condition: 'CHW/HW' },
      { name: 'ospRating', label: 'OSP Rating', type: 'select', options: ['Yes', 'No'], conditional: 'ahuType', condition: 'CHW/HW' },
      { name: 'designAmbientWetBulb', label: 'Design Ambient WB (°F)', type: 'number', conditional: 'ahuType', condition: 'Evap' },
      { name: 'makeupGPM', label: 'Makeup Water (GPM)', type: 'number', conditional: 'ahuType', condition: 'Evap' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'indoorOutdoor', label: 'Indoor/Outdoor', type: 'select', options: ['Indoor', 'Outdoor'] },
      { name: 'controlPanelNemaRating', label: 'Control Panel NEMA Rating', type: 'text' },
      { name: 'constructionMaterial', label: 'Construction Material', type: 'text' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
    ],
    Chiller: [
      { name: 'equipmentTag', label: 'Equipment Tag', type: 'text', required: true },
      { name: 'chillerType', label: 'Chiller Type', type: 'select', options: ['Air-cooled', 'Water-cooled', 'Screw', 'DX', 'Heat Pump', 'Heat Recovery'], required: true },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'ewt', label: 'EWT (°F)', type: 'number' },
      { name: 'lwt', label: 'LWT (°F)', type: 'number' },
      { name: 'eer', label: 'EER', type: 'number' },
      { name: 'ieer', label: 'IEER', type: 'number' },
      { name: 'seer', label: 'SEER', type: 'number' },
      { name: 'designAmbientTemp', label: 'Design Ambient Temp (°F)', type: 'number', conditional: 'chillerType', condition: 'Air-cooled' },
      { name: 'designSourceTemp', label: 'Design Source Temp (°F)', type: 'number', conditional: 'chillerType', condition: 'Water-cooled' },
      { name: 'flowRate', label: 'Flow Rate (GPM)', type: 'number', conditional: 'chillerType', condition: 'Water-cooled' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'pipeConnectionSize', label: 'Pipe Conn. Size (in)', type: 'text' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
    ],
    'Cooling Tower': [
      { name: 'equipmentTag', label: 'Equipment Tag', type: 'text', required: true },
      { name: 'towerType', label: 'Cooling Tower Type', type: 'select', options: ['Crossflow', 'Counterflow', 'Field Erected'], required: true },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'designAmbientDB', label: 'Design Ambient DB (°F)', type: 'number' },
      { name: 'designAmbientWB', label: 'Design Ambient WB (°F)', type: 'number' },
      { name: 'gpm', label: 'Flow Rate (GPM)', type: 'number' },
      { name: 'ewt', label: 'EWT (°F)', type: 'number' },
      { name: 'lwt', label: 'LWT (°F)', type: 'number' },
      { name: 'pipeConnectionSize', label: 'Pipe Conn. Size (in)', type: 'text' },
      { name: 'coolingCapacity', label: 'Cooling Capacity (BTU)', type: 'number' },
      { name: 'basinMaterial', label: 'Basin Material', type: 'text' },
      { name: 'upperMaterial', label: 'Upper Material', type: 'text' },
      { name: 'fanHP', label: 'Fan HP', type: 'number' },
      { name: 'fanQty', label: 'Fan Qty', type: 'number' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
    ],
    'Fluid Cooler': [
      { name: 'equipmentTag', label: 'Equipment Tag', type: 'text', required: true },
      { name: 'coolerType', label: 'Fluid Cooler Type', type: 'select', options: ['Dry Cooler', 'Adiabatic Evaporative Pads', 'Adiabatic Evaporative Spray', 'Hybrid Cooling Towers'], required: true },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'designAmbientDB', label: 'Design Ambient DB (°F)', type: 'number' },
      { name: 'designAmbientWB', label: 'Design Ambient WB (°F)', type: 'number', conditional: 'coolerType', condition: ['Adiabatic Evaporative Pads', 'Adiabatic Evaporative Spray', 'Hybrid Cooling Towers'] },
      { name: 'gpm', label: 'Flow Rate (GPM)', type: 'number' },
      { name: 'ewt', label: 'EWT (°F)', type: 'number' },
      { name: 'lwt', label: 'LWT (°F)', type: 'number' },
      { name: 'pipeConnectionSize', label: 'Pipe Conn. Size (in)', type: 'text' },
      { name: 'coolingCapacity', label: 'Cooling Capacity (BTU)', type: 'number' },
      { name: 'constructionMaterial', label: 'Construction Material', type: 'text' },
      { name: 'waterConsumption', label: 'Water Consumption (GPY)', type: 'number', conditional: 'coolerType', condition: ['Adiabatic Evaporative Pads', 'Adiabatic Evaporative Spray', 'Hybrid Cooling Towers'] },
      { name: 'fanHP', label: 'Fan HP', type: 'number' },
      { name: 'fanQty', label: 'Fan Qty', type: 'number' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
    ],
    'Custom Skid': [
      { name: 'equipmentTag', label: 'Equipment Tag', type: 'text', required: true },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'capacity', label: 'Capacity (Units)', type: 'number' },
      { name: 'power', label: 'Power Input (kW)', type: 'number' },
      { name: 'cost', label: 'Initial Cost ($)', type: 'number' },
      { name: 'width', label: 'Width (in)', type: 'number' },
      { name: 'depth', label: 'Depth (in)', type: 'number' },
      { name: 'height', label: 'Height (in)', type: 'number' },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'mca', label: 'MCA (Amps)', type: 'number' },
      { name: 'mop', label: 'MOP (Amps)', type: 'number' },
      { name: 'mocp', label: 'MOCP (Amps)', type: 'number' },
    ],
  };

  // Add new project
  const addProject = () => {
    if (newProjectName.trim() === '') {
      alert('Project name cannot be empty!');
      return;
    }
    if (projects.some(p => p.name.toLowerCase() === newProjectName.toLowerCase())) {
      alert('Project name must be unique!');
      return;
    }
    const newProject = { id: Date.now(), name: newProjectName, equipmentGroups: [] };
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
    setEquipmentOptions([]);
    setShowAddProjectModal(false);
    setNewProjectName('');
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

  // Add equipment or alternate to selected project
  const addEquipment = (type, isAlternate = false, baseTag = '') => {
    if (!selectedProject) {
      alert('Please select or create a project first');
      return;
    }
    if (!newEquipmentTag.trim() && !isAlternate) {
      alert('Equipment tag is required!');
      return;
    }
    const tag = isAlternate ? `${baseTag}-alt${(selectedProject.equipmentGroups.find(g => g.tag === baseTag)?.options.length || 0) + 1}` : newEquipmentTag;
    const newEquipment = { 
      id: Date.now(), 
      type, 
      equipmentTag: tag,
      ...Object.fromEntries(equipmentFields[type].filter(f => f.name !== 'equipmentTag').map(field => [field.name, '']))
    };
    const updatedEquipmentGroups = isAlternate
      ? selectedProject.equipmentGroups.map(group => 
          group.tag === baseTag ? { ...group, options: [...group.options, newEquipment] } : group
        )
      : [...selectedProject.equipmentGroups, { tag, options: [newEquipment] }];
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? { ...p, equipmentGroups: updatedEquipmentGroups } : p
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
    setEquipmentOptions(updatedEquipmentGroups.flatMap(g => g.options));
    setShowEquipmentDropdown(false);
    setNewEquipmentTag('');
    setNewEquipmentType('');
    setIsAlternate(false);
  };

  // Handle input changes and persistence
  const handleInputChange = (id, field, value) => {
    const updatedOptions = equipmentOptions.map(option =>
      option.id === id ? { ...option, [field]: value } : option
    );
    setEquipmentOptions(updatedOptions);
    setProjects(prev =>
      prev.map(p =>
        p.id === selectedProject.id ? {
          ...p,
          equipmentGroups: p.equipmentGroups.map(group => ({
            ...group,
            options: group.options.map(opt => opt.id === id ? { ...opt, [field]: value } : opt)
          }))
        } : p
      )
    );
    if (value.trim()) setAlertedFields(prev => new Set(prev).delete(`${id}-${field}`)); // Clear alert if filled
  };

  // Handle Enter/Tab to persist equipment with validation
  const handleInputPersist = (id, field, value) => {
    const fieldDef = equipmentFields[equipmentOptions.find(opt => opt.id === id).type].find(f => f.name === field);
    const alertKey = `${id}-${field}`;
    if (!value.trim() && fieldDef?.required && !alertedFields.has(alertKey)) {
      alert(`${field} is required!`);
      setAlertedFields(prev => new Set(prev).add(alertKey));
      return;
    }
    handleInputChange(id, field, value);
  };

  // Delete equipment
  const deleteEquipment = (id) => {
    const updatedOptions = equipmentOptions.filter(option => option.id !== id);
    setEquipmentOptions(updatedOptions);
    setProjects(prev =>
      prev.map(p =>
        p.id === selectedProject.id ? {
          ...p,
          equipmentGroups: p.equipmentGroups
            .map(group => ({
              ...group,
              options: group.options.filter(opt => opt.id !== id)
            }))
            .filter(group => group.options.length > 0)
        } : p
      )
    );
  };

  // Calculate metrics
  const calculateMetrics = (options) => {
    return options.map(option => {
      const capacity = parseFloat(option.coolingCapacity) || parseFloat(option.capacity) || 0;
      const power = parseFloat(option.power) || parseFloat(option.fanHP) * 0.746 || 0;
      const cost = parseFloat(option.cost) || 0;
      return {
        ...option,
        costPerTon: capacity > 0 ? (cost / (capacity / (option.type === 'Cooling Tower' || option.type === 'Fluid Cooler' ? 12000 : 1))).toFixed(2) : 'N/A',
        powerPerTon: capacity > 0 ? (power / (capacity / (option.type === 'Cooling Tower' || option.type === 'Fluid Cooler' ? 12000 : 1))).toFixed(2) : 'N/A',
        operatingCost: power * 0.12 * 8760,
      };
    });
  };

  // Generate schedule for clipboard
  const generateSchedule = (option) => {
    const fields = Object.entries(option).filter(([key]) => key !== 'id');
    return `
EQUIPMENT SCHEDULE
----------------------------------------
${fields.map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join('\n')}
----------------------------------------
    `.trim();
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Schedule copied to clipboard!');
  };

  // Render schedule table for a specific type
  const renderScheduleTable = (type) => {
    const typeOptions = equipmentOptions.filter(opt => opt.type === type);
    if (typeOptions.length === 0) return null;
    const metrics = calculateMetrics(typeOptions);

    return (
      <div key={type} className="mb-8">
        <h4 className="text-xl font-semibold text-blue-100 mb-4">{type} Schedule</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-blue-100 border-collapse">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                {equipmentFields[type]
                  .filter(field => !field.conditional || typeOptions.some(opt => opt[field.conditional] === field.condition || (Array.isArray(field.condition) && field.condition.includes(opt[field.conditional]))))
                  .map(field => (
                    <th key={field.name} className="p-2 border border-blue-500/20 min-w-[150px]">{field.label}</th>
                  ))}
                <th className="p-2 border border-blue-500/20 min-w-[150px]">Cost/Ton</th>
                <th className="p-2 border border-blue-500/20 min-w-[150px]">Power/Ton</th>
                <th className="p-2 border border-blue-500/20 min-w-[150px]">Annual Cost</th>
                <th className="p-2 border border-blue-500/20 min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(option => (
                <tr key={option.id} className="border-b border-blue-500/20 hover:bg-gray-700/50">
                  {equipmentFields[type]
                    .filter(field => !field.conditional || option[field.conditional] === field.condition || (Array.isArray(field.condition) && field.condition.includes(option[field.conditional])))
                    .map(field => (
                      <td key={field.name} className="p-2 border border-blue-500/20">
                        {field.type === 'select' ? (
                          <select
                            value={option[field.name] || ''}
                            onChange={e => {
                              if (!e.target.value && field.required && !alertedFields.has(`${option.id}-${field.name}`)) {
                                alert(`${field.label} is required!`);
                                setAlertedFields(prev => new Set(prev).add(`${option.id}-${field.name}`));
                              } else {
                                handleInputChange(option.id, field.name, e.target.value);
                              }
                            }}
                            onBlur={e => handleInputPersist(option.id, field.name, e.target.value)}
                            className="w-full bg-transparent border-none text-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                          >
                            <option value="" disabled>Select</option>
                            {field.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={option[field.name] || ''}
                            onChange={e => handleInputChange(option.id, field.name, e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleInputPersist(option.id, field.name, e.target.value);
                              }
                            }}
                            onBlur={e => handleInputPersist(option.id, field.name, e.target.value)}
                            className="w-full bg-transparent border-none text-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                            required={field.required}
                          />
                        )}
                      </td>
                    ))}
                  <td className="p-2 border border-blue-500/20">{option.costPerTon}</td>
                  <td className="p-2 border border-blue-500/20">{option.powerPerTon}</td>
                  <td className="p-2 border border-blue-500/20">${option.operatingCost.toFixed(2)}</td>
                  <td className="p-2 border border-blue-500/20">
                    <button
                      onClick={() => deleteEquipment(option.id)}
                      className="text-red-400 hover:text-red-300 mr-2"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(generateSchedule(option))}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Copy size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 flex relative">
      <BackgroundPattern />

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/20">
            <h3 className="text-xl font-semibold text-blue-100 mb-4">Add New Project</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="Enter unique project name"
              className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="px-4 py-2 bg-gray-600 text-blue-100 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showEquipmentDropdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/20">
            <h3 className="text-xl font-semibold text-blue-100 mb-4">
              {isAlternate ? `Add Alternate for ${newEquipmentTag}` : 'Add New Equipment'}
            </h3>
            {!isAlternate && (
              <input
                type="text"
                value={newEquipmentTag}
                onChange={e => setNewEquipmentTag(e.target.value)}
                placeholder="Enter equipment tag (e.g., AHU-1)"
                className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            )}
            <select
              value={newEquipmentType}
              onChange={e => setNewEquipmentType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="" disabled>Select Equipment Type</option>
              {equipmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowEquipmentDropdown(false);
                  setNewEquipmentTag('');
                  setNewEquipmentType('');
                  setIsAlternate(false);
                }}
                className="px-4 py-2 bg-gray-600 text-blue-100 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => newEquipmentType && addEquipment(newEquipmentType, isAlternate, newEquipmentTag)}
                className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 disabled:bg-gray-500"
                disabled={!newEquipmentType || (!isAlternate && !newEquipmentTag.trim())}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/50 backdrop-blur-md border-r border-blue-500/20 p-6 flex-shrink-0 overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-100 mb-6 flex items-center">
          <Folder className="mr-2" /> Projects
        </h2>
        <div className="space-y-2">
          {projects.map(project => (
            <div key={project.id} className="group relative">
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setEquipmentOptions(project.equipmentGroups.flatMap(g => g.options));
                  setExpandedProject(expandedProject === project.id ? null : project.id);
                  setExpandedEquipmentTag(null);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-blue-300 hover:bg-gray-700 ${
                  selectedProject?.id === project.id ? 'font-bold border-2 border-blue-500' : ''
                }`}
              >
                {project.name}
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-red-400 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              {expandedProject === project.id && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-blue-500 pl-2">
                  {project.equipmentGroups.map(group => (
                    <div key={group.tag} className="group relative">
                      <button
                        onClick={() => setExpandedEquipmentTag(expandedEquipmentTag === group.tag ? null : group.tag)}
                        className="w-full text-left px-3 py-1 text-sm text-blue-300 hover:bg-gray-700 rounded flex items-center justify-between"
                      >
                        {group.tag}
                        {expandedEquipmentTag === group.tag ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedEquipmentTag === group.tag && (
                        <div className="ml-4 mt-1 space-y-1">
                          {group.options.map(opt => (
                            <div
                              key={opt.id}
                              className="text-sm text-blue-300 hover:bg-gray-700 rounded cursor-pointer"
                              onClick={() => setEquipmentOptions(group.options)}
                            >
                              {opt.equipmentTag}
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setNewEquipmentTag(group.tag);
                              setIsAlternate(true);
                              setShowEquipmentDropdown(true);
                            }}
                            className="w-full text-left px-3 py-1 text-sm text-blue-300 hover:bg-gray-700 rounded"
                          >
                            + Add Alternate
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="relative">
                    <button
                      onClick={() => setShowEquipmentDropdown(!showEquipmentDropdown)}
                      className="w-full text-left px-3 py-1 text-sm text-blue-300 hover:bg-gray-700 rounded flex items-center"
                    >
                      <Plus size={16} className="mr-1" /> Equipment
                      {showEquipmentDropdown ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAddProjectModal(true)}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <Plus className="mr-2" size={16} /> Add Project
        </button>
      </aside>

      {/* Main Content */}
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
              onClick={() => setShowAddProjectModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus className="mr-2" /> Start New Project
            </button>
          </div>
        ) : (
          <section className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-semibold text-blue-100 mb-6">Equipment Schedules - {selectedProject.name}</h3>
            {equipmentTypes.map(type => renderScheduleTable(type))}
          </section>
        )}
      </main>
    </div>
  );
};

export default DesignEngineerLanding;