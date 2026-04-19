import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoReflecterLabs from '../public/LogoReflecterLabs.png';
import MagicBento from '../components/MagicBento';
import CardSwap, { Card } from '../components/CardSwap';
import BorderGlow from '../components/BorderGlow';


const SEO = () => {
  useEffect(() => {
    document.title = "Grinta Protocol | Reflecter Labs";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Grinta Protocol is an Agent-Native Stablecoin researched and developed by Reflecter Labs, exploring the intersection of DeFi, AI, and advanced cryptography.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Grinta Protocol is an Agent-Native Stablecoin researched and developed by Reflecter Labs, exploring the intersection of DeFi, AI, and advanced cryptography.';
      document.head.appendChild(meta);
    }
  }, []);
  return null;
};

const HackerText = ({ text, href = "#" }: { text: string; href?: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const handleMouseEnter = () => {
    let iter = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((l, i) => {
            if (i < iter) return text[i];
            return alpha[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iter >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iter += 1 / 3;
    }, 30);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="nav-link magnetic inline-block"
      data-text={text}
    >
      {displayText}
    </a>
  );
};

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FF41]/30 hover:bg-[#00FF41]/5 transition-all group"
    >
      <code className="text-xs text-gray-300 font-mono truncate">{text}</code>
      <span className={`text-xs font-bold whitespace-nowrap transition-colors ${copied ? 'text-[#00FF41]' : 'text-gray-500 group-hover:text-[#00FF41]'}`}>
        {copied ? 'Copied!' : label}
      </span>
    </button>
  );
};

export default function Landing() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Cursor Animation
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Scroll Velocity Skew
    let lastScrollTop = 0;
    let skew = 0;

    const scrollLoop = () => {
      const scrollTop = window.scrollY;
      const velocity = scrollTop - lastScrollTop;
      lastScrollTop = scrollTop;

      const maxSkew = 5.0;
      const speed = Math.min(Math.max(velocity * 0.1, -maxSkew), maxSkew);

      skew += (speed - skew) * 0.1;

      if (scrollContentRef.current) {
        if (Math.abs(skew) > 0.01) {
          scrollContentRef.current.style.transform = `skewY(${skew}deg)`;
        } else {
          scrollContentRef.current.style.transform = `skewY(0deg)`;
        }
      }
      requestAnimationFrame(scrollLoop);
    };
    scrollLoop();

    // Nav Scroll State
    const handleScroll = () => {
      if (window.scrollY > 100) {
        navRef.current?.classList.add('scrolled');
      } else {
        navRef.current?.classList.remove('scrolled');
        if (navRef.current) navRef.current.style.transform = '';
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Nav 3D Tilt
    const handleNavMouseMove = (e: MouseEvent) => {
      if (!navRef.current?.classList.contains('scrolled')) return;
      const cx = window.innerWidth / 2;
      const cy = 100;
      const rx = (e.clientY - cy) * 0.02;
      const ry = (e.clientX - cx) * 0.02;
      const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

      navRef.current.style.transform = `translateX(-50%) perspective(1000px) rotateX(${-clamp(rx, -10, 10)}deg) rotateY(${clamp(ry, -10, 10)}deg)`;
    };
    document.addEventListener('mousemove', handleNavMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleNavMouseMove);
    };
  }, []);

  // Magnetic effect for elements
  useEffect(() => {
    const magneticElements = document.querySelectorAll('.magnetic');

    const handleMagnetMove = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const mouseEvent = e as MouseEvent;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = 0.5;

      const moveX = (mouseEvent.clientX - centerX) * dist;
      const moveY = (mouseEvent.clientY - centerY) * dist;

      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
      if (cursorRef.current) cursorRef.current.classList.add('magnet');
    };

    const handleMagnetLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = 'translate(0, 0)';
      if (cursorRef.current) cursorRef.current.classList.remove('magnet');
    };

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', handleMagnetMove);
      el.addEventListener('mouseleave', handleMagnetLeave);
    });

    return () => {
      magneticElements.forEach(el => {
        el.removeEventListener('mousemove', handleMagnetMove);
        el.removeEventListener('mouseleave', handleMagnetLeave);
      });
    };
  }, []);

  return (
    <div className="landing-body">
      <SEO />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Syncopate:wght@700;800&display=swap');

        html {
            scroll-behavior: smooth;
        }

        .landing-body {
          background-color: #030303;
          color: #e0e0e0;
          font-family: 'Space Grotesk', sans-serif;
          overflow-x: hidden;
          cursor: none;
        }

        .landing-body * {
          cursor: none;
        }

        /* --- GRAIN OVERLAY --- */
        .noise {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.07;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* --- SCROLL CONTENT WRAPPER --- */
        #scroll-content {
            will-change: transform;
        }

        /* --- CURSOR --- */
        #cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: #00FF41;
            border-radius: 50%;
            pointer-events: none;
            mix-blend-mode: difference;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), height 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        #cursor.magnet {
            width: 90px;
            height: 90px;
            background: transparent;
            border: 1px solid #00FF41;
            backdrop-filter: blur(0px);
        }

        #cursor.magnet::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: #00FF41;
            border-radius: 50%;
        }

        /* --- NAVBAR --- */
        .brutal-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 3rem 4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 100;
            transition:
                padding 0.7s cubic-bezier(0.165, 0.84, 0.44, 1),
                top 0.7s cubic-bezier(0.165, 0.84, 0.44, 1),
                width 0.7s cubic-bezier(0.165, 0.84, 0.44, 1),
                background 0.5s cubic-bezier(0.165, 0.84, 0.44, 1),
                border-radius 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
            mix-blend-mode: exclusion;
            transform-style: preserve-3d;
            perspective: 1200px;
        }

        .brutal-nav.scrolled {
            top: 1.5rem;
            padding: 0.8rem 2rem;
            width: auto;
            min-width: 500px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            mix-blend-mode: normal;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
        }

        /* Logo Glitch */
        .nav-logo {
            font-family: 'Syncopate', sans-serif;
            font-weight: 800;
            font-size: 2rem;
            letter-spacing: -2px;
            color: #fff;
            user-select: none;
            position: relative;
            text-decoration: none;
        }

        .nav-logo:hover {
            animation: glitch-anim 0.3s infinite;
        }

        .nav-logo::before,
        .nav-logo::after {
            content: "GRINTA";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #030303;
            opacity: 0.8;
            display: none;
        }

        .nav-logo:hover::before,
        .nav-logo:hover::after {
            display: block;
        }

        .nav-logo:hover::before {
            color: #ff00ff;
            z-index: -1;
            transform: translate(-2px, -2px);
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            animation: glitch-anim-2 0.5s infinite linear alternate-reverse;
        }

        .nav-logo:hover::after {
            color: #00FF41;
            z-index: -2;
            transform: translate(2px, 2px);
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
            animation: glitch-anim-2 0.5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }

        @keyframes glitch-anim-2 {
            0% { transform: translate(0); }
            100% { transform: translate(2px, -2px); }
        }

        /* Nav Items */
        .nav-menu {
            display: flex;
            gap: 3rem;
            list-style: none;
            align-items: center;
            margin: 0;
            padding: 0;
        }

        .nav-link {
            position: relative;
            font-weight: 500;
            font-size: 0.95rem;
            text-decoration: none;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 10px;
            transition: padding-left 0.2s;
        }

        .nav-link::before {
            content: '>';
            position: absolute;
            left: -10px;
            opacity: 0;
            transition: all 0.2s;
            color: #00FF41;
        }

        .nav-link:hover::before {
            opacity: 1;
            left: 0;
        }

        .nav-link:hover {
            padding-left: 15px;
        }

        /* CTA Button */
        .cta-btn {
            position: relative;
            padding: 0.8rem 2rem;
            background: #fff;
            color: #000;
            font-weight: 700;
            border: 1px solid transparent;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.9rem;
            letter-spacing: 1px;
            overflow: hidden;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }

        .cta-btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #00FF41;
            transform: translateX(-101%);
            transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
            z-index: 1;
        }

        .cta-btn span {
            position: relative;
            z-index: 2;
            transition: color 0.3s;
        }

        .cta-btn:hover span {
            color: #000;
        }

        .cta-btn:hover::after {
            transform: translateX(0);
        }

        .brutal-nav.scrolled .cta-btn {
            padding: 0.6rem 1.5rem;
        }

        /* --- HERO --- */
        .hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            text-align: center;
        }

        .hero-title-container {
            perspective: 1000px;
            transform-style: preserve-3d;
        }

        .hero h1 {
            font-family: 'Syncopate', sans-serif;
            font-size: 13vw;
            line-height: 0.8;
            text-transform: uppercase;
            font-weight: 800;
            color: transparent;
            -webkit-text-stroke: 2px #e0e0e0;
            position: relative;
            z-index: 10;
            mix-blend-mode: color-dodge;
            transform: translateZ(50px);
            margin: 0;
        }

        .hero h1 .word {
            display: inline-block;
        }

        .hero h1 .char {
            display: inline-block;
            transition: color 0.2s, transform 0.2s;
        }

        .hero h1:hover .char {
            color: #00FF41;
            -webkit-text-stroke: 0px;
            transform: translateZ(20px);
        }

        /* Running Text Tape */
        .tape-wrapper {
            position: absolute;
            bottom: 5vh;
            left: -10%;
            width: 120%;
            background: #00FF41;
            color: #000;
            transform: rotate(-2deg);
            padding: 10px 0;
            border-top: 3px solid #000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }

        .tape-text {
            font-family: 'Syncopate', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            white-space: nowrap;
            animation: tapeScroll 20s linear infinite;
            display: inline-block;
        }

        @keyframes tapeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        /* --- CONTENT SECTIONS --- */
        .section-dark {
            min-height: 80vh;
            background: #080808;
            display: flex;
            align-items: center;
            padding: 10vw;
            border-top: 1px solid #222;
        }

        .big-text {
            font-size: 5vw;
            line-height: 1.1;
            font-weight: 300;
            color: #444;
            margin: 0;
            text-transform: uppercase;
        }

        .big-text span {
            color: #fff;
            font-weight: 700;
        }

        /* --- RESPONSIVE FIXES --- */
        @media (max-width: 768px) {
            .brutal-nav {
                padding: 1.5rem;
                flex-direction: column;
                gap: 1rem;
            }
            .brutal-nav.scrolled {
                width: 95%;
                min-width: auto;
                top: 1rem;
                padding: 1rem;
                flex-direction: row;
                gap: 0;
                justify-content: space-between;
            }
            .nav-menu {
                display: none;
            }
            .hero h1 {
                font-size: 13vw;
            }
            .tape-text {
                font-size: 1.2rem;
            }
            .big-text {
                font-size: 7vw;
            }
        }

        /* Restore default cursor on touch devices */
        @media (hover: none) and (pointer: coarse) {
            .landing-body,
            .landing-body * {
                cursor: auto !important;
            }
            #cursor {
                display: none !important;
            }
        }
      `}</style>

      <div className="noise"></div>
      <div id="cursor" ref={cursorRef}></div>

      <nav className="brutal-nav" ref={navRef}>
        <Link to="/" className="nav-logo magnetic">GRINTA</Link>
        <ul className="nav-menu">
          <li><HackerText text="PROTOCOL" href="#protocol" /></li>
          <li><HackerText text="GOVERNANCE" href="#governance" /></li>
          <li><HackerText text="ECOSYSTEM" href="#ecosystem" /></li>
        </ul>
        <Link to="/app" className="cta-btn magnetic"><span>App Tesnet</span></Link>
      </nav>

      <div id="scroll-content" ref={scrollContentRef}>
        <section className="hero">
          <div className="hero-title-container">
            <h1>
              <div className="word">
                {"AGENT".split('').map((char, i) => <span key={i} className="char">{char}</span>)}
              </div><br />
              <div className="word">
                {"NATIVE".split('').map((char, i) => <span key={i} className="char">{char}</span>)}
              </div>
              <div className="word">
                {"STABLE".split('').map((char, i) => <span key={i} className="char">{char}</span>)}
              </div>
            </h1>
          </div>

          <div className="tape-wrapper">
            <div className="tape-text">
              GRINTA PROTOCOL ✦ BAGENT-AS-GOVERNOR ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ BAGENT-AS-GOVERNOR ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ BAGENT-AS-GOVERNOR ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ BAGENT-AS-GOVERNOR ✦ PID CONTROLLER ✦
            </div>
          </div>
        </section>

        <section id="protocol" className="section-dark" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10vw 5vw' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Title and Description */}
            <div className="text-left">
              <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: 'Syncopate' }}>
                Protocol
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed font-light max-w-xl mb-8">
                Grinta is an autonomous credit protocol. It enables the creation of GRIT, a stable asset backed by decentralized collateral and governed by a real-time control system.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[#00FF41] font-bold mb-1 tracking-tighter">STABLE ASSET</div>
                  <div className="text-2xl font-bold text-white">GRIT</div>
                </div>
                <div>
                  <div className="text-[#00FF41] font-bold mb-1 tracking-tighter">COLLATERAL</div>
                  <div className="text-2xl font-bold text-white">BTC + LSTs</div>
                </div>
              </div>
            </div>

            {/* Right Column: Card Swap Component */}
            <div className="relative flex justify-center lg:justify-end h-[600px] w-full">
              <CardSwap
                cardDistance={60}
                verticalDistance={70}
                delay={5000}
                pauseOnHover={false}
              >
                <Card className="flex flex-col p-8 border-[#00FF41]/20 bg-[#0a1a10]">
                  <div className="text-xs font-bold text-[#00FF41] tracking-widest uppercase mb-4">Core Mechanism</div>
                  <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>PID Controller</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Pure mathematics replaces manual governance. Real-time rate adjustments keep GRIT stable without human intervention.
                  </p>
                </Card>
                <Card className="flex flex-col p-8 border-white/10 bg-[#050505]">
                  <div className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Asset Quality</div>
                  <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>BTC Collateral</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Backed by the world's Hardest Asset. Grinta accepts WBTC and BTC Synthetics to ensure deep liquidity and security.
                  </p>
                </Card>
                <Card className="flex flex-col p-8 border-[#00FF41]/20 bg-[#0a1a10]">
                  <div className="text-xs font-bold text-[#00FF41] tracking-widest uppercase mb-4">Architecture</div>
                  <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>Agent-Native</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Designed for the future where agents are the primary users. Fully composable, automated, and autonomous.
                  </p>
                </Card>
              </CardSwap>
            </div>
          </div>
        </section>

        {/* --- GOVERNANCE --- */}
        <section id="governance" className="section-dark" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10vw 5vw', backgroundColor: '#050505', borderTop: '1px solid #111' }}>
          <div className="text-center max-w-4xl mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Syncopate' }}>
              Governance
            </h2>
            <p className="text-xl text-gray-400 font-light">
              The DAO sets the rules. The agent executes within them.
              <a 
                href="https://grinta-loop-shanghai.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 ml-3 text-[#00FF41] hover:text-[#00e63b] underline-offset-4 hover:underline transition-all font-bold"
              >
                Try Governance
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </a>
            </p>
          </div>

          <div className="w-full max-w-5xl overflow-hidden flex justify-center">
            <MagicBento
              textAutoHide={true}
              enableStars
              enableSpotlight
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect
              spotlightRadius={400}
              particleCount={12}
              glowColor="0, 255, 65"
              disableAnimations={false}
            />
          </div>
        </section>

        <section id="ecosystem" className="section-dark" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10vw 5vw', backgroundColor: '#050505' }}>
          <div className="text-center mb-16 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Syncopate' }}>Built for Agents</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Grinta ships with everything AI agents need to interact with the protocol autonomously.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-12 relative w-full max-w-5xl">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[1px] bg-white/10 -z-10"></div>

            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a1a10] text-[#00FF41] flex items-center justify-center font-bold text-xl mb-6 border border-[#00FF41]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">1</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Connect MCP</h3>
              <p className="text-sm text-gray-400">Agent loads the MCP server and discovers 16 available tools</p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a1a10] text-[#00FF41] flex items-center justify-center font-bold text-xl mb-6 border border-[#00FF41]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">2</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Read Rates</h3>
              <p className="text-sm text-gray-400">Query redemption price, collateral price, and position health</p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a1a10] text-[#00FF41] flex items-center justify-center font-bold text-xl mb-6 border border-[#00FF41]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">3</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Execute Strategy</h3>
              <p className="text-sm text-gray-400">Open SAFEs, adjust positions, and manage risk autonomously</p>
            </div>
          </div>

          <br></br>
          <br></br>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            {/* Card 1 */}
            <BorderGlow
              glowColor="135 100 50"
              backgroundColor="rgba(0, 0, 0, 0.5)"
              borderRadius={16}
              glowIntensity={0.8}
              colors={['#00FF41', '#00e63b', '#00cc35']}
            >
              <div className="p-8 text-left h-full">
                <div className="inline-block px-3 py-1 bg-[#00FF41]/10 text-[#00FF41] text-xs font-bold rounded mb-6 border border-[#00FF41]/20">SKILL.md</div>
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Agent Knowledge</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                  A structured knowledge file that any LLM can read to understand the protocol: contract addresses, function signatures, parameter formats, and safe interaction patterns.
                </p>
                <CopyButton text={`${window.location.origin}/SKILL.md`} label="Copy SKILL.md link" />
              </div>
            </BorderGlow>

            {/* Card 2 */}
            <BorderGlow
              glowColor="135 100 50"
              backgroundColor="rgba(0, 0, 0, 0.5)"
              borderRadius={16}
              glowIntensity={0.8}
              colors={['#00FF41', '#00e63b', '#00cc35']}
            >
              <div className="p-8 text-left h-full">
                <div className="inline-block px-3 py-1 bg-[#00FF41]/10 text-[#00FF41] text-xs font-bold rounded mb-6 border border-[#00FF41]/20">MCP Server</div>
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Agent Execution</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                  16 tools for reading protocol state and executing transactions. Agents connect via Model Context Protocol to open SAFEs, manage positions, and monitor system health — no custom code needed.
                </p>
                <CopyButton text={`"grinta-cdp": { "type": "stdio", "command": "npx", "args": ["-y", "@grinta/mcp-server"] }`} label="Copy MCP config" />
              </div>
            </BorderGlow>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-12 relative w-full max-w-5xl">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[1px] bg-white/10 -z-10"></div>
          </div>
        </section>

        <footer className="footer-premium" style={{ height: 'auto', padding: '10vh 5vw', background: '#e0e0e0', color: '#030303', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Branding */}
            <div className="flex flex-col items-center md:items-start">
              <h2 style={{ fontFamily: 'Syncopate', fontSize: '3rem', marginBottom: '1rem' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>GRINTA</Link>
              </h2>
              <p className="text-sm font-bold text-gray-600 mb-4 tracking-tighter">© 2026 Grinta Protocol. All rights reserved. Built for humans and the agent economy.</p>
              <div className="flex gap-4 opacity-30 hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black uppercase tracking-widest border border-black/10 px-2 py-1 rounded">Starknet</span>
                <span className="text-[10px] font-black uppercase tracking-widest border border-black/10 px-2 py-1 rounded">Agentic CDP</span>
                <span className="text-[10px] font-black uppercase tracking-widest border border-black/10 px-2 py-1 rounded">PI Control</span>
              </div>
            </div>

            {/* Backed by */}
            <div className="bg-black/5 border border-black/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm group hover:border-black/20 transition-all">
              <h4 className="text-lg font-bold mb-3 uppercase tracking-widest" style={{ fontFamily: 'Syncopate' }}>Backed by</h4>
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
                Grinta Protocol is researched and developed by Reflecter Labs, a lab focused on the intersection of DeFi, Artificial Intelligence, and advanced cryptography.
              </p>
              <div className="mt-4">
                <img src={LogoReflecterLabs} alt="Reflecter Labs" className="max-h-16 object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
