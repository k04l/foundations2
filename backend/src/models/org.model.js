import mongoose from 'mongoose';

const OrgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Org', OrgSchema);
