import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoReflecterLabs from '../public/LogoReflecterLabs.png';

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
            background: #4ADE80;
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
            border: 1px solid #4ADE80;
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
            background: #4ADE80;
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
            color: #4ADE80;
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
            color: #4ADE80;
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
            background: #4ADE80;
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
            color: #4ADE80;
            -webkit-text-stroke: 0px;
            transform: translateZ(20px);
        }

        /* Running Text Tape */
        .tape-wrapper {
            position: absolute;
            bottom: 5vh;
            left: -10%;
            width: 120%;
            background: #4ADE80;
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
      `}</style>

      <div className="noise"></div>
      <div id="cursor" ref={cursorRef}></div>

      <nav className="brutal-nav" ref={navRef}>
        <Link to="/" className="nav-logo magnetic">GRINTA</Link>
        <ul className="nav-menu">
          <li><HackerText text="PROTOCOL" href="#protocol" /></li>
          <li><HackerText text="ECOSYSTEM" href="#ecosystem" /></li>
          <li><HackerText text="ABOUT" href="#about" /></li>
        </ul>
        <Link to="/app" className="cta-btn magnetic"><span>APP Tesnet</span></Link>
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
              GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦
            </div>
          </div>
        </section>

        <section id="protocol" className="section-dark" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10vw 5vw' }}>
          <div className="text-center mb-16 max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Syncopate' }}>
              The Agent-Native<br />
              <span style={{ color: '#4ADE80' }}>Stablecoin</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              GRIT is a PID-controlled stablecoin on Starknet. No keepers, no governance votes to change rates — every Ekubo swap automatically updates the redemption price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {/* Card 1 */}
            <div className="border border-white/10 rounded-2xl p-8 text-center hover:border-white/30 transition-colors bg-black/50 backdrop-blur-sm">
              <div className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Collateral</div>
              <div className="text-3xl font-bold text-[#4ADE80] mb-2" style={{ fontFamily: 'Space Grotesk' }}>WBTC</div>
              <div className="text-sm text-gray-400">Wrapped Bitcoin on the Starknet network, bringing the deepest and most secure liquidity in the ecosystem.</div>
            </div>
            {/* Card 2 */}
            <div className="border border-white/10 rounded-2xl p-8 text-center hover:border-white/30 transition-colors bg-black/50 backdrop-blur-sm">
              <div className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Stablecoin</div>
              <div className="text-3xl font-bold text-[#4ADE80] mb-2" style={{ fontFamily: 'Space Grotesk' }}>GRIT</div>
              <div className="text-sm text-gray-400">A thoughtful currency, not rigidly pegged to $1, designed to absorb volatility through incentives.</div>
            </div>
            {/* Card 3 */}
            <div className="border border-white/10 rounded-2xl p-8 text-center hover:border-white/30 transition-colors bg-black/50 backdrop-blur-sm">
              <div className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Stability</div>
              <div className="text-3xl font-bold text-[#4ADE80] mb-2" style={{ fontFamily: 'Space Grotesk' }}>PID Controller</div>
              <div className="text-sm text-gray-400">Real-time algorithmic rate adjustment. Pure mathematics replaces human governance.</div>
            </div>
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
              <div className="w-16 h-16 rounded-full bg-[#0a1a10] text-[#4ADE80] flex items-center justify-center font-bold text-xl mb-6 border border-[#4ADE80]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">1</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Connect MCP</h3>
              <p className="text-sm text-gray-400">Agent loads the MCP server and discovers 16 available tools</p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a1a10] text-[#4ADE80] flex items-center justify-center font-bold text-xl mb-6 border border-[#4ADE80]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">2</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Read Rates</h3>
              <p className="text-sm text-gray-400">Query redemption price, collateral price, and position health</p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a1a10] text-[#4ADE80] flex items-center justify-center font-bold text-xl mb-6 border border-[#4ADE80]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">3</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Execute Strategy</h3>
              <p className="text-sm text-gray-400">Open SAFEs, adjust positions, and manage risk autonomously</p>
            </div>
          </div>

          <br></br>
          <br></br>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            {/* Card 1 */}
            <div className="border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors bg-black/50 backdrop-blur-sm text-left">
              <div className="inline-block px-3 py-1 bg-[#4ADE80]/10 text-[#4ADE80] text-xs font-bold rounded mb-6 border border-[#4ADE80]/20">SKILL.md</div>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Agent Knowledge</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                A structured knowledge file that any LLM can read to understand the protocol: contract addresses, function signatures, parameter formats, and safe interaction patterns.
              </p>
            </div>
            {/* Card 2 */}
            <div className="border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors bg-black/50 backdrop-blur-sm text-left">
              <div className="inline-block px-3 py-1 bg-[#4ADE80]/10 text-[#4ADE80] text-xs font-bold rounded mb-6 border border-[#4ADE80]/20">MCP Server</div>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Agent Execution</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                16 tools for reading protocol state and executing transactions. Agents connect via Model Context Protocol to open SAFEs, manage positions, and monitor system health — no custom code needed.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 relative w-full max-w-5xl">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[1px] bg-white/10 -z-10"></div>
          </div>
        </section>

        {/* --- DEPLOYED CONTRACTS & AGENT PROFILES --- */}
        <section className="section-dark pt-0" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5vw 5vw 10vw 5vw', backgroundColor: '#050505' }}>
          <div className="text-center mb-16 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Syncopate' }}>Deployed Contracts and Discovery</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Our base infrastructure is already operational on the Starknet network (Testnet) with 7 fundamental smart contracts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
            {/* Deployed Contracts */}
            <div className="border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors bg-black/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-[#4ADE80] mb-6" style={{ fontFamily: 'Syncopate' }}>Contracts in tesnet</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Grit Token', address: '0x02f4f6c374c20ddf3ea5e59cc70f2ad4c2bfb5786ca6c146266f89f7da575421' },
                  { name: 'SafeManager', address: '0x05be8041f47bd935d8ce98e3b5b2ded6540acc6d4e24c64f3822927c5339eac6' },
                  { name: 'SafeEngine', address: '0x02f4f6c374c20ddf3ea5e59cc70f2ad4c2bfb5786ca6c146266f89f7da575421' },
                  { name: 'CollateralJoin', address: '0x0362bd21cf4fd2ada59945e27c0fe10802dde0061e6aeeae0dd81b80669b4687' },
                  { name: 'wBTC', address: '0x04ab76b407a4967de3683d387c598188d436d22d51416e8c8783156625874e20' },
                  { name: 'PID Controller', address: '0x01cae0b0de880d26d09a52a4c6e33dcd189fa1bcf40986103d3c3eb46a66eec5' },
                  { name: 'Grinta Hook', address: '0x07a17830f3aecf5a22ecfea9f3f88cb6eafd9abc425505b167755e21246d9b14' }
                ].map((contract, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#0a1a10] p-4 rounded-xl border border-[#4ADE80]/10 hover:border-[#4ADE80]/40 transition duration-300">
                    <span className="text-white font-medium" style={{ fontFamily: 'Space Grotesk' }}>{contract.name}</span>
                    <a href={`https://starkscan.co/contract/${contract.address}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4ADE80] hover:text-white transition-colors truncate w-32 md:w-48 text-right font-mono">
                      {contract.address.slice(0, 6)}...{contract.address.slice(-4)} ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Profiles */}
            <div className="border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors bg-black/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-[#4ADE80] mb-6" style={{ fontFamily: 'Syncopate' }}>Agent Profiles</h3>
              <div className="flex flex-col gap-6 h-full">
                {[
                  { name: 'motx', link: 'https://social.moltx.io/grinta' },
                  { name: '4claw', link: 'https://social.moltx.io/grinta' },
                  { name: 'moltbook', link: 'https://social.moltx.io/grinta' }
                ].map((agent, i) => (
                  <div key={i} className="group relative overflow-hidden bg-[#0a1a10] p-6 rounded-xl border border-[#4ADE80]/10 hover:border-[#4ADE80]/40 transition duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-black border border-[#4ADE80]/30 shadow-[0_0_10px_rgba(74,222,128,0.2)] flex items-center justify-center text-[#4ADE80] font-bold text-lg" style={{ fontFamily: 'Syncopate' }}>
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xl font-bold text-white group-hover:text-[#4ADE80] transition-colors" style={{ fontFamily: 'Space Grotesk', textTransform: 'capitalize' }}>{agent.name}</span>
                    </div>
                    <a href={agent.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-[#4ADE80] text-[#4ADE80] rounded hover:bg-[#4ADE80] hover:text-black transition-all font-bold text-sm" style={{ fontFamily: 'Space Grotesk', textTransform: 'uppercase' }}>
                      Profile ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* --- BACKED BY --- */}
        <section id="about" className="section-dark" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10vw 5vw', backgroundColor: '#050505', borderTop: '1px solid #111' }}>
          <div className="text-center mb-12 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Syncopate' }}>Backed by</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Grinta Protocol is researched and developed by Reflecter Labs, a lab focused on the intersection of DeFi, Artificial Intelligence, and advanced cryptography.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-5xl border border-white/10 rounded-3xl py-16 px-8 md:py-24 md:px-16 bg-black/50 backdrop-blur-sm hover:border-white/30 transition-colors">
            <div className="flex justify-center md:justify-end items-center border-b md:border-b-0 md:border-r border-white/10 pb-10 md:pb-0 md:pr-16">
              <img src={LogoReflecterLabs} alt="Reflecter Labs Logo" className="max-h-32 md:max-h-48 object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center md:justify-start items-center pt-10 md:pt-0 md:pl-16">
              <a href="https://www.reflecterlabs.xyz" target="_blank" rel="noopener noreferrer" className="cta-btn magnetic px-10 py-4 md:py-5 text-center text-sm md:text-base">
                <span>Visit Reflecter Labs ↗</span>
              </a>
            </div>
          </div>
        </section>

        <footer style={{ height: '40vh', background: '#e0e0e0', color: '#030303', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: 'Syncopate', fontSize: '3rem', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>GRINTA</Link>
          </h2>
          <p>© 2026 Grinta Protocol. All rights reserved. Built for humans and the agent economy.</p>
        </footer>
      </div>
    </div>
  );
}
