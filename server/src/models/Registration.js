import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    verificationHash: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    registrationType: {
      type: String,
      enum: ['Individual', 'Team'],
      default: 'Individual',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Checked-In', 'Cancelled'],
      default: 'Confirmed',
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    gateDesk: {
      type: String,
      default: 'Gate A - Registration Desk',
    },
  },
  { timestamps: true }
);

// Prevent duplicate individual registration for the same event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
