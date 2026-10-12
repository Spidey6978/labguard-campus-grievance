import React, { useState } from 'react';
import AssetCard from '../components/AssetCard.jsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  Cpu,
  Search,
  Filter,
  QrCode,
  Printer,
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Wrench,
} from 'lucide-react';

export default function AssetDirectoryPage({ assets, onReportFault }) {
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [qrModalAsset, setQrModalAsset] = useState(null);

  const rooms = [
    'All',
    'Lab 304 - Computer Center 3',
    'Lab 402 - AI & ML Research Center',
    'Lab 201 - VLSI & Embedded Systems',
    'Multimedia Seminar Hall B',
    'Server & Power Distribution Room',
  ];

  const categories = ['All', 'Workstation', 'Networking', 'AV & Projector', 'Lab Hardware', 'Electrical / UPS'];

  const filteredAssets = assets.filter((a) => {
    const matchesRoom = selectedRoom === 'All' || a.labRoom === selectedRoom;
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.assetTag.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.specs.toLowerCase().includes(q) ||
      a.labRoom.toLowerCase().includes(q);

    return matchesRoom && matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.2rem',
          }}
        >
          SFIT &bull; Department of Information Technology
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f0f6fc', letterSpacing: '-0.02em' }}>
          Laboratory Asset Registry
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Audited computing workstations, network racks, and lab equipment with bench QR stickers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <select
            className="form-select"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            {rooms.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Lab Rooms' : r}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Equipment Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search
            size={16}
            color="var(--text-subtle)"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search Asset Tag, CPU, Specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '6px' }}
          />
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid-cards">
        {filteredAssets.map((asset) => (
          <AssetCard
            key={asset._id}
            asset={asset}
            onViewQR={(a) => setQrModalAsset(a)}
            onReportFault={onReportFault}
          />
        ))}
      </div>

      {/* Dynamic Bench QR Sticker Modal */}
      {qrModalAsset && (
        <div className="modal-overlay" onClick={() => setQrModalAsset(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <QrCode size={18} color="var(--accent-cyan)" />
                Bench QR Asset Tag
              </h3>
              <button
                onClick={() => setQrModalAsset(null)}
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Physical Bench Sticker */}
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div
                style={{
                  background: '#ffffff',
                  color: '#07090e',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  marginBottom: '1.5rem',
                  border: '2px solid #00f2fe',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', marginBottom: '0.35rem' }}>
                  SFIT &bull; Department of Computer Engineering
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#090d16', marginBottom: '0.2rem' }}>
                  {qrModalAsset.assetTag}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem' }}>
                  {qrModalAsset.name} &bull; {qrModalAsset.labRoom}
                </div>

                {/* The QR Code */}
                <div style={{ display: 'inline-block', padding: '10px', background: '#fff' }}>
                  <QRCodeSVG
                    value={JSON.stringify({
                      tag: qrModalAsset.assetTag,
                      name: qrModalAsset.name,
                      room: qrModalAsset.labRoom,
                      systemId: qrModalAsset._id,
                    })}
                    size={160}
                    level="H"
                  />
                </div>

                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.85rem' }}>
                  Scan to file instant maintenance ticket or view specs.
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.85rem' }}
                >
                  <Printer size={15} />
                  Print Bench Sticker
                </button>
                <button
                  onClick={() => {
                    const a = qrModalAsset;
                    setQrModalAsset(null);
                    onReportFault(a);
                  }}
                  className="btn-primary"
                  style={{ flex: 1.2, fontSize: '0.85rem' }}
                >
                  <Wrench size={15} />
                  Report Fault on Bench
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
