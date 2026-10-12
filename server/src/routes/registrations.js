import express from 'express';
import crypto from 'crypto';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Team from '../models/Team.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate a unique Ticket ID
const generateTicketId = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MSK26-${randomStr}`;
};

// Helper to generate tamper-evident QR verification token
const generateVerificationHash = (ticketId, userId, eventId) => {
  return crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'mosaic_super_secret_jwt_key_2026')
    .update(`${ticketId}:${userId}:${eventId}:${Date.now()}`)
    .digest('hex');
};

// @route   POST /api/registrations/register
// @desc    Register for an event (Individual or Team)
router.post('/register', protect, async (req, res) => {
  try {
    const { eventId, teamId } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Please provide eventId' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is full
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Registration closed. Event is at full capacity!' });
    }

    // Check if already registered
    const existing = await Registration.findOne({ user: req.user._id, event: eventId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event. Check "My Passes" to view your ticket.',
        ticketId: existing.ticketId,
      });
    }

    let teamObj = null;
    let registrationType = 'Individual';

    if (event.type === 'Team') {
      if (!teamId) {
        return res.status(400).json({
          success: false,
          message: 'This is a team event. Please create or join a team first, then confirm registration.',
        });
      }

      teamObj = await Team.findById(teamId);
      if (!teamObj) {
        return res.status(404).json({ success: false, message: 'Specified team not found' });
      }

      // Verify the user belongs to the team
      const isMember = teamObj.members.some((m) => m.user.toString() === req.user._id.toString());
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'You are not a registered member of this team' });
      }

      registrationType = 'Team';
    }

    const ticketId = generateTicketId();
    const verificationHash = generateVerificationHash(ticketId, req.user._id, event._id);

    const registration = await Registration.create({
      ticketId,
      verificationHash,
      user: req.user._id,
      event: event._id,
      team: teamObj ? teamObj._id : null,
      registrationType,
      status: 'Confirmed',
    });

    // Update event registration count
    event.registeredCount += 1;
    if (event.registeredCount >= event.capacity) {
      event.status = 'Full';
    } else if (event.registeredCount >= event.capacity * 0.8) {
      event.status = 'Filling Fast';
    }
    await event.save();

    await registration.populate('user', 'name email usn college department');
    await registration.populate('event', 'title code venue date time category duration prizePool');
    if (teamObj) {
      await registration.populate('team', 'name teamCode members');
    }

    res.status(201).json({
      success: true,
      message: 'Event pass generated successfully! Your official Mosaic pass is ready.',
      data: registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/registrations/my-passes
// @desc    Get all passes for the logged in student
router.get('/my-passes', protect, async (req, res) => {
  try {
    const passes = await Registration.find({ user: req.user._id })
      .populate('event', 'title code venue date time category duration prizePool gradient status')
      .populate({
        path: 'team',
        populate: { path: 'members.user', select: 'name usn college' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: passes.length, data: passes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/registrations/roster
// @desc    Get attendee roster for organizers/admins (with filtering & search)
router.get('/roster', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { eventId, status, search } = req.query;
    let query = {};

    if (eventId && eventId !== 'All') {
      query.event = eventId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .populate('user', 'name email usn college department phone')
      .populate('event', 'title code venue date time category')
      .populate('team', 'name teamCode')
      .populate('checkedInBy', 'name')
      .sort({ createdAt: -1 });

    // Client-side text filtering if search provided
    let results = registrations;
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.ticketId.toLowerCase().includes(q) ||
          r.user?.name?.toLowerCase().includes(q) ||
          r.user?.usn?.toLowerCase().includes(q) ||
          r.user?.email?.toLowerCase().includes(q) ||
          r.event?.title?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
