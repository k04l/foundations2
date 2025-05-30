import React, { useState } from 'react';

interface CompanyFormProps {
  onSave: (company: { name: string; industry?: string; website?: string; notes?: string }) => void;
  onCancel: () => void;
  initial?: { name: string; industry?: string; website?: string; notes?: string };
}

export default function CompanyForm({ onSave, onCancel, initial }: CompanyFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [industry, setIndustry] = useState(initial?.industry || '');
  const [website, setWebsite] = useState(initial?.website || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  return (
    <form
      className="bg-blue-950 text-blue-100 rounded-xl shadow-2xl border border-blue-500/20 p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
      onSubmit={e => {
        e.preventDefault();
        onSave({ name, industry, website, notes });
      }}
    >
      <h3 className="text-lg font-semibold mb-4">{initial ? 'Edit Company' : 'Add Company'}</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Name</label>
        <input className="input input-bordered w-full text-black" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Industry</label>
        <input className="input input-bordered w-full text-black" value={industry} onChange={e => setIndustry(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Website</label>
        <input className="input input-bordered w-full text-black" value={website} onChange={e => setWebsite(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Notes</label>
        <textarea className="textarea textarea-bordered w-full text-black" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
