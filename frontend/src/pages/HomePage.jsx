/**
 * HomePage — Gallery background, frosted glass panel, 6 multilingual query bubbles.
 *
 * Left column:  Hindi · Bengali · Tamil
 * Right column: Punjabi · Marathi · Telugu
 * All bubbles same frosted-white color, cycle independently with typewriter anim.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceMic from '../components/VoiceMic';
import FileUpload from '../components/FileUpload';

/* ── Gallery ── */
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

/* ── Language query banks ── */
const LANGUAGES = {
  left: [
    {
      lang: 'Hindi',
      queries: [
        'मेरा गेहूं का अनुबंध ₹2,350 प्रति क्विंटल है। क्या यह उचित है?',
        'बिचौलिया 15% कमीशन ले रहा है, इसे कम कैसे करूं?',
        'सोयाबीन के अनुबंध में जुर्माना खंड बहुत अधिक है।',
      ],
    },
    {
      lang: 'Bengali',
      queries: [
        'আমার ধানের চুক্তি ₹১,৮০০ প্রতি কুইন্টাল। এটা কি ন্যায্য?',
        'দালাল বাজার মূল্যের চেয়ে ২০% কম দিচ্ছে।',
        'কৃষি চুক্তিতে অগ্রিম পেমেন্টের সুবিধা কি আছে?',
      ],
    },
    {
      lang: 'Tamil',
      queries: [
        'என் நெல் ஒப்பந்தம் ₹1,950 குவிண்டாலுக்கு நியாயமா?',
        'இடைத்தரகர் 18% கமிஷன் வாங்குகிறார் — எப்படி பேசுவது?',
        'கரும்பு ஒப்பந்தத்தில் மறைந்த நிபந்தனைகள் என்ன?',
      ],
    },
  ],
  right: [
    {
      lang: 'Punjabi',
      queries: [
        'ਮੇਰਾ ਕਣਕ ਦਾ ਇਕਰਾਰਨਾਮਾ ₹2,015 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ। ਕੀ ਇਹ ਸਹੀ ਹੈ?',
        'ਦਲਾਲ ਮੰਡੀ ਭਾਅ ਤੋਂ ਘੱਟ ਦੇ ਰਿਹਾ ਹੈ, ਕੀ ਕਰਾਂ?',
        'ਨਰਮੇ ਦੇ ਇਕਰਾਰਨਾਮੇ ਵਿੱਚ ਜੁਰਮਾਨੇ ਦੀ ਧਾਰਾ ਕੀ ਹੈ?',
      ],
    },
    {
      lang: 'Marathi',
      queries: [
        'माझ्या कांद्याच्या करारात ₹800 प्रति क्विंटल आहे. हे योग्य आहे का?',
        'मध्यस्थी 12% कमिशन घेतो — हे कमी कसे करायचे?',
        'ऊस करारातील दंड कलम खूप जास्त आहे.',
      ],
    },
    {
      lang: 'Telugu',
      queries: [
        'నా వరి ఒప్పందం ₹1,750 క్వింటాల్‌కు న్యాయంగా ఉందా?',
        'దళారీ 16% కమీషన్ తీసుకుంటున్నారు — ఎలా చర్చించాలి?',
        'చెరకు ఒప్పందంలో దాచిన నిబంధనలు ఏమిటి?',
      ],
    },
  ],
};

/* ── Single rotating bubble with typewriter ── */
function QueryBubble({ queries, offsetDelay = 0 }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | hold | clearing
  const charRef = useRef(0);
  const text = queries[idx];

  useEffect(() => {
    charRef.current = 0;
    setDisplayed('');
    setPhase('typing');

    const startDelay = setTimeout(() => {
      // Type chars
      const typeInterval = setInterval(() => {
        charRef.current += 1;
        setDisplayed(text.slice(0, charRef.current));
        if (charRef.current >= text.length) {
          clearInterval(typeInterval);
          setPhase('hold');
          // Hold then clear then switch
          setTimeout(() => {
            setPhase('clearing');
            setTimeout(() => {
              setIdx((prev) => (prev + 1) % queries.length);
            }, 500);
          }, 3500);
        }
      }, 40);
      return () => clearInterval(typeInterval);
    }, offsetDelay);

    return () => clearTimeout(startDelay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <div style={{
      width: '300px',
      minHeight: '90px',
      padding: '16px 20px',
      borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.52)',
      border: '1px solid rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      fontSize: '14px',
      lineHeight: '1.65',
      color: '#1a2332',
      fontWeight: 600,
      opacity: phase === 'clearing' ? 0 : 1,
      transition: 'opacity 0.45s ease',
    }}>
      {displayed}
      {phase === 'typing' && (
        <span style={{ opacity: 0.4 }}>|</span>
      )}
    </div>
  );
}

/* ── Column of 3 bubbles — staggered offset pattern, mirrored on both sides ── */
// Horizontal offsets from the anchor edge (left or right)
// Creates a zigzag: flush → indented → half-indent
const OFFSETS = [0, 42, 18]; // px offset from anchor edge for each bubble

function BubbleColumn({ langData, align }) {
  const isLeft = align === 'left';
  return (
    <div style={{
      // Container wide enough to hold bubble + max offset
      width: '346px',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      flexShrink: 0,
    }}>
      {langData.map((item, i) => (
        <div
          key={item.lang}
          style={{
            // Stagger: push from the anchor edge by different amounts
            marginLeft: isLeft ? `${OFFSETS[i]}px` : 'auto',
            marginRight: isLeft ? 'auto' : `${OFFSETS[i]}px`,
          }}
        >
          <QueryBubble queries={item.queries} offsetDelay={i * 1200} />
        </div>
      ))}
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
      overflow: 'hidden',        // No page scroll — layout fits viewport
      backgroundColor: '#e8f0e9',
    }}>

      {/* ── Gallery background ── */}
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

      {/* Edge vignettes */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to bottom, #e8f0e9, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to top, #e8f0e9, transparent)' }} />
      </div>

      {/* ── Three-column layout — fills full height, no scroll ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 3.5rem)',
        padding: '20px 12px',
        gap: '24px',
      }}>

        {/* Left: 3 bubble columns — hidden on small screens */}
        <div className="hidden xl:block">
          <BubbleColumn langData={LANGUAGES.left} align="left" />
        </div>

        {/* ── Glass panel ── */}
        <div style={{
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          backgroundColor: 'rgba(255,255,255,0.76)',
          borderRadius: '28px',
          border: '1.5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 56px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.85) inset',
          padding: '30px 40px 26px',
          width: '100%',
          maxWidth: '460px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>

          {/* Logo */}
          <div className="animate-float" style={{ marginBottom: '10px' }}>
            <img
              src="/logo-avatar.png"
              alt="Robin-Hood AI"
              style={{ width: 100, height: 100, objectFit: 'contain', mixBlendMode: 'multiply', userSelect: 'none' }}
            />
          </div>

          {/* Brand */}
          <h1
            className="font-display font-black tracking-tight text-center"
            style={{ fontSize: '2.4rem', color: '#0d1f12', lineHeight: 1, marginBottom: 7 }}
          >
            Robin-Hood AI
          </h1>

          {/* Tagline */}
          <p
            className="font-display font-bold tracking-wide text-center"
            style={{ fontSize: '0.95rem', color: '#2D6A4F', marginBottom: 16 }}
          >
            Leveling the Playing Field
          </p>

          {/* Sub-text */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <p style={{ fontSize: 14, color: '#475569', fontWeight: 500, marginBottom: 5 }}>
              Your AI Negotiation Partner
            </p>
            <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Speak &nbsp;·&nbsp; Understand &nbsp;·&nbsp; Negotiate &nbsp;·&nbsp; Win
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.07)', marginBottom: 18 }} />

          {/* Mic */}
          <VoiceMic onTranscript={handleTranscript} />

          {/* OR divider */}
          <div className="flex items-center w-full my-5" style={{ maxWidth: 200 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
            <span style={{ padding: '0 12px', fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Upload */}
          <FileUpload onFileSelect={handleFileSelect} />

          {/* Analyze CTA */}
          {hasInput && (
            <div className="mt-6 animate-slide-up" style={{ width: '100%' }}>
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
          <p style={{ marginTop: 18, fontSize: 10, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' }}>
            Voice-first &nbsp;·&nbsp; Local Language &nbsp;·&nbsp; Built for Bharat
          </p>
        </div>

        {/* Right: 3 bubble columns — hidden on small screens */}
        <div className="hidden xl:block">
          <BubbleColumn langData={LANGUAGES.right} align="right" />
        </div>

      </div>
    </div>
  );
}
