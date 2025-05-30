// backend/src/models/company.model.js
import mongoose from 'mongoose';

const IndividualSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  notes: String,
  id: { type: String, required: true },
});

const AttachmentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: String,
  fileName: String,
});

const FluidFlowSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: String,
  fields: { type: mongoose.Schema.Types.Mixed },
});

const EquipmentOptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: String,
  equipmentTag: String,
  commonFields: { type: mongoose.Schema.Types.Mixed },
  fluidFlows: [FluidFlowSchema],
  attachments: [AttachmentSchema],
});

const EquipmentGroupSchema = new mongoose.Schema({
  id: { type: String, required: true },
  tag: String,
  options: [EquipmentOptionSchema],
});

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  address: String,
  city: String,
  localASHRAEWeatherStation: String,
  costPerKwh: String,
  costPerGpm: String,
  costPerGpmSewer: String,
  costPerMbtuGas: String,
  equipmentGroups: [EquipmentGroupSchema],
  peopleIds: [String],
  description: String,
});

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: String,
  website: String,
  notes: String,
  id: { type: String, required: true, unique: true },
  individuals: [IndividualSchema],
  projects: [ProjectSchema],
});

export default mongoose.model('Company', CompanySchema);
