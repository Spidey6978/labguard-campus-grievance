import express from 'express';
import Event from '../models/Event.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with optional filters (category, type, search)
router.get('/', async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID or Code
router.get('/:id', async (req, res) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const event = isObjectId
      ? await Event.findById(req.params.id)
      : await Event.findOne({ code: req.params.id.toUpperCase() });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/events
// @desc    Create a new event (Organizer/Admin only)
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event (Organizer/Admin only)
router.put('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (Organizer/Admin only)
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
