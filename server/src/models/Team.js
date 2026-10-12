import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide team name'],
      trim: true,
    },
    teamCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['Leader', 'Member'],
          default: 'Member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    maxSize: {
      type: Number,
      default: 4,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);
