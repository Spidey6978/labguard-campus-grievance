import express from 'express';
import Team from '../models/Team.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate a crisp unique 6-character team code
const generateTeamCode = (eventCode) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const prefix = eventCode ? eventCode.replace('MOSAIC-', '').slice(0, 4) : 'TEAM';
  return `${prefix}-${rand}`;
};

// @route   POST /api/teams/create
// @desc    Create a new team for a team-based event
router.post('/create', protect, async (req, res) => {
  try {
    const { name, eventId } = req.body;

    if (!name || !eventId) {
      return res.status(400).json({ success: false, message: 'Please provide team name and eventId' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.type !== 'Team') {
      return res.status(400).json({ success: false, message: 'This event only accepts individual registrations' });
    }

    // Check if user is already in a team for this event
    const existingTeam = await Team.findOne({
      event: eventId,
      'members.user': req.user._id,
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: `You are already a member of team "${existingTeam.name}" for this event`,
      });
    }

    const teamCode = generateTeamCode(event.code);

    const team = await Team.create({
      name,
      teamCode,
      event: eventId,
      leader: req.user._id,
      maxSize: event.teamSize?.max || 4,
      members: [
        {
          user: req.user._id,
          role: 'Leader',
          joinedAt: new Date(),
        },
      ],
    });

    await team.populate('members.user', 'name email usn college department');
    await team.populate('event', 'title code venue date time');

    res.status(201).json({
      success: true,
      message: 'Team created successfully! Share your team code with your teammates.',
      data: team,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/teams/join
// @desc    Join an existing team using teamCode
router.post('/join', protect, async (req, res) => {
  try {
    const { teamCode } = req.body;

    if (!teamCode) {
      return res.status(400).json({ success: false, message: 'Please provide team code' });
    }

    const team = await Team.findOne({ teamCode: teamCode.trim().toUpperCase() });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Invalid team code. Team not found.' });
    }

    // Check if user is already in the team
    const alreadyInTeam = team.members.some((m) => m.user.toString() === req.user._id.toString());
    if (alreadyInTeam) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }

    // Check capacity
    if (team.members.length >= team.maxSize) {
      return res.status(400).json({ success: false, message: `Team is full (Max ${team.maxSize} members allowed)` });
    }

    // Check if user is in any other team for this event
    const otherTeam = await Team.findOne({
      event: team.event,
      'members.user': req.user._id,
    });
    if (otherTeam) {
      return res.status(400).json({
        success: false,
        message: `You are already part of team "${otherTeam.name}" for this event`,
      });
    }

    team.members.push({
      user: req.user._id,
      role: 'Member',
      joinedAt: new Date(),
    });

    await team.save();
    await team.populate('members.user', 'name email usn college department');
    await team.populate('event', 'title code venue date time');

    res.json({
      success: true,
      message: `Successfully joined team "${team.name}"!`,
      data: team,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teams/my
// @desc    Get all teams the current user belongs to
router.get('/my', protect, async (req, res) => {
  try {
    const teams = await Team.find({ 'members.user': req.user._id })
      .populate('event', 'title code venue date time category status')
      .populate('members.user', 'name email usn college department')
      .populate('leader', 'name email');

    res.json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
