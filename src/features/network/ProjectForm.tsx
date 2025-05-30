import React, { useState } from 'react';

interface ProjectFormProps {
  onSave: (project: {
    name: string;
    address?: string;
    city?: string;
    localASHRAEWeatherStation?: string;
    costPerKwh?: string;
    costPerGpm?: string;
    costPerGpmSewer?: string;
    costPerMbtuGas?: string;
    description?: string;
  }) => void;
  onCancel: () => void;
  initial?: {
    name: string;
    address?: string;
    city?: string;
    localASHRAEWeatherStation?: string;
    costPerKwh?: string;
    costPerGpm?: string;
    costPerGpmSewer?: string;
    costPerMbtuGas?: string;
    description?: string;
  };
}

export default function ProjectForm({ onSave, onCancel, initial }: ProjectFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [city, setCity] = useState(initial?.city || '');
  const [localASHRAEWeatherStation, setLocalASHRAEWeatherStation] = useState(initial?.localASHRAEWeatherStation || '');
  const [costPerKwh, setCostPerKwh] = useState(initial?.costPerKwh || '');
  const [costPerGpm, setCostPerGpm] = useState(initial?.costPerGpm || '');
  const [costPerGpmSewer, setCostPerGpmSewer] = useState(initial?.costPerGpmSewer || '');
  const [costPerMbtuGas, setCostPerMbtuGas] = useState(initial?.costPerMbtuGas || '');
  const [description, setDescription] = useState(initial?.description || '');

  return (
    <form
      className="bg-blue-950 text-blue-100 rounded-xl shadow-2xl border border-blue-500/20 p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
      onSubmit={e => {
        e.preventDefault();
        onSave({ name, address, city, localASHRAEWeatherStation, costPerKwh, costPerGpm, costPerGpmSewer, costPerMbtuGas, description });
      }}
    >
      <h3 className="text-lg font-semibold mb-4">{initial ? 'Edit Project' : 'Add Project'}</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Name</label>
        <input className="input input-bordered w-full text-black" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Address</label>
        <input className="input input-bordered w-full text-black" value={address} onChange={e => setAddress(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">City</label>
        <input className="input input-bordered w-full text-black" value={city} onChange={e => setCity(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Local ASHRAE Weather Station</label>
        <input className="input input-bordered w-full text-black" value={localASHRAEWeatherStation} onChange={e => setLocalASHRAEWeatherStation(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">$/kWh</label>
        <input className="input input-bordered w-full text-black" value={costPerKwh} onChange={e => setCostPerKwh(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">$/GPM</label>
        <input className="input input-bordered w-full text-black" value={costPerGpm} onChange={e => setCostPerGpm(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">$/GPM Sewer</label>
        <input className="input input-bordered w-full text-black" value={costPerGpmSewer} onChange={e => setCostPerGpmSewer(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">$/MBTU Gas</label>
        <input className="input input-bordered w-full text-black" value={costPerMbtuGas} onChange={e => setCostPerMbtuGas(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Description</label>
        <textarea className="textarea textarea-bordered w-full text-black" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
