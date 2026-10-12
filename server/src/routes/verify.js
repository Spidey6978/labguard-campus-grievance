import express from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/verify/scan
// @desc    Live Gate Desk QR Pass Verification & Accreditation Check
router.post('/scan', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { qrPayload, ticketId } = req.body;

    let searchCode = ticketId ? ticketId.trim().toUpperCase() : '';

    // If a full QR payload was scanned, parse it
    if (qrPayload) {
      try {
        const parsed = JSON.parse(qrPayload);
        if (parsed.ticketId) searchCode = parsed.ticketId.trim().toUpperCase();
        else if (parsed.t) searchCode = parsed.t.trim().toUpperCase();
      } catch (e) {
        // Raw string might be the ticket ID itself
        searchCode = qrPayload.trim().toUpperCase();
      }
    }

    if (!searchCode) {
      return res.status(400).json({
        success: false,
        status: 'INVALID',
        message: 'No readable ticket code or QR payload detected.',
      });
    }

    // Find registration record
    const registration = await Registration.findOne({
      $or: [{ ticketId: searchCode }, { verificationHash: searchCode }],
    })
      .populate('user', 'name email usn college department phone')
      .populate('event', 'title code venue date time category')
      .populate('team', 'name teamCode')
      .populate('checkedInBy', 'name');

    if (!registration) {
      return res.status(404).json({
        success: false,
        status: 'INVALID',
        scannedCode: searchCode,
        message: 'SECURITY ALERT: Unrecognized or counterfeit pass! No registration record found in database.',
      });
    }

    // Anti-Fraud: Check if already checked in
    if (registration.status === 'Checked-In') {
      const formattedTime = registration.checkedInAt
        ? new Date(registration.checkedInAt).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : 'Earlier';

      return res.status(409).json({
        success: false,
        status: 'ALREADY_CHECKED_IN',
        message: `DUPLICATE SCAN DETECTED! Pass was already verified at ${formattedTime} by ${
          registration.checkedInBy?.name || 'Gate Desk'
        }. Entry denied for duplicate pass.`,
        data: registration,
      });
    }

    // Pass is valid! Perform Check-In
    registration.status = 'Checked-In';
    registration.checkedInAt = new Date();
    registration.checkedInBy = req.user._id;
    await registration.save();

    // Increment checkedInCount on the Event
    await Event.findByIdAndUpdate(registration.event._id, {
      $inc: { checkedInCount: 1 },
    });

    // Populate checkedInBy with current user's name
    await registration.populate('checkedInBy', 'name');

    res.json({
      success: true,
      status: 'VALID',
      message: `Accreditation Confirmed! Welcome ${registration.user?.name || 'Student'} to Mosaic 2026.`,
      data: registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, status: 'ERROR', message: error.message });
  }
});

// @route   GET /api/verify/stats
// @desc    Live Dashboard Stats & Turnout Analytics for Fest Organizers
router.get('/stats', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalCheckedIn = await Registration.countDocuments({ status: 'Checked-In' });

    const turnoutRate = totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0;

    // Events breakdown
    const events = await Event.find().select('title code capacity registeredCount checkedInCount status category');

    // Aggregate by department
    const deptAgg = await Registration.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      { $unwind: '$userData' },
      {
        $group: {
          _id: '$userData.department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const departmentBreakdown = deptAgg.map((item) => ({
      department: item._id || 'General',
      registrations: item.count,
    }));

    res.json({
      success: true,
      data: {
        totalEvents,
        totalRegistrations,
        totalCheckedIn,
        pendingCheckIn: totalRegistrations - totalCheckedIn,
        turnoutRate,
        events,
        departmentBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
