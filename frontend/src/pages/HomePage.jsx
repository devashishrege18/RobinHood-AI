/**
 * HomePage — Gallery background with clear frosted glass center panel.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceMic from '../components/VoiceMic';
import FileUpload from '../components/FileUpload';

const IMAGES = [
  '/gallery/farmer-wheat.png',
  '/gallery/retailer-shop.png',
  '/gallery/mandi-market.png',
  '/gallery/tea-vendor.png',
  '/gallery/rice-paddy.png',
  '/gallery/textile-shop.png',
];

const ROWS = [
  [...IMAGES],
  [IMAGES[2], IMAGES[5], IMAGES[0], IMAGES[3], IMAGES[1], IMAGES[4]],
  [IMAGES[4], IMAGES[1], IMAGES[3], IMAGES[0], IMAGES[5], IMAGES[2]],
  [IMAGES[1], IMAGES[4], IMAGES[2], IMAGES[5], IMAGES[3], IMAGES[0]],
];

function GalleryRow({ images, anim }) {
  const doubled = [...images, ...images];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div className={anim} style={{ display: 'flex', gap: '10px', width: 'max-content' }}>
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            style={{
              height: '155px',
              width: '215px',
              objectFit: 'cover',
              borderRadius: '12px',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [voiceText, setVoiceText] = useState('');
  const [file, setFile] = useState(null);

  const handleFileSelect = (f) => setFile(f);
  const handleTranscript = (t) => setVoiceText(t);
  const handleAnalyze = () => navigate('/negotiate', { state: { voiceText, file } });

  const hasInput = voiceText.trim() || file;

  return (
    <div style={{
      minHeight: 'calc(100vh - 3.5rem)',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#e8f0e9',
    }}>

      {/* ── GALLERY — 4 rows filling the entire background ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-around', gap: '8px',
        opacity: 0.80,
      }}>
        <GalleryRow images={ROWS[0]} anim="animate-scroll-left" />
        <GalleryRow images={ROWS[1]} anim="animate-scroll-right" />
        <GalleryRow images={ROWS[2]} anim="animate-scroll-left-slow" />
        <GalleryRow images={ROWS[3]} anim="animate-scroll-right" />
      </div>

      {/* ── Thin edge vignettes only ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to bottom, #e8f0e9, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to top, #e8f0e9, transparent)' }} />
      </div>

      {/* ── CENTER FROSTED GLASS PANEL — all content lives here ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <div style={{
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          backgroundColor: 'rgba(255,255,255,0.76)',
          borderRadius: '28px',
          border: '1.5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 56px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.85) inset',
          padding: '36px 40px 28px',
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>

          {/* Logo — drop-shadow only, mix-blend-mode:multiply blends white box into panel */}
          <div className="animate-float" style={{ marginBottom: '12px' }}>
            <img
              src="/logo.png"
              alt="Robin-Hood AI"
              style={{
                width: 96,
                height: 96,
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                filter: 'drop-shadow(0 4px 12px rgba(45,106,79,0.25))',
                userSelect: 'none',
              }}
            />
          </div>

          {/* Brand */}
          <h1
            className="font-display font-black tracking-tight text-center"
            style={{ fontSize: '2.5rem', color: '#0d1f12', lineHeight: 1, marginBottom: 8 }}
          >
            Robin-Hood AI
          </h1>

          {/* Tagline */}
          <p
            className="font-display font-bold tracking-wide text-center"
            style={{ fontSize: '1rem', color: '#2D6A4F', marginBottom: 20 }}
          >
            Leveling the Playing Field
          </p>

          {/* Sub-text */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 15, color: '#475569', fontWeight: 500, marginBottom: 6 }}>
              Your AI Negotiation Partner
            </p>
            <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Speak &nbsp;·&nbsp; Understand &nbsp;·&nbsp; Negotiate &nbsp;·&nbsp; Win
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.07)', marginBottom: 24 }} />

          {/* Mic */}
          <VoiceMic onTranscript={handleTranscript} />

          {/* OR divider */}
          <div className="flex items-center w-full my-6" style={{ maxWidth: 220 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
            <span style={{ padding: '0 14px', fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Upload */}
          <FileUpload onFileSelect={handleFileSelect} />

          {/* Analyze CTA */}
          {hasInput && (
            <div className="mt-8 animate-slide-up" style={{ width: '100%' }}>
              <button
                onClick={handleAnalyze}
                className="btn-primary w-full py-3.5 text-[14px] font-semibold tracking-wide"
                id="analyze-button"
              >
                Analyze Contract
              </button>
            </div>
          )}

          {/* Bottom note */}
          <p style={{ marginTop: 20, fontSize: 10, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' }}>
            Voice-first &nbsp;·&nbsp; Local Language &nbsp;·&nbsp; Built for Bharat
          </p>

        </div>
      </div>

    </div>
  );
}
