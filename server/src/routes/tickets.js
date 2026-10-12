import express from 'express';
import Ticket from '../models/Ticket.js';
import Asset from '../models/Asset.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const generateTicketNumber = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TKT26-${rand}`;
};

const getSlaHours = (priority) => {
  switch (priority) {
    case 'Critical':
      return 24; // 24 Hours SLA
    case 'High':
      return 48; // 48 Hours SLA
    case 'Medium':
      return 72; // 3 Days SLA
    case 'Low':
    default:
      return 120; // 5 Days SLA
  }
};

// @route   POST /api/tickets
// @desc    Report a new equipment grievance / incident
router.post('/', protect, async (req, res) => {
  try {
    const { assetId, assetTag, title, description, issueCategory, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Please provide issue title and symptom description' });
    }

    let targetAsset = null;
    if (assetId) {
      targetAsset = await Asset.findById(assetId);
    } else if (assetTag) {
      targetAsset = await Asset.findOne({ assetTag: assetTag.trim().toUpperCase() });
    }

    if (!targetAsset) {
      return res.status(404).json({ success: false, message: 'Equipment asset not found. Please provide valid Asset Tag.' });
    }

    const pr = priority || 'Medium';
    const slaHours = getSlaHours(pr);
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);
    const ticketNumber = generateTicketNumber();

    const ticket = await Ticket.create({
      ticketNumber,
      asset: targetAsset._id,
      reportedBy: req.user._id,
      title,
      description,
      issueCategory: issueCategory || 'Hardware / Motherboard / RAM',
      priority: pr,
      status: 'Reported',
      slaDeadline,
      timeline: [
        {
          status: 'Reported',
          note: `Incident filed by ${req.user.name} (${req.user.usn || req.user.role}). SLA set to ${slaHours}h.`,
          updatedBy: req.user._id,
          timestamp: new Date(),
        },
      ],
    });

    // Update asset status
    targetAsset.activeTickets += 1;
    targetAsset.totalIncidents += 1;
    targetAsset.status = pr === 'Critical' ? 'Under Maintenance' : 'Degraded';
    await targetAsset.save();

    await ticket.populate('asset', 'assetTag name labRoom category specs status');
    await ticket.populate('reportedBy', 'name usn department email phone');

    res.status(201).json({
      success: true,
      message: `Grievance registered under ${ticketNumber}. Technician dispatched within ${slaHours}h SLA.`,
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/tickets
// @desc    List all tickets with triage filters
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, search, labRoom } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (category && category !== 'All') {
      query.issueCategory = category;
    }

    const tickets = await Ticket.find(query)
      .populate('asset', 'assetTag name labRoom category status')
      .populate('reportedBy', 'name usn department email phone')
      .populate('assignedTo', 'name phone')
      .sort({ createdAt: -1 });

    let results = tickets;

    if (labRoom && labRoom !== 'All') {
      results = results.filter((t) => t.asset?.labRoom === labRoom);
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (t) =>
          t.ticketNumber?.toLowerCase().includes(q) ||
          t.title?.toLowerCase().includes(q) ||
          t.asset?.assetTag?.toLowerCase().includes(q) ||
          t.asset?.name?.toLowerCase().includes(q) ||
          t.reportedBy?.name?.toLowerCase().includes(q) ||
          t.reportedBy?.usn?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/tickets/my
// @desc    Get tickets reported by logged-in student
router.get('/my', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ reportedBy: req.user._id })
      .populate('asset', 'assetTag name labRoom category status specs')
      .populate('assignedTo', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get single ticket with full timeline
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('asset', 'assetTag name labRoom category specs status ipAddress')
      .populate('reportedBy', 'name usn department email phone')
      .populate('assignedTo', 'name phone email')
      .populate('timeline.updatedBy', 'name role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status, add resolution notes / parts replaced (Technician/Admin)
router.put('/:id/status', protect, authorize('technician', 'admin'), async (req, res) => {
  try {
    const { status, note, partsReplaced, resolutionNotes } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) {
      ticket.status = status;
    }

    if (resolutionNotes) {
      ticket.resolutionNotes = resolutionNotes;
    }

    if (partsReplaced) {
      ticket.partsReplaced = partsReplaced;
    }

    if (!ticket.assignedTo) {
      ticket.assignedTo = req.user._id;
    }

    if (status === 'Resolved' || status === 'Closed') {
      ticket.resolvedAt = new Date();

      // Check if other active tickets remain for this asset
      const otherActive = await Ticket.countDocuments({
        asset: ticket.asset,
        _id: { $ne: ticket._id },
        status: { $in: ['Reported', 'Assigned', 'In-Progress'] },
      });

      const asset = await Asset.findById(ticket.asset);
      if (asset) {
        asset.activeTickets = Math.max(0, asset.activeTickets - 1);
        if (otherActive === 0) {
          asset.status = 'Operational';
        }
        await asset.save();
      }
    }

    // Append timeline entry
    ticket.timeline.push({
      status: status || ticket.status,
      note: note || `Status updated to ${status} by ${req.user.name}.`,
      updatedBy: req.user._id,
      timestamp: new Date(),
    });

    await ticket.save();

    await ticket.populate('asset', 'assetTag name labRoom category status');
    await ticket.populate('reportedBy', 'name usn department email phone');
    await ticket.populate('assignedTo', 'name phone');

    res.json({
      success: true,
      message: `Ticket status successfully updated to ${ticket.status}.`,
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
