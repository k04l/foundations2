// src/features/home/components/DesignEngineerLanding.jsx
import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { Wrench, Calculator, Copy, ArrowRight } from 'lucide-react';
import { BackgroundPattern } from './BackgroundPattern';
import { UserDropdown } from './UserDropdown';

export const DesignEngineerLanding = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  // State for equipment options
  const [equipmentOptions, setEquipmentOptions] = useState([
    { id: 1, name: '', capacity: '', power: '', cost: '', efficiency: '' },
    { id: 2, name: '', capacity: '', power: '', cost: '', efficiency: '' },
  ]);

  // State for selected equipment
  const [selectedOption, setSelectedOption] = useState(null);

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    setEquipmentOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  // Add new equipment option
  const addEquipmentOption = () => {
    setEquipmentOptions(prev => [
      ...prev,
      { id: prev.length + 1, name: '', capacity: '', power: '', cost: '', efficiency: '' },
    ]);
  };

  // Calculate comparison metrics
  const calculateMetrics = () => {
    return equipmentOptions.map(option => {
      const capacity = parseFloat(option.capacity) || 0;
      const power = parseFloat(option.power) || 0;
      const cost = parseFloat(option.cost) || 0;
      const efficiency = parseFloat(option.efficiency) || 0;

      return {
        ...option,
        costPerTon: capacity > 0 ? (cost / capacity).toFixed(2) : 'N/A',
        powerPerTon: capacity > 0 ? (power / capacity).toFixed(2) : 'N/A',
        operatingCost: power * 0.12 * 8760, // Assuming $0.12/kWh, 8760 hours/year
      };
    });
  };

  // Generate equipment schedule
  const generateSchedule = (option) => {
    if (!option || !option.name) return '';
    return `
EQUIPMENT SCHEDULE
----------------------------------------
Equipment Type: ${option.name}
Cooling Capacity: ${option.capacity} Tons
Power Input: ${option.power} kW
Efficiency: ${option.efficiency} EER
Initial Cost: $${option.cost}
Cost per Ton: $${option.costPerTon}
Power per Ton: ${option.powerPerTon} kW/Ton
Annual Operating Cost: $${option.operatingCost.toFixed(2)}
----------------------------------------
    `.trim();
  };

  // Copy schedule to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Schedule copied to clipboard!');
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 relative">
      <BackgroundPattern />
      
      <header className="bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-100">BERNOULLIA</h1>
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-100 mb-6">
            Design Engineer Hub
          </h2>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Optimize your MEP designs with our equipment comparison calculator. Compare AHUs, Chillers, Cooling Towers, and custom equipment options efficiently.
          </p>
        </section>

        <section className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20">
          <h3 className="text-2xl font-semibold text-blue-100 mb-6 flex items-center">
            <Calculator className="mr-2" /> Equipment Comparison Calculator
          </h3>

          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {equipmentOptions.map((option) => (
              <div key={option.id} className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
                <input
                  type="text"
                  placeholder="Equipment Name (e.g., Chiller A)"
                  value={option.name}
                  onChange={(e) => handleInputChange(option.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Cooling Capacity (Tons)"
                  value={option.capacity}
                  onChange={(e) => handleInputChange(option.id, 'capacity', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Power Input (kW)"
                  value={option.power}
                  onChange={(e) => handleInputChange(option.id, 'power', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Initial Cost ($)"
                  value={option.cost}
                  onChange={(e) => handleInputChange(option.id, 'cost', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Efficiency (EER)"
                  value={option.efficiency}
                  onChange={(e) => handleInputChange(option.id, 'efficiency', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={addEquipmentOption}
            className="mb-8 px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Add Equipment Option
          </button>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left text-blue-100">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4">Equipment</th>
                  <th className="p-4">Capacity (Tons)</th>
                  <th className="p-4">Power (kW)</th>
                  <th className="p-4">Cost ($)</th>
                  <th className="p-4">Efficiency (EER)</th>
                  <th className="p-4">Cost/Ton</th>
                  <th className="p-4">Power/Ton</th>
                  <th className="p-4">Annual Operating Cost</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((option) => (
                  <tr key={option.id} className="border-b border-blue-500/20 hover:bg-gray-700/50">
                    <td className="p-4">{option.name || 'Unnamed'}</td>
                    <td className="p-4">{option.capacity}</td>
                    <td className="p-4">{option.power}</td>
                    <td className="p-4">{option.cost}</td>
                    <td className="p-4">{option.efficiency}</td>
                    <td className="p-4">{option.costPerTon}</td>
                    <td className="p-4">{option.powerPerTon}</td>
                    <td className="p-4">${option.operatingCost.toFixed(2)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOption(option)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Equipment Schedule Output */}
          {selectedOption && (
            <div className="bg-gray-900 p-6 rounded-lg border border-blue-500/20">
              <h4 className="text-xl font-semibold text-blue-100 mb-4">Selected Equipment Schedule</h4>
              <pre className="text-blue-300 whitespace-pre-wrap">{generateSchedule(selectedOption)}</pre>
              <button
                onClick={() => copyToClipboard(generateSchedule(selectedOption))}
                className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Copy className="mr-2" size={16} /> Copy to Clipboard
              </button>
            </div>
          )}
        </section>

        <section className="mt-16 text-center">
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-all duration-200 text-lg font-medium group transform hover:scale-105"
          >
            <Wrench className="mr-2" /> Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </section>
      </main>

      <footer className="bg-gray-900/80 border-t border-blue-500/20 py-4 text-center text-blue-300">
        © 2025 Bernoullia. All rights reserved.
      </footer>
    </div>
  );
};

export default DesignEngineerLanding;