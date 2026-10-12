import React, { useState } from 'react';
import AssetCard from '../components/AssetCard.jsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  Cpu,
  Search,
  QrCode,
  Printer,
  X,
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
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Asset Registry
          </h1>
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              background: '#f1f5f9',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            {filteredAssets.length} Registered
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="tool-panel"
        style={{
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          <select
            className="form-select"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
          >
            {rooms.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Labs' : r}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px', flex: '1', maxWidth: '340px' }}>
          <Search
            size={14}
            color="#94a3b8"
            style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search Tag, CPU, Specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '1.9rem', width: '100%', fontSize: '0.82rem', paddingBlock: '0.35rem' }}
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

      {/* Bench QR Sticker Modal */}
      {qrModalAsset && (
        <div className="modal-overlay" onClick={() => setQrModalAsset(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <QrCode size={16} />
                Bench QR Tag
              </h3>
              <button
                onClick={() => setQrModalAsset(null)}
                style={{ background: 'transparent', color: '#94a3b8' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '1.25rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.25rem' }}>
                  SFIT &bull; Department of Information Technology
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0f172a', marginBottom: '0.15rem' }}>
                  {qrModalAsset.assetTag}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
                  {qrModalAsset.name} &bull; {qrModalAsset.labRoom}
                </div>

                {/* QR Code */}
                <div style={{ display: 'inline-block', padding: '8px', background: '#fff' }}>
                  <QRCodeSVG
                    value={JSON.stringify({
                      tag: qrModalAsset.assetTag,
                      name: qrModalAsset.name,
                      room: qrModalAsset.labRoom,
                      systemId: qrModalAsset._id,
                    })}
                    size={150}
                    level="H"
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                >
                  <Printer size={14} />
                  Print Tag
                </button>
                <button
                  onClick={() => {
                    const a = qrModalAsset;
                    setQrModalAsset(null);
                    onReportFault(a);
                  }}
                  className="btn-primary"
                  style={{ flex: 1.2, fontSize: '0.8rem' }}
                >
                  <Wrench size={14} />
                  Report Fault
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
