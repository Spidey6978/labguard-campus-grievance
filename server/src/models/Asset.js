import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide asset equipment name'],
      trim: true,
    },
    labRoom: {
      type: String,
      required: true,
      default: 'Lab 304 - Computer Center 3',
    },
    category: {
      type: String,
      enum: ['Workstation', 'Networking', 'AV & Projector', 'Lab Hardware', 'Electrical / UPS'],
      default: 'Workstation',
    },
    specs: {
      type: String,
      default: 'Intel Core i7-13700, 32GB RAM, 1TB NVMe SSD',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Operational', 'Degraded', 'Under Maintenance', 'Decommissioned'],
      default: 'Operational',
    },
    activeTickets: {
      type: Number,
      default: 0,
    },
    totalIncidents: {
      type: Number,
      default: 0,
    },
    lastAuditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Asset', assetSchema);
