import express from 'express';
import jwt from 'jsonwebtoken';
import Ticket from '../models/Ticket.js';
import Asset from '../models/Asset.js';
import User from '../models/User.js';
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
// @desc    Get tickets reported by logged-in student (with demo fallback)
router.get('/my', async (req, res) => {
  try {
    let studentId = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'labguard_super_secret_jwt_key_2026');
        studentId = decoded.id;
      } catch (e) {}
    }

    let query = {};
    if (studentId) {
      query.reportedBy = studentId;
    } else {
      const veerUser = await User.findOne({ email: 'veer@sfit.ac.in' });
      if (veerUser) query.reportedBy = veerUser._id;
    }

    const tickets = await Ticket.find(query)
      .populate('asset', 'assetTag name labRoom category status specs')
      .populate('assignedTo', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/tickets/:idOrNumber
// @desc    Get single ticket with full timeline by Mongo ID or ticketNumber (e.g. TKT26-CRIT14)
router.get('/:idOrNumber', async (req, res) => {
  try {
    const param = req.params.idOrNumber.trim();
    const isObjectId = param.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: param } : { ticketNumber: param.toUpperCase() };

    const ticket = await Ticket.findOne(query)
      .populate('asset', 'assetTag name labRoom category specs status ipAddress')
      .populate('reportedBy', 'name usn department email phone')
      .populate('assignedTo', 'name phone email')
      .populate('timeline.updatedBy', 'name role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: `Ticket '${param}' not found` });
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

// @route   DELETE /api/tickets/:id
// @desc    Permanently delete a ticket (fraudulent / invalid / spam report) - Technician and HOD Admin only
router.delete('/:id', protect, authorize('technician', 'admin'), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticketNumber = ticket.ticketNumber;
    const assetId = ticket.asset;

    // Synchronize asset health and telemetry counters
    if (assetId) {
      const asset = await Asset.findById(assetId);
      if (asset) {
        if (['Reported', 'Assigned', 'In-Progress'].includes(ticket.status)) {
          asset.activeTickets = Math.max(0, (asset.activeTickets || 1) - 1);
          asset.totalIncidents = Math.max(0, (asset.totalIncidents || 1) - 1);

          // Check if any other open incidents remain on this workstation
          const otherActive = await Ticket.countDocuments({
            asset: assetId,
            _id: { $ne: ticket._id },
            status: { $in: ['Reported', 'Assigned', 'In-Progress'] },
          });

          if (otherActive === 0) {
            asset.status = 'Operational';
          }
        } else {
          // If already resolved or closed, decrement incident history counter
          asset.totalIncidents = Math.max(0, (asset.totalIncidents || 1) - 1);
        }
        await asset.save();
      }
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Ticket ${ticketNumber} permanently deleted as fraudulent/invalid. Workstation health counters synchronized.`,
      ticketId: req.params.id,
      ticketNumber,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
