// ToolsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Camera } from 'lucide-react';

const tools = [
  {
    name: 'Equipment Comparison Tool',
    description: 'Compare AHUs, Chillers, Cooling Towers, Custom Equipment, and more for MEP design.',
    icon: <Wrench className="w-8 h-8 text-blue-400" />,
    path: '/tools/equipment-comparison',
  },
  {
    name: 'Project Picture Tool',
    description: 'Upload, organize, and share project photos for documentation and collaboration.',
    icon: <Camera className="w-8 h-8 text-blue-400" />,
    path: '/tools/project-pictures',
  },
];

const ToolsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Bernoullia Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map(tool => (
            <Link to={tool.path} key={tool.name} className="bernoullia-card p-6 flex flex-col gap-3 hover:scale-[1.02] transition-transform">
              <div>{tool.icon}</div>
              <h2 className="text-xl font-semibold text-blue-100">{tool.name}</h2>
              <p className="text-blue-300">{tool.description}</p>
              <span className="mt-auto text-blue-400 hover:underline">Open Tool →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
