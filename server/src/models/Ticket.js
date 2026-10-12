import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Please provide issue title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the fault symptom'],
    },
    issueCategory: {
      type: String,
      enum: [
        'Hardware / Motherboard / RAM',
        'Software / OS / BlueScreen',
        'Peripherals (Mouse / Keyboard / Monitor)',
        'Network / LAN Cable Drop',
        'AV / Projector / HDMI',
        'Electrical / UPS / Power Trip',
      ],
      default: 'Hardware / Motherboard / RAM',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Reported', 'Assigned', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Reported',
    },
    slaDeadline: {
      type: Date,
      required: true,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    partsReplaced: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    timeline: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
