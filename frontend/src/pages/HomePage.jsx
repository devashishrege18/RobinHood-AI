/**
 * HomePage — Gallery background, frosted glass panel, floating demo queries.
 *
 * Changes vs previous:
 *  - Panel is in normal flow (scrollable), not position:absolute
 *  - Floating demo query bubbles on left/right with typing animation
 *  - Mix of Hindi and English queries
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceMic from '../components/VoiceMic';
import FileUpload from '../components/FileUpload';

/* ── Gallery images ── */
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
          <img key={i} src={src} alt="" loading="lazy"
            style={{ height: '155px', width: '215px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Demo queries — alternating Hindi/English ── */
const LEFT_QUERIES = [
  "Mera gehu ka contract Rs 2,350 per quintal hai. Kya yeh sahi hai?",
  "Is this rice procurement deal fair at Rs 1,800/quintal?",
  "Mujhe kapas ka bhav pata karna hai, contract mein Rs 6,200 likha hai",
  "What are the hidden clauses in my sugarcane contract?",
  "Yeh soybean contract mein penalty clause bahut zyada hai",
  "Can I get a better rate for my tomato harvest this season?",
];

const RIGHT_QUERIES = [
  "Contract mein payment 90 din baad hai, kya yeh normal hai?",
  "My landlord is offering 30% share, is this exploitative?",
  "Bazaar mein aaj dhan ka rate kya chal raha hai?",
  "The middleman takes 15% commission — how to negotiate lower?",
  "Sarson ke beej ka contract padho aur batao risk kya hai",
  "Should I accept advance payment with a price lock clause?",
];

/* ── Typing text component ── */
function TypewriterBubble({ text, side, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [visible, setVisible] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setVisible(false);

    const showTimer = setTimeout(() => {
      setVisible(true);
      const interval = setInterval(() => {
        indexRef.current += 1;
        if (indexRef.current <= text.length) {
          setDisplayed(text.slice(0, indexRef.current));
        } else {
          clearInterval(interval);
        }
      }, 35);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(showTimer);
  }, [text, delay]);

  if (!visible) return null;

  const isLeft = side === 'left';
  return (
    <div
      style={{
        maxWidth: '220px',
        padding: '12px 16px',
        borderRadius: isLeft ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
        backgroundColor: isLeft ? 'rgba(255,255,255,0.85)' : 'rgba(45,106,79,0.12)',
        border: `1px solid ${isLeft ? 'rgba(0,0,0,0.06)' : 'rgba(45,106,79,0.2)'}`,
        backdropFilter: 'blur(8px)',
        fontSize: '12.5px',
        lineHeight: '1.5',
        color: isLeft ? '#334155' : '#1e4d36',
        fontWeight: 500,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        opacity: displayed.length > 0 ? 1 : 0,
        transform: `translateY(${displayed.length > 0 ? 0 : 8}px)`,
        transition: 'opacity 0.3s, transform 0.3s',
      }}
    >
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse" style={{ opacity: 0.6 }}>|</span>
      )}
    </div>
  );
}

/* ── Rotating demo queries on one side ── */
function FloatingQueries({ queries, side }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [batch, setBatch] = useState(0);

  useEffect(() => {
    // Show 2 queries at a time, rotate every 8 seconds
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 2) % queries.length);
      setBatch((b) => b + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, [queries.length]);

  const q1 = queries[currentIdx];
  const q2 = queries[(currentIdx + 1) % queries.length];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: side === 'left' ? 'flex-start' : 'flex-end',
      width: '240px',
      flexShrink: 0,
    }}>
      <TypewriterBubble key={`${batch}-0`} text={q1} side={side} delay={200} />
      <TypewriterBubble key={`${batch}-1`} text={q2} side={side} delay={2500} />
    </div>
  );
}

/* ── Main page ── */
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
      overflow: 'auto',
      backgroundColor: '#e8f0e9',
    }}>

      {/* ── GALLERY — fixed background ── */}
      <div style={{
        position: 'fixed', top: '3.5rem', left: 0, right: 0, bottom: 0, zIndex: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-around', gap: '8px',
        opacity: 0.80,
      }}>
        <GalleryRow images={ROWS[0]} anim="animate-scroll-left" />
        <GalleryRow images={ROWS[1]} anim="animate-scroll-right" />
        <GalleryRow images={ROWS[2]} anim="animate-scroll-left-slow" />
        <GalleryRow images={ROWS[3]} anim="animate-scroll-right" />
      </div>

      {/* ── Edge vignettes ── */}
      <div style={{ position: 'fixed', top: '3.5rem', left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to bottom, #e8f0e9, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to top, #e8f0e9, transparent)' }} />
      </div>

      {/* ── MAIN CONTENT — normal flow, scrollable ── */}
      <div style={{ position: 'relative', zIndex: 2, padding: '40px 16px 48px' }}>

        {/* Three-column layout: left queries | panel | right queries */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '28px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>

          {/* Left floating queries — hidden on mobile */}
          <div className="hidden lg:flex" style={{ paddingTop: '120px' }}>
            <FloatingQueries queries={LEFT_QUERIES} side="left" />
          </div>

          {/* ── GLASS PANEL ── */}
          <div style={{
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            backgroundColor: 'rgba(255,255,255,0.76)',
            borderRadius: '28px',
            border: '1.5px solid rgba(255,255,255,0.9)',
            boxShadow: '0 8px 56px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.85) inset',
            padding: '36px 40px 32px',
            width: '100%',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,
          }}>

            {/* Logo */}
            <div className="animate-float" style={{ marginBottom: '12px' }}>
              <img
                src="/logo-avatar.png"
                alt="Robin-Hood AI"
                style={{
                  width: 110, height: 110,
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
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
            <p style={{ marginTop: 24, fontSize: 10, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' }}>
              Voice-first &nbsp;·&nbsp; Local Language &nbsp;·&nbsp; Built for Bharat
            </p>

          </div>

          {/* Right floating queries — hidden on mobile */}
          <div className="hidden lg:flex" style={{ paddingTop: '180px' }}>
            <FloatingQueries queries={RIGHT_QUERIES} side="right" />
          </div>

        </div>
      </div>
    </div>
  );
}
