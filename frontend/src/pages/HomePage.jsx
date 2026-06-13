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

/* ── Language query banks — medium-length, fills box evenly ── */
const LANGUAGES = {
  left: [
    {
      lang: 'Hindi',
      queries: [
        'मेरा गेहूं ₹2,350/क्विंटल पर है, पर मंडी में ₹2,620 मिल रहा है। क्या इस अंतर पर बातचीत हो सकती है?',
        'बिचौलिया 18% कम दे रहा है और सरकारी केंद्र बंद है। मुझे सही खरीदार और बेहतर भाव कैसे मिलेगा?',
        'सप्लायर ने वार्षिक अनुबंध भेजा है। इसकी शर्तों में कौन से छुपे जोखिम हो सकते हैं?',
      ],
    },
    {
      lang: 'Bengali',
      queries: [
        'ধান চুক্তিতে ₹১,৮০০ কিন্তু সরকারি MSP ₹২,১৮৩। এই চুক্তি বাতিল বা পুনরায় আলোচনা কি সম্ভব?',
        'আড়তদার বলছেন ৩ দিনে পেমেন্ট না নিলে দাম কমবে। এই চাপ থেকে কীভাবে আমার স্বার্থ রক্ষা করব?',
        'ব্যবসায়ী এখনই পাটের ফসলের দাম নির্ধারণ করতে বলছেন। ফরওয়ার্ড চুক্তিতে আমার কী ঝুঁকি?',
      ],
    },
    {
      lang: 'Tamil',
      queries: [
        'நெல் ₹1,950/குவிண்டால் ஒப்பந்தம், திறந்த சந்தையில் ₹2,250. இந்த வித்தியாசம் எப்படி சரிசெய்வது?',
        'கமிஷன் ஏஜென்ட் 45 நாட்கள் கழித்து பணம் தருவதாக சொல்கிறார். இது என் வாழ்க்கையை எப்படி பாதிக்கும்?',
        'மொத்த விற்பனையாளர் 15% விலை உயர்த்தினார். புதிய சப்ளையரை எப்படி கண்டுபிடிப்பது?',
      ],
    },
  ],
  right: [
    {
      lang: 'Punjabi',
      queries: [
        'ਕਣਕ ₹2,015/ਕੁਇੰਟਲ ਪਰ ਮੰਡੀ ਭਾਅ ₹2,400 ਹੈ। ਕੀ ਮੈਂ ਕਾਨੂੰਨੀ ਤੌਰ ਤੇ ਇਸ ਇਕਰਾਰਨਾਮੇ ਤੋਂ ਬਾਹਰ ਨਿਕਲ ਸਕਦਾ ਹਾਂ?',
        'ਆੜ੍ਹਤੀਆ 20% ਕਮਿਸ਼ਨ ਲੈਂਦਾ ਅਤੇ ਭੁਗਤਾਨ ਵਿੱਚ ਦੇਰੀ ਕਰਦਾ ਹੈ। ਮੇਰੇ ਕੋਲ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ?',
        'ਵੱਡੀ ਕੰਪਨੀ ਦਾ ਸਪਲਾਈ ਸਮਝੌਤਾ ਮਿਲਿਆ ਹੈ। ਇਸ ਵਿੱਚ ਕਿੱਥੇ ਜੋਖ਼ਮ ਹੈ ਅਤੇ ਕੀ ਸੁਧਾਰਨਾ ਚਾਹੀਦਾ?',
      ],
    },
    {
      lang: 'Marathi',
      queries: [
        'कांद्याचा करार ₹800/क्विंटल, बाजारभाव ₹1,150. योग्य किंमत मिळवण्यासाठी काय करावे?',
        'व्यापाऱ्याने आगाऊ कापूस खरेदी केली पण आता कमी दर देतो. माझे कायदेशीर अधिकार काय?',
        'FPO सोबत शेतमाल करार करायचा आहे. कोणते महत्त्वाचे मुद्दे काळजीपूर्वक तपासावेत?',
      ],
    },
    {
      lang: 'Telugu',
      queries: [
        'వరి ₹1,750/క్వింటాల్ ఒప్పందం, మద్దతు ధర ₹2,183. ఈ వ్యత్యాసంపై ఎలా మాట్లాడాలి?',
        'గ్రామంలో దళారీ రైతులకు తక్కువ ధర ఇస్తున్నాడు. కలిసి బేరమాడే మార్గం ఉందా?',
        'సప్లయర్ నాణ్యత తగ్గించి ధర పెంచాడు. ఒప్పందం రద్దు చేసుకోవడానికి ఏమి చేయాలి?',
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
      height: '130px',           // fixed height — all boxes identical size
      padding: '16px 20px',
      borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.52)',
      border: '1px solid rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#1a2332',
      fontWeight: 600,
      overflow: 'hidden',        // clip text that exceeds box
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

/* ── Column of 3 bubbles — spans full panel height, staggered offsets ── */
const OFFSETS = [0, 42, 18];

function BubbleColumn({ langData, align }) {
  const isLeft = align === 'left';
  return (
    <div style={{
      width: '346px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {langData.map((item, i) => (
        <div
          key={item.lang}
          style={{
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

      {/* ── Vertical centering wrapper — fills viewport, centers group ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 3.5rem)',
        padding: '20px 12px',
      }}>

        {/* Inner row — alignItems:stretch so columns match panel height exactly */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '24px',
        }}>

          {/* Left bubbles */}
          <div style={{ display: 'flex', alignSelf: 'stretch' }} className="hidden xl:flex">
            <BubbleColumn langData={LANGUAGES.left} align="left" />
          </div>

          {/* Glass panel */}
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

          {/* Right bubbles */}
          <div style={{ display: 'flex', alignSelf: 'stretch' }} className="hidden xl:flex">
            <BubbleColumn langData={LANGUAGES.right} align="right" />
          </div>

        </div>{/* /inner row */}
      </div>{/* /centering wrapper */}
    </div>
  );
}
