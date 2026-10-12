# 🛠️ LABGUARD &mdash; Institutional Lab Asset & Campus Equipment Grievance SLA Desk
> **Academic Project Title:** *Automated Laboratory Equipment Maintenance, Dynamic QR Bench Auditing & Grievance SLA Resolution Desk*  
> **Institutional Context:** Department of Information Technology (INFT) &bull; St. Francis Institute of Technology (SFIT), Borivali, Mumbai  
> **Accreditation Utility:** NBA Criterion 4 (Facilities & Technical Support) &amp; NAAC Institutional Infrastructure Audits  
> **Tech Stack:** MERN (MongoDB 8.0, Express 4.21, React 19, Node 22, Vite, Web Audio API)

---

## 🎯 Academic Problem Statement & Faculty Defense (Viva Gold)
In engineering colleges, computer labs, embedded workshops, and smart seminar halls suffer from frequent hardware breakdowns:
1. **Broken Workstations & BSOD Loops:** Systems sit unusable for weeks because students or lab attendees only write complaints in physical logbooks that faculty and technicians rarely inspect.
2. **Lack of Maintenance Accountability:** No SLA (Service Level Agreement) turnaround timer exists; chronic hardware failures repeat without records.
3. **Accreditation Gaps:** During NBA/NAAC peer-team inspections, departments scramble to produce equipment maintenance and downtime resolution logs.

### How LabGuard Solves This:
* **Workstation Dynamic QR Asset Tags:** Every PC and instrument bench features a dynamic QR tag (e.g. `CC3-PC-14`). Anyone can scan it on their phone or camera to view equipment specs and file a grievance in 5 seconds.
* **Tiered SLA State Machine:** Critical issues (lab batch blockers) carry a strict 24h SLA countdown; High: 48h; Medium: 72h; Low: 120h.
* **Technician Triage Desk:** Lab assistants triage issues from `Reported` &rarr; `In-Progress` &rarr; `Resolved / Bench Certified`, logging replaced parts (e.g. RAM sticks, SATA cables, patch leads).
* **Automated Asset State Synchronization:** Resolving all pending tickets automatically restores the workstation back to `Operational`.
* **HOD / NBA Compliance Analytics & CSV Audit Export:** 1-Click export of official departmental maintenance audit logs with MTTR (Mean Time to Resolution) metrics and lemon analysis (chronic repeat failure hardware).

---

## 🔑 Demo & Viva Evaluation Credentials

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **🎓 Student (Reporter)** | Rahul Sharma | `rahul@sfit.ac.in` | `student123` | PID: `221089` &bull; Report faults & track tickets |
| **🔧 Lab Technician** | Ramesh Kumar | `ramesh.tech@sfit.ac.in` | `tech123` | Hardware Desk &bull; Triage queue & log replaced parts |
| **👔 HOD / Faculty Admin** | Dr. S. N. Sharma | `hod.inft@sfit.ac.in` | `admin123` | Central Admin &bull; MTTR SLA analytics & CSV exports |

> 💡 **Quick Switch Shortcut:** The top navigation bar features a dropdown to switch between **Student**, **Technician**, and **HOD Admin** instantly with one click during viva evaluation!

---

## ⚡ 1-Click Viva Test Scenarios

1. **Student Fault Reporting Flow:**
   * Click **Report Fault** &rarr; Select `CC3-PC-14` &rarr; Category `Hardware / Motherboard` &rarr; Priority `Critical (24h SLA)`.
   * Click **Dispatch Maintenance Ticket** &rarr; Hears chime, sees celebration confetti, and receives official ticket code (`TKT26-XXXX`).
2. **Technician Triage Flow:**
   * Switch role to **Lab Technician** (top navbar) &rarr; Go to **Triage Desk**.
   * Click **Update Triage** on the open ticket &rarr; Change status to `Resolved` &rarr; Enter repair note: *"Replaced 8GB DDR5 RAM module & stress test passed"*.
   * Commit &rarr; Asset status automatically switches back to `Operational`!
3. **HOD / NBA Audit Export:**
   * Switch role to **HOD Admin** &rarr; Open **HOD Analytics**.
   * Observe Fleet Uptime (94.2%), Average MTTR turnaround (14.5h), and Chronic Lemon assets.
   * Click **Export NBA Audit CSV Log** &rarr; Downloads official CSV spreadsheet instantly for evaluation files.
4. **Bench QR Tag Inspection:**
   * Go to **Asset Registry & QR** &rarr; Click **Bench QR** on any workstation to view the printable laboratory asset sticker with live dynamic QR code.

---

## 🚀 How to Run Locally

```bash
# Terminal 1: Backend API (Node + Express + MongoDB)
cd server
node src/index.js
# Running on http://localhost:5000

# Terminal 2: Frontend Client (Vite + React)
cd client
npm run dev
# Running on http://localhost:5173
```
*(Uses MongoDB service on port 27017 or seamlessly connects to embedded In-Memory database if service is stopped)*

---

## ☁️ Deploying to Vercel
1. Run `vercel.cmd` from the root directory.
2. In Vercel Project Environment Variables, configure:
   * `MONGODB_URI`: Your MongoDB Atlas connection URI.
   * `JWT_SECRET`: Any custom secret string.
3. Deploy!
