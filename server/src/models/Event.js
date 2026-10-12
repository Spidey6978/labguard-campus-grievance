import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    category: {
      type: String,
      enum: ['Hackathon', 'Coding', 'Robotics', 'Design', 'Gaming', 'Workshop', 'Flagship', 'Keynote'],
      default: 'Coding',
    },
    type: {
      type: String,
      enum: ['Individual', 'Team'],
      default: 'Individual',
    },
    teamSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 4 },
    },
    venue: {
      type: String,
      required: true,
      default: 'Main Campus Auditorium',
    },
    date: {
      type: String,
      default: 'March 28, 2026',
    },
    time: {
      type: String,
      default: '09:30 AM IST',
    },
    duration: {
      type: String,
      default: '3 Hours',
    },
    capacity: {
      type: Number,
      required: true,
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    checkedInCount: {
      type: Number,
      default: 0,
    },
    prizePool: {
      type: String,
      default: '₹20,000',
    },
    coordinator: {
      name: { type: String, default: 'Student Coordinator' },
      phone: { type: String, default: '+91 98765 43210' },
      email: { type: String, default: 'mosaic.desk@college.edu' },
    },
    rules: {
      type: [String],
      default: [],
    },
    gradient: {
      type: String,
      default: 'from-cyan-500 to-blue-600',
    },
    status: {
      type: String,
      enum: ['Open', 'Filling Fast', 'Full', 'Completed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
