import express from 'express';
import Asset from '../models/Asset.js';
import Ticket from '../models/Ticket.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/assets
// @desc    List all lab assets with room and category filtering
router.get('/', async (req, res) => {
  try {
    const { labRoom, category, status, search } = req.query;
    let query = {};

    if (labRoom && labRoom !== 'All') {
      query.labRoom = labRoom;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { assetTag: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { specs: { $regex: search, $options: 'i' } },
        { labRoom: { $regex: search, $options: 'i' } },
      ];
    }

    const assets = await Asset.find(query).sort({ assetTag: 1 });
    res.json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/assets/:tagOrId
// @desc    Fetch asset details by Asset Tag (QR payload) or Mongo ID
router.get('/:tagOrId', async (req, res) => {
  try {
    const param = req.params.tagOrId.trim();
    const isObjectId = param.match(/^[0-9a-fA-F]{24}$/);

    const asset = isObjectId
      ? await Asset.findById(param)
      : await Asset.findOne({ assetTag: param.toUpperCase() });

    if (!asset) {
      return res.status(404).json({ success: false, message: `Asset '${param}' not found in registry.` });
    }

    // Also fetch recent tickets for this asset
    const recentTickets = await Ticket.find({ asset: asset._id })
      .populate('reportedBy', 'name usn department')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, data: asset, history: recentTickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/assets
// @desc    Register a new hardware asset (Admin/Technician only)
router.post('/', protect, authorize('admin', 'technician'), async (req, res) => {
  try {
    const { assetTag, name, labRoom, category, specs, ipAddress } = req.body;

    if (!assetTag || !name || !labRoom) {
      return res.status(400).json({ success: false, message: 'Please provide assetTag, name, and labRoom' });
    }

    const existing = await Asset.findOne({ assetTag: assetTag.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Asset tag '${assetTag}' is already registered.` });
    }

    const asset = await Asset.create({
      assetTag: assetTag.toUpperCase(),
      name,
      labRoom,
      category: category || 'Workstation',
      specs: specs || '',
      ipAddress: ipAddress || '',
      status: 'Operational',
    });

    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
