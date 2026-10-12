import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Asset from './models/Asset.js';
import Ticket from './models/Ticket.js';

dotenv.config();

export async function seedData() {
  try {
    console.log('🌱 Seeding LabGuard: Institutional Lab Asset & Grievance Database...');

    // Clear existing collections
    await User.deleteMany({});
    await Asset.deleteMany({});
    await Ticket.deleteMany({});

    // 1. Create Users
    const student = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@sfit.ac.in',
      password: 'student123',
      role: 'student',
      usn: 'PID-221089',
      college: 'St. Francis Institute of Technology (SFIT), Mumbai',
      department: 'Information Technology (INFT)',
      phone: '+91 98840 12345',
    });

    const technician = await User.create({
      name: 'Ramesh Kumar (Lab Tech)',
      email: 'ramesh.tech@sfit.ac.in',
      password: 'tech123',
      role: 'technician',
      usn: 'SFIT-TECH-04',
      college: 'St. Francis Institute of Technology (SFIT), Mumbai',
      department: 'Information Technology (INFT)',
      phone: '+91 97720 98765',
    });

    const admin = await User.create({
      name: 'Dr. S. N. Sharma (HOD / Lab In-Charge)',
      email: 'hod.inft@sfit.ac.in',
      password: 'admin123',
      role: 'admin',
      usn: 'SFIT-HOD-01',
      college: 'St. Francis Institute of Technology (SFIT), Mumbai',
      department: 'Information Technology (INFT)',
      phone: '+91 99001 55443',
    });

    console.log('✅ Demo Users created (Student, Lab Technician, HOD Admin)');

    // 2. Create Lab Assets
    const assets = await Asset.create([
      {
        assetTag: 'CC3-PC-14',
        name: 'Workstation #14 - HP Z2 G9 Tower',
        labRoom: 'Lab 304 - Computer Center 3',
        category: 'Workstation',
        specs: 'Intel Core i7-13700, 32GB DDR5 RAM, 1TB NVMe, RTX 3060',
        ipAddress: '192.168.104.14',
        status: 'Under Maintenance',
        activeTickets: 1,
        totalIncidents: 3,
      },
      {
        assetTag: 'CC3-PC-18',
        name: 'Workstation #18 - HP Z2 G9 Tower',
        labRoom: 'Lab 304 - Computer Center 3',
        category: 'Workstation',
        specs: 'Intel Core i7-13700, 32GB DDR5 RAM, 1TB NVMe, RTX 3060',
        ipAddress: '192.168.104.18',
        status: 'Operational',
        activeTickets: 0,
        totalIncidents: 0,
      },
      {
        assetTag: 'CC3-SWITCH-01',
        name: 'Cisco Catalyst 3850 48-Port Gigabit Switch',
        labRoom: 'Lab 304 - Computer Center 3',
        category: 'Networking',
        specs: '48x 10/100/1000 PoE+ Ports, 4x 10G SFP+ Uplinks',
        ipAddress: '192.168.104.1',
        status: 'Operational',
        activeTickets: 0,
        totalIncidents: 1,
      },
      {
        assetTag: 'AI-GPU-04',
        name: 'Deep Learning Workstation #4 - Dell Precision',
        labRoom: 'Lab 402 - AI & ML Research Center',
        category: 'Workstation',
        specs: 'Intel Xeon W5-2455X, 64GB ECC RAM, Dual NVIDIA RTX 4090 24GB',
        ipAddress: '192.168.112.4',
        status: 'Degraded',
        activeTickets: 1,
        totalIncidents: 2,
      },
      {
        assetTag: 'AUDI-PROJ-01',
        name: 'Epson EB-L1495U 4K Laser Cinema Projector',
        labRoom: 'Multimedia Seminar Hall B',
        category: 'AV & Projector',
        specs: '9000 Lumens WUXGA 3LCD, Dual HDMI 2.1, HDBaseT',
        ipAddress: '192.168.120.10',
        status: 'Under Maintenance',
        activeTickets: 1,
        totalIncidents: 2,
      },
      {
        assetTag: 'VLSI-KIT-07',
        name: 'Digilent Nexys A7 FPGA Development Bench',
        labRoom: 'Lab 201 - VLSI & Embedded Systems',
        category: 'Lab Hardware',
        specs: 'Xilinx Artix-7 XC7A100T, USB-JTAG, 128MB DDR2, Dual Pmod',
        status: 'Operational',
        activeTickets: 0,
        totalIncidents: 1,
      },
      {
        assetTag: 'IOT-BENCH-03',
        name: 'LoRaWAN Multi-Sensor Industrial Testbed',
        labRoom: 'Lab 205 - IoT Innovation Lab',
        category: 'Lab Hardware',
        specs: 'SX1302 8-Channel Gateway, 6x STM32 Node Sensors',
        status: 'Operational',
        activeTickets: 0,
        totalIncidents: 0,
      },
      {
        assetTag: 'CC2-UPS-01',
        name: 'APC Symmetra LX 16kVA Modular UPS',
        labRoom: 'Server & Power Distribution Room',
        category: 'Electrical / UPS',
        specs: 'N+1 Redundant Battery Modules, 230V Split-Phase',
        status: 'Operational',
        activeTickets: 0,
        totalIncidents: 1,
      },
    ]);

    console.log(`✅ ${assets.length} Campus Lab Assets registered`);

    // 3. Create Realistic Grievances / Tickets in different workflow states
    const asset1 = assets[0]; // CC3-PC-14 (Under Maintenance)
    const asset4 = assets[3]; // AI-GPU-04 (Degraded)
    const asset5 = assets[4]; // AUDI-PROJ-01 (Under Maintenance)
    const asset3 = assets[2]; // Switch (Resolved)

    // Ticket 1: Critical - In Progress
    await Ticket.create({
      ticketNumber: 'TKT26-CRIT14',
      asset: asset1._id,
      reportedBy: student._id,
      assignedTo: technician._id,
      title: 'Persistent BSOD loop (KERNEL_DATA_INPAGE_ERROR) on boot',
      description:
        'System fails during morning OS lab batch. Shows blue screen crash within 2 minutes of logging into Windows. Storage drive LED blinks intermittently.',
      issueCategory: 'Hardware / Motherboard / RAM',
      priority: 'Critical',
      status: 'In-Progress',
      slaDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hrs left
      partsReplaced: 'Replaced SATA connection cable; running MemTest86 diagnostic suite.',
      timeline: [
        {
          status: 'Reported',
          note: 'Incident reported by Rahul Sharma (PID-221089) during INFT Lab Batch 2.',
          updatedBy: student._id,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          status: 'In-Progress',
          note: 'Technician Ramesh Kumar inspected bench. Suspected loose RAM channel or faulty SSD cable.',
          updatedBy: technician._id,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
      ],
    });

    // Ticket 2: High - Reported (Awaiting Tech Triage)
    await Ticket.create({
      ticketNumber: 'TKT26-DISP05',
      asset: asset5._id,
      reportedBy: student._id,
      title: 'Projector HDMI 2 port loose, display flickers red tint',
      description:
        'Faculty laptop unable to maintain stable signal during technical seminar. Image turns heavily tinted magenta/red and cuts off every 30 seconds.',
      issueCategory: 'AV / Projector / HDMI',
      priority: 'High',
      status: 'Reported',
      slaDeadline: new Date(Date.now() + 36 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Reported',
          note: 'Reported prior to departmental guest lecture.',
          updatedBy: student._id,
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        },
      ],
    });

    // Ticket 3: Medium - In-Progress
    await Ticket.create({
      ticketNumber: 'TKT26-CUDA04',
      asset: asset4._id,
      reportedBy: student._id,
      assignedTo: technician._id,
      title: 'NVIDIA GPU 2 driver PCIe bus error & thermal throttling',
      description:
        'Deep learning training script throws CUDA Out of Memory & NVML PCIe error code 43 on secondary GPU. Fan spinning at 100%.',
      issueCategory: 'Software / OS / BlueScreen',
      priority: 'Medium',
      status: 'In-Progress',
      slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Reported',
          note: 'Reported by M.Tech research scholar.',
          updatedBy: student._id,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
        {
          status: 'In-Progress',
          note: 'Cleaned GPU heat sink dust filters, re-seating PCIe riser cable.',
          updatedBy: technician._id,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ],
    });

    // Ticket 4: Resolved (Past Incident to verify MTTR & history)
    await Ticket.create({
      ticketNumber: 'TKT26-RESV03',
      asset: asset3._id,
      reportedBy: student._id,
      assignedTo: technician._id,
      title: 'Port 14 through 20 packet loss on lab subnet',
      description: 'Patch cable RJ45 crimp had oxidized pins causing 35% packet drops.',
      issueCategory: 'Network / LAN Cable Drop',
      priority: 'Medium',
      status: 'Resolved',
      slaDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      resolutionNotes: 'Re-punched patch panel keystone jack and recrimped Cat6 gold pins. 0% loss verified with Fluke tester.',
      partsReplaced: 'Replaced 2x Cat6 patch leads (Blue 2m).',
      timeline: [
        {
          status: 'Reported',
          note: 'Reported by lab batch.',
          updatedBy: student._id,
          timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
        },
        {
          status: 'Resolved',
          note: 'Resolved & verified by Ramesh Kumar.',
          updatedBy: technician._id,
          timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
        },
      ],
    });

    console.log('✅ Demo Maintenance Grievances seeded (Critical, High, In-Progress, Resolved)');
    console.log('🎉 LabGuard Database Seed Complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

if (process.argv[1]?.includes('seed.js')) {
  (async () => {
    await connectDB();
    await seedData();
    process.exit(0);
  })();
}
