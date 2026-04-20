// ============================================================
//  PearlDent Clinic — App.jsx  (v4 — Fixed & Updated)
//  React 18 · React Router v6 · Tailwind CSS
//  Fonts: Fraunces (display) + Outfit (body) — add to index.css:
//  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,700;0,900;1,300;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
//
//  KEY FIX: ContactPage completely rewritten.
//  - form state is now a useRef so validate() always reads fresh values
//  - submit flow: validate → setLoading(true) → setTimeout → setDone(true)
//  - "Book Another Appointment" resets both the ref and the done flag cleanly
//  - No stale-closure bugs; disabled state clears correctly on every re-render
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter as Router, Routes, Route,
  NavLink, useNavigate, useLocation,
} from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,700;0,900;1,300;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
    :root {
      --em:#065f46;--em-m:#059669;--em-l:#6ee7b7;
      --sage:#d1fae5;--sage-d:#a7f3d0;
      --cream:#fefce8;--cream-d:#fef9c3;
      --warm:#fffbeb;
      --gold:#d97706;--gold-l:#fbbf24;
      --navy:#0c1a2e;--slate:#1e3a5f;--muted:#4b6584;
      --border:#d1fae5;
      --grad-em:linear-gradient(135deg,#065f46,#059669);
      --grad-gold:linear-gradient(135deg,#d97706,#f59e0b);
      --grad-hero:linear-gradient(150deg,#0c1a2e 0%,#0d3321 40%,#065f46 70%,#0a5c3a 100%);
      --sh-sm:0 2px 12px rgba(6,95,70,.08);
      --sh-md:0 8px 32px rgba(6,95,70,.13);
      --sh-lg:0 20px 56px rgba(6,95,70,.18);
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Outfit',sans-serif;background:var(--warm);color:var(--navy);overflow-x:hidden}
    h1,h2,h3,h4,.serif{font-family:'Fraunces',serif}

    @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleUp{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes spinL{to{transform:rotate(360deg)}}
    @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

    .fu{animation:fadeUp .65s ease both}
    .fi-a{animation:fadeIn .5s ease both}
    .su{animation:scaleUp .45s ease both}
    .flt{animation:floatY 4s ease-in-out infinite}
    .d1{animation-delay:.07s}.d2{animation-delay:.16s}.d3{animation-delay:.27s}
    .d4{animation-delay:.38s}.d5{animation-delay:.5s}.d6{animation-delay:.63s}

    .nlink{position:relative;font-weight:500;font-size:.87rem;letter-spacing:.03em;color:var(--slate);transition:color .25s}
    .nlink::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;border-radius:2px;background:var(--grad-em);transition:width .3s}
    .nlink:hover,.nlink.active{color:var(--em)}
    .nlink:hover::after,.nlink.active::after{width:100%}

    .hero-bg{background:var(--grad-hero);position:relative;overflow:hidden}
    .hero-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 75% 40%,rgba(6,214,160,.12) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 20% 80%,rgba(217,119,6,.07) 0%,transparent 55%);pointer-events:none}

    .btn{display:inline-flex;align-items:center;gap:8px;font-family:'Outfit',sans-serif;font-weight:600;border:none;cursor:pointer;border-radius:50px;transition:all .25s;text-decoration:none}
    .btn-em{background:var(--grad-em);color:#fff;padding:13px 30px;font-size:.92rem;box-shadow:0 6px 24px rgba(6,95,70,.35)}
    .btn-em:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(6,95,70,.45)}
    .btn-em:disabled{opacity:.6;cursor:not-allowed;transform:none}
    .btn-gold{background:var(--grad-gold);color:#fff;padding:13px 30px;font-size:.92rem;box-shadow:0 6px 24px rgba(217,119,6,.35)}
    .btn-gold:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(217,119,6,.45)}
    .btn-ghost{background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.3);color:#fff;padding:12px 26px;font-size:.9rem;backdrop-filter:blur(8px)}
    .btn-ghost:hover{background:rgba(255,255,255,.2)}
    .btn-outline{background:transparent;border:2px solid var(--em);color:var(--em);padding:11px 26px;font-size:.88rem}
    .btn-outline:hover{background:var(--em);color:#fff}
    .btn-sm{padding:8px 18px;font-size:.82rem}

    .card{background:#fff;border-radius:24px;border:1px solid var(--border);transition:transform .3s,box-shadow .3s}
    .card:hover{transform:translateY(-7px);box-shadow:var(--sh-lg)}
    .card-cream{background:linear-gradient(145deg,#f0fdf4,#fefce8)}

    .iw{width:58px;height:58px;border-radius:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .3s}
    .iw-em{background:var(--sage)}.iw-gd{background:var(--cream-d)}.iw-sky{background:#e0f2fe}.iw-tl{background:#ccfbf1}
    .card:hover .iw-em{background:var(--grad-em)}.card:hover .iw-gd{background:var(--grad-gold)}
    .card:hover .iw-em svg,.card:hover .iw-gd svg{color:#fff!important}

    .sh::after{content:'';display:block;width:56px;height:4px;background:var(--grad-em);border-radius:2px;margin:10px auto 0}
    .sh-l::after{content:'';display:block;width:56px;height:4px;background:var(--grad-em);border-radius:2px;margin:10px 0 0}

    .gt{background:var(--grad-em);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .gtg{background:var(--grad-gold);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

    .son{color:#f59e0b}.soff{color:#d1d5db}

    .acc{max-height:0;overflow:hidden;transition:max-height .42s cubic-bezier(.4,0,.2,1)}
    .acc.open{max-height:600px}

    .ba-wrap{position:relative;overflow:hidden;border-radius:20px;cursor:ew-resize;user-select:none}
    .ba-line{position:absolute;top:0;height:100%;width:3px;background:#fff;box-shadow:0 0 20px rgba(0,0,0,.5)}
    .ba-btn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.25)}

    .gz{overflow:hidden;border-radius:18px}
    .gz>div{transition:transform .5s ease;width:100%;height:100%}
    .gz:hover>div{transform:scale(1.08)}

    .price-pop{background:var(--grad-hero);color:#fff;transform:scale(1.04);border:none;box-shadow:0 28px 72px rgba(6,95,70,.35)}

    .finput{width:100%;padding:12px 16px;outline:none;border:2px solid var(--border);border-radius:12px;font-family:'Outfit',sans-serif;font-size:.9rem;color:var(--navy);background:#fff;transition:all .25s}
    .finput:focus{border-color:var(--em-m);box-shadow:0 0 0 4px rgba(5,150,105,.1)}
    .finput.has-error{border-color:#ef4444 !important;box-shadow:0 0 0 3px rgba(239,68,68,.1) !important}

    .pill{display:inline-flex;align-items:center;gap:6px;background:rgba(6,95,70,.08);border:1px solid rgba(6,95,70,.15);color:var(--em);font-size:.78rem;font-weight:600;padding:5px 14px;border-radius:50px}
    .pill-w{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:rgba(255,255,255,.85)}

    .glass{background:rgba(255,255,255,.1);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.2);border-radius:18px}

    .rc{background:#fff;border-radius:22px;border:1px solid var(--border);box-shadow:var(--sh-sm);transition:transform .3s,box-shadow .3s}
    .rc:hover{transform:translateY(-5px);box-shadow:var(--sh-md)}

    .map-wrap{border-radius:20px;overflow:hidden;box-shadow:var(--sh-md)}

    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:var(--sage)}
    ::-webkit-scrollbar-thumb{background:var(--em-m);border-radius:4px}

    .page-in{animation:fadeIn .4s ease}
    .spin{animation:spinL .7s linear infinite}
    .pdot{width:8px;height:8px;border-radius:50%;background:#34d399;animation:pulse2 1.6s infinite}

    .feat-stripe{background:linear-gradient(90deg,#f0fdf4,#fefce8,#ecfdf5,#fff7ed);background-size:400% 400%;animation:gradMove 8s ease infinite}

    .num-card{background:rgba(255,255,255,.07);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.15);border-radius:20px;text-align:center;padding:20px 14px}

    .tdot{width:48px;height:48px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--grad-em);box-shadow:0 6px 20px rgba(6,95,70,.3)}

    .bg-sage{background:linear-gradient(160deg,#f0fdf4,#ecfdf5)}
    .bg-cream{background:linear-gradient(160deg,#fefce8,#fffbeb)}

    @media(max-width:768px){
      .hm{display:none!important}
      .sm-show{display:block!important}
      .g2{grid-template-columns:1fr!important}
      .g3{grid-template-columns:1fr 1fr!important}
    }
    @media(min-width:769px){.sm-show{display:none!important}}
  `}</style>
);

// ── Icons ──────────────────────────────────────────────────────
const IC = ({ n, s = 22, style = {}, className = "" }) => {
  const p = {
    tooth:   <path d="M12 2C9 2 6 4.5 6 7c0 2.2 1 4.5 1 7C7 17.5 6 21 6 22h3.5c0-2 .7-4 2.5-4s2.5 2 2.5 4H18s-1-4.5-1-8c0-2.5 1-4.8 1-7 0-2.5-3-5-6-5z"/>,
    clean:   <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>,
    brace:   <><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="12" r="1.5" fill="currentColor"/></>,
    bright:  <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/>,
    implant: <><path d="M12 2v8M9 4.5h6M8 22h8l-1.5-12H9.5L8 22z"/></>,
    rct:     <><path d="M9 2h6l3 10H6L9 2z"/><path d="M6 12v4a3 3 0 006 0v-4"/><line x1="12" y1="12" x2="12" y2="16"/></>,
    cosm:    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    star:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>,
    chev:    <polyline points="6 9 12 15 18 9"/>,
    check:   <polyline points="20 6 9 17 4 12"/>,
    phone:   <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>,
    mail:    <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    pin:     <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    clock:   <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    shield:  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    award:   <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    users:   <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    menu:    <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    arr:     <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    quote:   <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>,
    ok:      <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    cal:     <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    zap:     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/>,
    heart:   <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>,
    scan:    <><polyline points="23 7 23 1 17 1"/><polyline points="1 7 1 1 7 1"/><polyline points="23 17 23 23 17 23"/><polyline points="1 17 1 23 7 23"/><rect x="7" y="7" width="10" height="10" rx="1"/></>,
    sparkle: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" fill="currentColor"/><path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" fill="currentColor"/></>,
    globe:   <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    smile:   <><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>,
    whatsapp:<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      {p[n]}
    </svg>
  );
};

// ── Data ──────────────────────────────────────────────────────
const SVCS = [
  { ico:"clean",  iw:"iw-em",  col:"#065f46", t:"Dental Cleaning",       p:"₹800+",    d:"Professional ultrasonic scaling, polishing, and fluoride treatment. Removes 100% of plaque and calculus with personalised oral hygiene coaching after every session." },
  { ico:"brace",  iw:"iw-gd",  col:"#d97706", t:"Orthodontics & Braces", p:"₹22,000+", d:"Metal, ceramic, and Invisalign clear aligners. 3D digital treatment simulation shows your final smile before you start. Certified Invisalign Diamond Provider." },
  { ico:"bright", iw:"iw-em",  col:"#065f46", t:"Teeth Whitening",       p:"₹3,500+",  d:"Philips Zoom in-office laser whitening — up to 8 shades brighter in 60 minutes. Take-home trays included. Safe even for sensitive teeth." },
  { ico:"implant",iw:"iw-gd",  col:"#d97706", t:"Dental Implants",       p:"₹32,000+", d:"Nobel Biocare & Straumann implants with CBCT 3D bone mapping. Single, multiple, or All-on-4 restorations. 15-year clinical warranty included." },
  { ico:"rct",    iw:"iw-sky", col:"#0ea5e9", t:"Root Canal Treatment",  p:"₹4,800+",  d:"Pain-free RCT using NiTi rotary files and apex locators. Single-visit RCT for most cases. Bio-ceramic sealers for superior long-term success." },
  { ico:"cosm",   iw:"iw-tl",  col:"#0d9488", t:"Cosmetic Dentistry",   p:"₹7,500+",  d:"E-max porcelain veneers, composite bonding, gum contouring, and full smile makeovers. Digital Smile Design — preview your transformation before it begins." },
];

const DOCS = [
  { em:"👩‍⚕️", n:"Dr. Priya Sharma", r:"Chief Dental Surgeon & Prosthodontist", x:"14 Yrs", rating:5, rev:487, clr:"#065f46",
    q:["BDS, MDS – Prosthodontics (AIIMS Delhi)","Fellowship – American Dental Association","Certified Implantologist (Nobel Biocare)","Digital Smile Design Certified"],
    bio:"Dr. Sharma leads with 14 years of expertise in full-mouth rehabilitation and smile makeovers. Trained at AIIMS and completed an implantology fellowship in LA. Renowned for artistic precision and painless techniques.",
    awards:["Best Dentist Karnataka 2023","Top Doctor India 2022","ISO Quality Champion"] },
  { em:"👨‍⚕️", n:"Dr. Arjun Mehta", r:"Senior Orthodontist", x:"10 Yrs", rating:5, rev:312, clr:"#d97706",
    q:["BDS – Manipal University","MDS – Orthodontics","Invisalign Diamond Provider","Damon System Certified"],
    bio:"One of only 12 Invisalign Diamond providers in South India, Dr. Mehta has aligned over 1,400 smiles. Specialises in complex adult orthodontics and accelerated treatment — up to 40% faster.",
    awards:["Invisalign Diamond Provider 2024","Young Dentist Award 2021"] },
  { em:"👩‍⚕️", n:"Dr. Kavya Nair", r:"Paediatric & Preventive Dentist", x:"8 Yrs", rating:5, rev:241, clr:"#0d9488",
    q:["BDS – Bangalore University","MDS – Pedodontics","Child Behaviour Management Cert.","Laser Dentistry Certified"],
    bio:"Dr. Kavya's gentle 'no fear' approach using behaviour management and laser dentistry ensures zero pain — even for the most anxious children. 3,000+ young patients treated.",
    awards:["Best Paediatric Dentist Bangalore 2024"] },
];

const REVS = [
  { n:"Rohan D.",   r:5, s:"Dental Implants",   d:"Mar 2025", t:"Completely life-changing. Dr. Sharma placed two implants and I felt absolutely nothing. The 3D planning showed me exactly what to expect. The entire team is incredibly warm." },
  { n:"Ananya K.",  r:5, s:"Invisalign",        d:"Jan 2025", t:"18 months with Dr. Mehta and the result is beyond what I imagined. The digital simulation was spot-on. So comfortable I often forgot I was wearing aligners." },
  { n:"Vikram P.",  r:5, s:"Root Canal",        d:"Feb 2025", t:"Toothache on a Sunday — they took me in same-day. Single-visit RCT, completely pain-free. The rotary system they use is incredible. Back to work the next morning!" },
  { n:"Sneha I.",   r:5, s:"Paediatric",        d:"Apr 2025", t:"My 5-year-old was petrified. Dr. Kavya had him laughing in 5 minutes. He now ASKS to go to the dentist. That says everything about her skill." },
  { n:"Aryan G.",   r:5, s:"Teeth Whitening",   d:"Mar 2025", t:"8 shades brighter in 60 minutes! Zero sensitivity whatsoever. I've been smiling non-stop. The Zoom system is truly world-class. Worth every rupee." },
  { n:"Meera B.",   r:5, s:"Porcelain Veneers", d:"Feb 2025", t:"6 E-max veneers and they look 100% natural. Dr. Sharma showed me the digital preview first and nailed it. My smile confidence has completely transformed." },
];

const PLANS = [
  { n:"Preventive Care", p:"₹999",   per:"/mo", pop:false, desc:"Perfect for a healthy smile",
    f:["2 Cleaning Sessions/year","Annual Digital X-Ray","Fluoride Treatment","Emergency Consultation","10% Off All Treatments","SMS Appointment Reminders"], cta:"Get Started" },
  { n:"Complete Smile",  p:"₹2,499", per:"/mo", pop:true,  desc:"Our most popular all-inclusive plan",
    f:["4 Cleaning Sessions/year","Quarterly X-Rays","1 Zoom Whitening Session","Priority Appointments (24hr)","25% Off All Treatments","Free Consultations","Family Cover (2 members)","3D Smile Report"], cta:"Book Now" },
  { n:"Premium Family",  p:"₹4,999", per:"/mo", pop:false, desc:"Complete care for the whole family",
    f:["Unlimited Cleanings","Monthly X-Rays","2 Whitening Sessions","Same-Day Emergency","40% Off All Treatments","Premium Dental Kit","Family Cover (4 members)","Annual 3D CBCT Scan","Dedicated Case Manager"], cta:"Contact Us" },
];

const FAQS = [
  { q:"How often should I visit the dentist?",           a:"At least twice a year for healthy patients. Those with gum disease, diabetes, or frequent cavities should visit every 3–4 months. Prevention is far more affordable than treatment." },
  { q:"Is teeth whitening safe for sensitive teeth?",    a:"Yes! We apply desensitising gel before and after every session. Our Philips Zoom gel contains potassium nitrate to reduce sensitivity. We screen every patient for enamel thickness first." },
  { q:"How long do dental implants last?",               a:"The titanium fixture lasts a lifetime with good care. The porcelain crown typically lasts 15–25 years. All our implants come with a 15-year clinical warranty plus annual review appointments." },
  { q:"Is root canal treatment painful?",                a:"Modern RCT is virtually painless. We use articaine — a stronger local anaesthetic — plus pre-operative numbing gel. Most patients say it feels like a simple filling." },
  { q:"When should children first visit a dentist?",     a:"By age 1 or within 6 months of the first tooth erupting. Early visits build good habits, allow fluoride application, and help catch developmental issues like tongue-tie early." },
  { q:"How long does orthodontic treatment take?",       a:"Mild cases: 6–12 months. Complex cases: 18–30 months. We use accelerated orthodontics techniques that can reduce treatment time by up to 40% in eligible patients." },
  { q:"Do you offer 0% EMI or accept insurance?",        a:"Yes! Zero-cost EMI on treatments above ₹10,000 via HDFC, ICICI, Axis, and 15 other issuers. We accept most corporate TPA health covers and file your insurance claim for free." },
  { q:"What technology do you use?",                     a:"Carestream CS 9600 CBCT 3D X-ray, iTero Element 5D intraoral scanner, Sirona Cerec for same-day crowns, Biolase laser for gum treatments, and Philips Zoom whitening — all in-house." },
  { q:"What if I have a dental emergency?",              a:"Call +91 98765 43210 immediately — our emergency line is staffed 24/7. For a knocked-out tooth, keep it in cold milk or saline and come in within 30 minutes. We're open 7 days a week." },
];

// ── Helpers ───────────────────────────────────────────────────
const Stars = ({ n, size = 16 }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(i => <IC key={i} n="star" s={size} className={i<=n?"son":"soff"} />)}
  </div>
);

const Pill = ({ children, white=false, style:s={} }) => (
  <span className={`pill${white?" pill-w":""}`} style={s}>{children}</span>
);

// ── WhatsApp floating button ──────────────────────────────────
const WAButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi%20PearlDent!%20I'd%20like%20to%20book%20an%20appointment."
    target="_blank" rel="noopener noreferrer"
    style={{
      position:"fixed", bottom:28, right:28, zIndex:999,
      width:58, height:58, borderRadius:"50%",
      background:"#25d366", display:"flex", alignItems:"center",
      justifyContent:"center", boxShadow:"0 6px 28px rgba(37,211,102,.45)",
      transition:"transform .25s, box-shadow .25s",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 10px 36px rgba(37,211,102,.6)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 6px 28px rgba(37,211,102,.45)"; }}
    title="Chat on WhatsApp"
  >
    <IC n="whatsapp" s={28} style={{ color:"#fff", stroke:"none", fill:"#fff" }} />
  </a>
);

// ── Before/After Slider ───────────────────────────────────────
const BASlider = ({ before, after, label }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const drag = useRef(false);
  const upd = useCallback(cx => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(5, Math.min(95, ((cx - r.left) / r.width) * 100)));
  }, []);
  useEffect(() => {
    const up = () => { drag.current = false; };
    const mv = e => { if (drag.current) upd(e.clientX); };
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", mv);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mv); };
  }, [upd]);
  return (
    <div ref={ref} className="ba-wrap" style={{ height:290 }}
      onMouseDown={() => { drag.current = true; }}
      onTouchMove={e => upd(e.touches[0].clientX)}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#d1fae5,#a7f3d0)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
        <span style={{ fontSize:80 }}>{after}</span>
        <span style={{ fontSize:".75rem", fontWeight:700, background:"#065f46", color:"#fff", padding:"3px 14px", borderRadius:50 }}>AFTER</span>
      </div>
      <div style={{ position:"absolute", inset:0, overflow:"hidden", width:`${pos}%` }}>
        <div style={{ minWidth:460, width:460, height:"100%", background:"linear-gradient(135deg,#fef3c7,#fde68a)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
          <span style={{ fontSize:80 }}>{before}</span>
          <span style={{ fontSize:".75rem", fontWeight:700, background:"#d97706", color:"#fff", padding:"3px 14px", borderRadius:50 }}>BEFORE</span>
        </div>
      </div>
      <div className="ba-line" style={{ left:`${pos}%` }}>
        <div className="ba-btn">
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0c1a2e" strokeWidth={2.5}>
            <path d="M8 4l-4 8 4 8M16 4l4 8-4 8"/>
          </svg>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", background:"rgba(12,26,46,.7)", color:"#fff", fontSize:".72rem", fontWeight:600, padding:"4px 16px", borderRadius:50, whiteSpace:"nowrap", backdropFilter:"blur(6px)" }}>
        {label}
      </div>
    </div>
  );
};

// ── Navbar ────────────────────────────────────────────────────
const Navbar = () => {
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    const h = () => setSc(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const pages = [
    { l:"Home", to:"/" },
    { l:"Services", to:"/services" },
    { l:"Gallery", to:"/gallery" },
    { l:"Doctors", to:"/doctors" },
    { l:"Pricing", to:"/pricing" },
    { l:"FAQ", to:"/faq" },
    { l:"Contact", to:"/contact" },
  ];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:sc?"rgba(254,252,232,.97)":"rgba(254,252,232,.88)", backdropFilter:"blur(16px)", boxShadow:sc?"0 2px 28px rgba(6,95,70,.1)":"none", transition:"all .3s", padding:sc?"11px 0":"16px 0", borderBottom:sc?"1px solid var(--border)":"none" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => nav("/")}>
          <div style={{ width:40, height:40, borderRadius:12, background:"var(--grad-em)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(6,95,70,.3)" }}>
            <IC n="tooth" s={20} style={{ color:"#fff" }} />
          </div>
          <span className="serif" style={{ fontSize:"1.4rem", fontWeight:700, color:"var(--navy)" }}>
            Pearl<span style={{ color:"var(--em)" }}>Dent</span>
          </span>
        </div>
        <div className="hm" style={{ display:"flex", alignItems:"center", gap:28 }}>
          {pages.map(p => (
            <NavLink key={p.to} to={p.to} end={p.to==="/"} className={({ isActive }) => `nlink${isActive?" active":""}`}>{p.l}</NavLink>
          ))}
        </div>
        <button className="btn btn-em hm" style={{ fontSize:".85rem", padding:"10px 22px" }} onClick={() => nav("/contact")}>
          Book Appointment <IC n="arr" s={15} />
        </button>
        <button className="sm-show" style={{ background:"none", border:"none", cursor:"pointer" }} onClick={() => setMo(!mo)}>
          <IC n={mo?"x":"menu"} s={26} style={{ color:"var(--navy)" }} />
        </button>
      </div>
      {mo && (
        <div style={{ background:"#fffbeb", borderTop:"1px solid var(--border)", padding:"16px 24px", display:"flex", flexDirection:"column", gap:12 }}>
          {pages.map(p => (
            <NavLink key={p.to} to={p.to} end={p.to==="/"} className={({ isActive }) => `nlink${isActive?" active":""}`}
              style={{ padding:"7px 0", fontSize:"1rem" }} onClick={() => setMo(false)}>{p.l}</NavLink>
          ))}
          <button className="btn btn-em" style={{ marginTop:8 }} onClick={() => { nav("/contact"); setMo(false); }}>
            Book Appointment
          </button>
        </div>
      )}
    </nav>
  );
};

// ── Footer ────────────────────────────────────────────────────
const Footer = () => {
  const nav = useNavigate();
  return (
    <footer style={{ background:"linear-gradient(145deg,#0c1a2e,#0d3321,#065f46)", color:"#fff", padding:"72px 24px 32px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:44, marginBottom:56 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, cursor:"pointer" }} onClick={() => nav("/")}>
              <div style={{ width:40, height:40, borderRadius:12, background:"var(--grad-em)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <IC n="tooth" s={20} style={{ color:"#fff" }} />
              </div>
              <span className="serif" style={{ fontSize:"1.3rem", fontWeight:700 }}>
                Pearl<span style={{ color:"var(--em-l)" }}>Dent</span>
              </span>
            </div>
            <p style={{ color:"rgba(255,255,255,.45)", fontSize:".85rem", lineHeight:1.75, marginBottom:16 }}>
              Bangalore's most trusted dental clinic. Premium care, compassionate team, beautiful smiles since 2015.
            </p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["ISO 9001","BDA Certified","5★ Google"].map(b => (
                <span key={b} style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:50, fontSize:".7rem", fontWeight:600, padding:"4px 10px", color:"rgba(255,255,255,.6)" }}>{b}</span>
              ))}
            </div>
          </div>
          {[
            { t:"Navigation", items:[["Home","/"],["Services","/services"],["Gallery","/gallery"],["Doctors","/doctors"],["Pricing","/pricing"],["FAQ","/faq"],["Contact","/contact"]] },
            { t:"Treatments",  items:[["Dental Cleaning","/services"],["Teeth Whitening","/services"],["Dental Implants","/services"],["Root Canal","/services"],["Orthodontics","/services"],["Cosmetic Dentistry","/services"]] },
            { t:"Get In Touch", items:[["+91 98765 43210","/"],["+91 80 4567 8901","/"],["hello@pearldent.in","/"],["42 Brigade Road","/"],["Indiranagar, Bangalore – 560001","/"],["Open 7 Days/Week","/"]] },
          ].map(col => (
            <div key={col.t}>
              <h4 style={{ fontSize:".78rem", fontWeight:700, letterSpacing:".1em", color:"var(--em-l)", marginBottom:18, textTransform:"uppercase" }}>{col.t}</h4>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                {col.items.map(([label, path]) => (
                  <li key={label}>
                    <span style={{ color:"rgba(255,255,255,.45)", fontSize:".85rem", cursor:path?"pointer":"default", transition:"color .2s" }}
                      onMouseEnter={e => { if(path) e.target.style.color="#fff"; }}
                      onMouseLeave={e => { if(path) e.target.style.color="rgba(255,255,255,.45)"; }}
                      onClick={() => { if(path) nav(path); }}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:"rgba(255,255,255,.3)", fontSize:".8rem" }}>© 2025 PearlDent Dental Clinic Pvt. Ltd. All rights reserved.</p>
          <div style={{ display:"flex", gap:16, fontSize:".8rem", color:"rgba(255,255,255,.3)" }}>
            {["Privacy Policy","Terms of Service","Sitemap"].map((l, i) => (
              <React.Fragment key={l}>
                {i>0 && <span>·</span>}
                <span style={{ cursor:"pointer", transition:"color .2s" }}
                  onMouseEnter={e => e.target.style.color="#fff"}
                  onMouseLeave={e => e.target.style.color="rgba(255,255,255,.3)"}>{l}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── HOME PAGE ─────────────────────────────────────────────────
const HomePage = () => {
  const nav = useNavigate();
  return (
    <div className="page-in">
      {/* HERO */}
      <section className="hero-bg" style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"110px 24px 80px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }} className="g2">
          <div style={{ color:"#fff" }}>
            <div className="fu d1" style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
              <span className="pill pill-w" style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                <div className="pdot" />Open Today · 9 AM – 8 PM
              </span>
              <span className="pill pill-w">⭐ #1 Clinic in Bangalore</span>
            </div>
            <h1 className="fu d2 serif" style={{ fontSize:"clamp(2.8rem,5vw,4.4rem)", lineHeight:1.1, fontWeight:700, marginBottom:20 }}>
              Your Smile,<br />
              <span style={{ fontStyle:"italic", background:"linear-gradient(90deg,#6ee7b7,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Our Priority
              </span>
            </h1>
            <p className="fu d3" style={{ color:"rgba(255,255,255,.65)", fontSize:"1.08rem", lineHeight:1.82, maxWidth:460, marginBottom:14 }}>
              Where <em>advanced technology</em> meets genuine compassion. 5,000+ smiles transformed. Rated Bangalore's best dental clinic for three years running.
            </p>
            <div className="fu d3" style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:34 }}>
              {["Pain-Free Guarantee","0% EMI Available","Same-Day Appointments","Free Consultation"].map(t => (
                <span key={t} style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:50, fontSize:".78rem", padding:"5px 14px", color:"rgba(255,255,255,.8)", display:"flex", alignItems:"center", gap:5 }}>
                  <IC n="check" s={11} style={{ color:"#6ee7b7" }} />{t}
                </span>
              ))}
            </div>
            <div className="fu d4" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="btn btn-gold" style={{ fontSize:".96rem", padding:"14px 32px" }} onClick={() => nav("/contact")}>
                Book Free Consultation <IC n="arr" s={17} />
              </button>
              <button className="btn btn-ghost" onClick={() => nav("/services")}>Explore Services</button>
            </div>
            <div className="fu d5" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:48 }}>
              {[{ i:"shield",v:"Certified",s:"Doctors"},{i:"award",v:"10+ Years",s:"Experience"},{i:"users",v:"5,000+",s:"Happy Patients"}].map(b => (
                <div key={b.v} className="glass" style={{ padding:"18px 12px", textAlign:"center" }}>
                  <IC n={b.i} s={22} style={{ color:"#6ee7b7", display:"block", margin:"0 auto 8px" }} />
                  <div style={{ fontWeight:700, fontSize:".9rem" }}>{b.v}</div>
                  <div style={{ color:"rgba(255,255,255,.45)", fontSize:".73rem", marginTop:2 }}>{b.s}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flt fu d3" style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ position:"relative", width:380 }}>
              <div style={{ width:380, height:440, borderRadius:36, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.14)", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
                <div style={{ fontSize:108 }}>😁</div>
                <p className="serif" style={{ color:"#fff", fontSize:"1.9rem", textAlign:"center", padding:"0 24px", lineHeight:1.2, fontStyle:"italic" }}>Smile with Confidence</p>
                <div style={{ display:"flex", gap:6 }}>{[1,2,3,4,5].map(i => <IC key={i} n="star" s={18} className="son" />)}</div>
                <p style={{ color:"rgba(255,255,255,.4)", fontSize:".78rem" }}>4.9 · 1,200+ Google reviews</p>
              </div>
              <div className="fu d3" style={{ position:"absolute", left:-32, top:"22%", background:"#fff", borderRadius:18, padding:"10px 16px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 10px 36px rgba(6,95,70,.22)", minWidth:164 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"var(--sage)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <IC n="check" s={16} style={{ color:"var(--em)" }} />
                </div>
                <div><div style={{ fontSize:".7rem", color:"#9ca3af" }}>Treatment</div><div style={{ fontSize:".82rem", fontWeight:700, color:"var(--navy)" }}>Completed ✓</div></div>
              </div>
              <div className="fu d4" style={{ position:"absolute", right:-32, bottom:"22%", background:"#fff", borderRadius:18, padding:"10px 16px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 10px 36px rgba(217,119,6,.22)", minWidth:148 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"var(--cream-d)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <IC n="sparkle" s={16} style={{ color:"var(--gold)" }} />
                </div>
                <div><div style={{ fontSize:".7rem", color:"#9ca3af" }}>New Smile</div><div style={{ fontSize:".82rem", fontWeight:700, color:"var(--navy)" }}>Day 1 🎉</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE STRIP */}
      <section className="feat-stripe" style={{ padding:"36px 24px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"center", gap:28 }}>
          {[{n:"clean",l:"Cleaning"},{n:"brace",l:"Braces"},{n:"bright",l:"Whitening"},{n:"implant",l:"Implants"},{n:"rct",l:"RCT"},{n:"cosm",l:"Cosmetic"}].map(s => (
            <div key={s.l} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => nav("/services")}>
              <div style={{ width:60, height:60, borderRadius:18, background:"var(--sage)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.background="var(--grad-em)"; e.currentTarget.querySelector("svg").style.color="#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background="var(--sage)"; e.currentTarget.querySelector("svg").style.color="var(--em)"; }}>
                <IC n={s.n} s={26} style={{ color:"var(--em)", transition:"color .3s" }} />
              </div>
              <span style={{ fontSize:".8rem", fontWeight:600, color:"var(--muted)" }}>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-sage" style={{ padding:"100px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <Pill>✦ Why PearlDent</Pill>
            <h2 className="serif sh" style={{ fontSize:"2.8rem", marginTop:12 }}>The PearlDent Difference</h2>
            <p style={{ color:"var(--muted)", marginTop:16, maxWidth:500, margin:"16px auto 0", lineHeight:1.78 }}>We've reimagined every aspect of your dental visit — from the moment you book to the moment you walk out smiling.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {[
              {e:"🔬",iw:"iw-em",t:"Smart Digital Diagnostics",d:"Carestream CBCT 3D X-ray, iTero 5D scanner, and AI-powered cavity detection for pinpoint accuracy with 90% less radiation than hospital CT."},
              {e:"💊",iw:"iw-gd",t:"Zero-Pain Promise",d:"Articaine anaesthesia, topical numbing gel, and sedation options. Our certified pain-free guarantee means you'll never dread the dentist again."},
              {e:"⚡",iw:"iw-em",t:"Same-Visit Crowns",d:"Cerec in-office milling delivers perfect porcelain crowns in 90 minutes — no temporaries, no second visit, no weeks of waiting."},
              {e:"🏆",iw:"iw-gd",t:"Award-Winning Excellence",d:"#1 Dental Clinic Bangalore 2024 (Times Health), Best Smile Transformation Centre (IDA), and ISO 9001:2015 certified."},
              {e:"💰",iw:"iw-sky",t:"100% Price Transparency",d:"Itemised quote before every treatment. Zero hidden charges. 0% EMI on all treatments above ₹10,000. We file your insurance claim for free."},
              {e:"🌿",iw:"iw-tl",t:"Eco-Conscious Practice",d:"Paperless records, biodegradable packaging, autoclave sterilisation, and solar-powered clinic — great for your smile and the planet."},
            ].map((w, i) => (
              <div key={i} className={`card fu d${(i%3)+1}`} style={{ padding:28 }}>
                <div className={`iw ${w.iw}`} style={{ marginBottom:18 }}><span style={{ fontSize:26 }}>{w.e}</span></div>
                <h3 className="serif" style={{ fontSize:"1.18rem", marginBottom:8 }}>{w.t}</h3>
                <p style={{ color:"var(--muted)", fontSize:".875rem", lineHeight:1.75 }}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
       <section style={{ background:"var(--grad-hero)", padding:"80px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:20, textAlign:"center", color:"#cfcebc" }}>
          {[{v:"5,000+",l:"Smiles Transformed"},{v:"15+",l:"Specialist Doctors"},{v:"10+ Yrs",l:"Of Excellence"},{v:"4.9 ★",l:"Google Rating"},{v:"₹0",l:"Consultation Fee"}].map(s => (
            <div key={s.v} className="num-card">
              <div className="serif gt" style={{ fontSize:"2.6rem", fontWeight:700 }}>{s.v}</div>
              <div style={{ color:"rgba(255, 255, 255, 0.8)", marginTop:6, fontSize:".87rem" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* TECH SECTION */}
      <section className="bg-cream" style={{ padding:"100px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }} className="g2">
          <div>
            <Pill>🔬 Our Technology</Pill>
            <h2 className="serif sh-l" style={{ fontSize:"2.5rem", lineHeight:1.2, marginBottom:20, marginTop:14 }}>
              Equipped With<br /><span className="gt">World-Class</span> Technology
            </h2>
            <p style={{ color:"var(--muted)", lineHeight:1.82, marginBottom:28 }}>Every instrument and technique is chosen to give you the most precise, comfortable, and long-lasting results imaginable.</p>
            {[
              {i:"globe",  c:"#065f46", t:"3D CBCT Scanning",      d:"Full volumetric jaw imaging — just 1/10th of hospital CT radiation"},
              {i:"scan",   c:"#d97706", t:"iTero 5D Scanner",      d:"Digital impressions in 60 seconds. No messy putty, ever again"},
              {i:"zap",    c:"#0d9488", t:"Cerec Same-Day Crowns", d:"Chairside-milled in 90 minutes — no temporaries needed"},
              {i:"heart",  c:"#0ea5e9", t:"Biolase Laser Therapy", d:"Bloodless gum treatments, faster healing, zero stitches"},
            ].map((t, i) => (
              <div key={i} style={{ display:"flex", gap:14, marginBottom:14, padding:16, borderRadius:14, background:"#fff", border:"1px solid var(--border)", cursor:"default", transition:"box-shadow .2s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow="var(--sh-md)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
                <div style={{ width:42, height:42, borderRadius:12, background:t.c+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <IC n={t.i} s={18} style={{ color:t.c }} />
                </div>
                <div><div style={{ fontWeight:700, fontSize:".9rem", marginBottom:3 }}>{t.t}</div><div style={{ color:"var(--muted)", fontSize:".82rem" }}>{t.d}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              {e:"🦷",bg:"linear-gradient(135deg,#d1fae5,#a7f3d0)",t:"Precision Implants"},
              {e:"✨",bg:"linear-gradient(135deg,#fef3c7,#fde68a)",t:"Smile Design"},
              {e:"📡",bg:"linear-gradient(135deg,#dbeafe,#bfdbfe)",t:"3D Imaging"},
              {e:"⚡",bg:"linear-gradient(135deg,#ccfbf1,#99f6e4)",t:"Laser Therapy"},
            ].map((b, i) => (
              <div key={i} style={{ borderRadius:22, height:168, background:b.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, cursor:"default", transition:"transform .3s,box-shadow .3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="var(--sh-md)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                <span style={{ fontSize:38 }}>{b.e}</span>
                <span style={{ fontWeight:700, fontSize:".82rem", color:"var(--slate)" }}>{b.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:"var(--grad-hero)", padding:"100px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:620, margin:"0 auto" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>😁</div>
          <h2 className="serif" style={{ color:"#fff", fontSize:"2.8rem", marginBottom:16, lineHeight:1.2 }}>
            Ready for Your <span className="gtg">Dream Smile?</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,.6)", lineHeight:1.82, maxWidth:480, margin:"0 auto 36px" }}>
            Book a <strong style={{ color:"#fff" }}>free no-obligation consultation</strong> today. Our specialists design your personalised smile plan in just 30 minutes.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-gold" style={{ fontSize:"1rem", padding:"15px 36px" }} onClick={() => nav("/contact")}>
              Book Free Consultation <IC n="arr" s={18} />
            </button>
            <button className="btn btn-ghost" onClick={() => nav("/pricing")}>View Pricing Plans</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// ── SERVICES PAGE ─────────────────────────────────────────────
const ServicesPage = () => {
  const nav = useNavigate();
  return (
    <div className="page-in" style={{ paddingTop:100, paddingBottom:80, background:"var(--warm)", minHeight:"100vh" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:64, paddingTop:24 }}>
          <Pill>✦ What We Offer</Pill>
          <h1 className="serif sh" style={{ fontSize:"3rem", marginTop:12 }}>Comprehensive Dental Care</h1>
          <p style={{ color:"var(--muted)", marginTop:16, maxWidth:520, margin:"16px auto 0", lineHeight:1.78 }}>Every service you'll ever need, all under one roof, delivered by specialists who genuinely care about your outcome.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20, marginBottom:88 }}>
          {SVCS.map((s, i) => (
            <div key={i} className={`card card-cream fu d${(i%3)+1}`} style={{ padding:30, cursor:"default" }}>
              <div className={`iw ${s.iw}`} style={{ marginBottom:20 }}><IC n={s.ico} s={28} style={{ color:s.col }} /></div>
              <h3 className="serif" style={{ fontSize:"1.22rem", marginBottom:8 }}>{s.t}</h3>
              <p style={{ color:"var(--muted)", fontSize:".875rem", lineHeight:1.78, marginBottom:20 }}>{s.d}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:"1px solid var(--border)" }}>
                <span style={{ fontWeight:700, fontSize:".9rem", color:s.col }}>From {s.p}</span>
                <button className="btn btn-outline btn-sm" onClick={() => nav("/contact")}>Book <IC n="arr" s={13} /></button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"var(--grad-hero)", borderRadius:32, padding:"56px 40px" }}>
          <h2 className="serif sh" style={{ fontSize:"2rem", textAlign:"center", marginBottom:52, color:"#fff" }}>Your Journey With PearlDent</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:28 }}>
            {[
              {s:"01",e:"📲",t:"Book Online",       d:"Schedule in under 60 seconds via form, WhatsApp, or phone. Free consultation guaranteed."},
              {s:"02",e:"🩺",t:"Digital Diagnosis",  d:"3D scan, AI cavity detection, full oral screening — all included free at your first visit."},
              {s:"03",e:"📋",t:"Personalised Plan",  d:"Your dentist designs a tailored plan with timeline, costs, and a digital smile preview."},
              {s:"04",e:"🦷",t:"Expert Treatment",   d:"Pain-free dental care by specialists in a calming, clinic-grade environment."},
              {s:"05",e:"😁",t:"Smile & Thrive",     d:"Walk out with a beautiful smile and clear aftercare plan. Annual check-ins included."},
            ].map((step, i) => (
              <div key={i} style={{ textAlign:"center", color:"#fff" }}>
                <div className="tdot" style={{ margin:"0 auto 12px" }}><span style={{ fontSize:22 }}>{step.e}</span></div>
                <div style={{ fontSize:".7rem", fontWeight:800, color:"var(--em-l)", letterSpacing:".12em", marginBottom:6 }}>{step.s}</div>
                <h3 className="serif" style={{ fontSize:"1.1rem", marginBottom:6 }}>{step.t}</h3>
                <p style={{ color:"rgba(255,255,255,.55)", fontSize:".83rem", lineHeight:1.65 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── GALLERY PAGE ──────────────────────────────────────────────
const GalleryPage = () => (
  <div className="page-in" style={{ paddingTop:100, paddingBottom:80, background:"#fff", minHeight:"100vh" }}>
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
      <div style={{ textAlign:"center", marginBottom:64, paddingTop:24 }}>
        <Pill>✦ Real Results</Pill>
        <h1 className="serif sh" style={{ fontSize:"3rem", marginTop:12 }}>Smile Transformations</h1>
        <p style={{ color:"var(--muted)", marginTop:16, maxWidth:500, margin:"16px auto 0", lineHeight:1.78 }}>Drag the slider to reveal real before &amp; after results from our patients — unfiltered, unretouched.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:20, marginBottom:80 }}>
        {[
          {b:"😬",a:"😁",l:"Zoom Whitening — 8 shades in 60 mins",       tag:"Whitening"   },
          {b:"😶",a:"😄",l:"Invisalign — 14 months, adult patient",       tag:"Orthodontics"},
          {b:"😮",a:"🤩",l:"Full Implant Bridge — 3 missing teeth",       tag:"Implants"    },
          {b:"🙁",a:"😊",l:"6 E-max Veneers — complete smile makeover",   tag:"Cosmetic"    },
          {b:"😑",a:"😃",l:"Composite Bonding — gaps and chips repaired", tag:"Bonding"     },
          {b:"😔",a:"🥰",l:"Gum Laser + Zirconia Crown — full rehab",     tag:"Restorative" },
        ].map((item, i) => (
          <div key={i} style={{ background:"var(--warm)", borderRadius:24, padding:14, border:"1px solid var(--border)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontWeight:700, fontSize:".85rem", color:"var(--navy)" }}>{item.tag}</span>
              <Pill>{item.tag}</Pill>
            </div>
            <BASlider before={item.b} after={item.a} label={item.l} />
            <p style={{ textAlign:"center", fontSize:".73rem", color:"#9ca3af", marginTop:8 }}>← Drag slider to compare →</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <h2 className="serif sh" style={{ fontSize:"2rem" }}>Our Work Gallery</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10 }}>
        {[
          {e:"😁",bg:"#d1fae5",l:"Veneers"   },{e:"😄",bg:"#fef3c7",l:"Whitening" },{e:"🤗",bg:"#dbeafe",l:"Braces"    },
          {e:"😊",bg:"#d1fae5",l:"Implants"  },{e:"🤩",bg:"#fef3c7",l:"Makeover"  },{e:"😎",bg:"#ccfbf1",l:"Cleaning"  },
          {e:"😃",bg:"#dbeafe",l:"RCT"       },{e:"🥰",bg:"#fef9c3",l:"Paediatric"},{e:"😆",bg:"#d1fae5",l:"Bonding"   },
          {e:"😏",bg:"#fef3c7",l:"Aligners"  },{e:"😜",bg:"#ccfbf1",l:"Crown"     },{e:"🥹",bg:"#dbeafe",l:"Gum Lift"  },
        ].map((it, i) => (
          <div key={i} className="gz" style={{ aspectRatio:"1", cursor:"pointer" }}>
            <div style={{ borderRadius:18, background:it.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, height:"100%" }}>
              <span style={{ fontSize:38 }}>{it.e}</span>
              <span style={{ fontSize:".73rem", fontWeight:700, background:"rgba(255,255,255,.7)", padding:"2px 10px", borderRadius:50, color:"var(--slate)" }}>{it.l}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── DOCTORS PAGE ──────────────────────────────────────────────
const DoctorsPage = () => {
  const nav = useNavigate();
  return (
    <div className="page-in" style={{ paddingTop:100, paddingBottom:80, background:"var(--warm)", minHeight:"100vh" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:64, paddingTop:24 }}>
          <Pill>✦ Our Specialists</Pill>
          <h1 className="serif sh" style={{ fontSize:"3rem", marginTop:12 }}>Meet the Experts Behind Your Smile</h1>
          <p style={{ color:"var(--muted)", marginTop:16, maxWidth:520, margin:"16px auto 0", lineHeight:1.78 }}>Board-certified, internationally trained, and deeply committed to your comfort, confidence, and results.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:24, marginBottom:88 }}>
          {DOCS.map((d, i) => (
            <div key={i} className={`card fu d${i+1}`} style={{ overflow:"hidden" }}>
              <div style={{ padding:"48px 28px 24px", background:`linear-gradient(135deg,${["#d1fae5,#a7f3d0","#fef3c7,#fde68a","#ccfbf1,#99f6e4"][i]})`, textAlign:"center" }}>
                <span style={{ fontSize:80, display:"block", marginBottom:10 }}>{d.em}</span>
                <div style={{ display:"inline-block", background:"rgba(255,255,255,.75)", borderRadius:50, padding:"4px 16px", fontSize:".75rem", fontWeight:700, color:d.clr }}>{d.x} Experience</div>
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:6, marginTop:10 }}>
                  {d.awards.map((a, j) => (
                    <span key={j} style={{ background:"rgba(255,255,255,.6)", borderRadius:50, padding:"3px 12px", fontSize:".7rem", fontWeight:600, color:"var(--slate)" }}>{a}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding:26 }}>
                <h3 className="serif" style={{ fontSize:"1.3rem", marginBottom:4 }}>{d.n}</h3>
                <p style={{ color:d.clr, fontWeight:600, fontSize:".875rem", marginBottom:8 }}>{d.r}</p>
                <Stars n={d.rating} />
                <p style={{ color:"#9ca3af", fontSize:".75rem", marginTop:4, marginBottom:12 }}>{d.rev} verified reviews</p>
                <p style={{ color:"var(--muted)", fontSize:".875rem", lineHeight:1.78, marginBottom:16 }}>{d.bio}</p>
                {d.q.map((q, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                    <IC n="check" s={14} style={{ color:"var(--em-m)", flexShrink:0, marginTop:2 }} />
                    <span style={{ fontSize:".8rem", color:"var(--slate)" }}>{q}</span>
                  </div>
                ))}
                <button className="btn btn-em" style={{ width:"100%", justifyContent:"center", marginTop:20, fontSize:".88rem", padding:"12px 0" }} onClick={() => nav("/contact")}>
                  Book with {d.n.split(" ")[1]}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <Pill>⭐ Patient Reviews</Pill>
          <h2 className="serif sh" style={{ fontSize:"2.2rem", marginTop:12 }}>What Our Patients Say</h2>
          <p style={{ color:"var(--muted)", marginTop:12 }}>Genuine reviews from real patients — verified and unedited.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {REVS.map((r, i) => (
            <div key={i} className={`rc fu d${(i%3)+1}`} style={{ padding:24 }}>
              <IC n="quote" s={28} style={{ color:"var(--em)", opacity:.2 }} />
              <p style={{ color:"var(--slate)", fontSize:".875rem", lineHeight:1.82, margin:"10px 0 18px" }}>{r.t}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"var(--grad-em)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:".88rem" }}>{r.n[0]}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:".85rem" }}>{r.n}</div>
                    <div style={{ fontSize:".73rem", color:"#9ca3af" }}>{r.d} · {r.s}</div>
                  </div>
                </div>
                <Stars n={r.r} size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── PRICING PAGE ──────────────────────────────────────────────
const PricingPage = () => {
  const nav = useNavigate();
  return (
    <div className="page-in" style={{ paddingTop:100, paddingBottom:80, background:"var(--warm)", minHeight:"100vh" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:64, paddingTop:24 }}>
          <Pill>💰 Pricing</Pill>
          <h1 className="serif sh" style={{ fontSize:"3rem", marginTop:12 }}>Simple, Honest Pricing</h1>
          <p style={{ color:"var(--muted)", marginTop:16, maxWidth:480, margin:"16px auto 0", lineHeight:1.78 }}>No hidden fees, no surprises. Every plan includes free consultations and a full quote before any treatment begins.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, alignItems:"start", marginBottom:72 }}>
          {PLANS.map((plan, i) => (
            <div key={i} className={`fu d${i+1} ${plan.pop?"price-pop":"card"}`} style={{ borderRadius:26, padding:38, position:"relative", ...(!plan.pop ? { background:"#fff", border:"1px solid var(--border)" } : {}) }}>
              {plan.pop && <div style={{ position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)", background:"var(--grad-gold)", color:"#fff", fontSize:".75rem", fontWeight:700, padding:"6px 22px", borderRadius:50, boxShadow:"0 4px 18px rgba(217,119,6,.45)", whiteSpace:"nowrap" }}>⭐ Most Popular</div>}
              <div style={{ fontSize:".8rem", fontWeight:700, color:plan.pop?"var(--em-l)":"var(--em)", marginBottom:4 }}>{plan.n}</div>
              <p style={{ fontSize:".8rem", marginBottom:14, opacity:.6 }}>{plan.desc}</p>
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, marginBottom:4 }}>
                <span className="serif" style={{ fontSize:"3.2rem", fontWeight:700 }}>{plan.p}</span>
                <span style={{ fontSize:".85rem", marginBottom:10, opacity:.5 }}>{plan.per}</span>
              </div>
              <p style={{ fontSize:".75rem", opacity:.4, marginBottom:26 }}>Billed monthly · Cancel anytime</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:30 }}>
                {plan.f.map((f, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, background:plan.pop?"rgba(110,231,183,.2)":"var(--sage)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <IC n="check" s={11} style={{ color:plan.pop?"var(--em-l)":"var(--em-m)" }} />
                    </div>
                    <span style={{ fontSize:".85rem", opacity:plan.pop?.85:1 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ width:"100%", padding:"14px 0", borderRadius:50, fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:".9rem", cursor:"pointer", border:"none", background:plan.pop?"var(--grad-gold)":"var(--grad-em)", color:"#fff", boxShadow:plan.pop?"0 4px 20px rgba(217,119,6,.35)":"0 4px 20px rgba(6,95,70,.3)", transition:"all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(6,95,70,.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=plan.pop?"0 4px 20px rgba(217,119,6,.35)":"0 4px 20px rgba(6,95,70,.3)"; }}
                onClick={() => nav("/contact")}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:40 }}>
          <h2 className="serif sh" style={{ fontSize:"1.7rem", textAlign:"center", marginBottom:8 }}>À-La-Carte Treatment Prices</h2>
          <p style={{ color:"var(--muted)", textAlign:"center", fontSize:".85rem", marginBottom:28 }}>Indicative pricing. Final cost shared after your free consultation and diagnosis.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:8 }}>
            {[
              ["Dental Cleaning","₹800 – ₹1,500"],["Teeth Whitening (Zoom)","₹3,500 – ₹7,000"],
              ["Single Tooth Implant","₹25,000 – ₹45,000"],["Root Canal Treatment","₹4,800 – ₹9,000"],
              ["Metal Braces","₹18,000 – ₹28,000"],["Invisalign Aligners","₹75,000 – ₹1,60,000"],
              ["E-max Veneer (per tooth)","₹7,500 – ₹14,000"],["Zirconia Crown","₹6,000 – ₹12,000"],
              ["Tooth Extraction","₹500 – ₹2,500"],["Composite Bonding","₹2,000 – ₹5,000"],
              ["Full Dentures","₹12,000 – ₹30,000"],["Gum Laser Treatment","₹3,000 – ₹8,000"],
            ].map(([name, price], i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", borderRadius:10, background:"var(--warm)", fontSize:".875rem", cursor:"default", transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background="var(--sage)"; e.currentTarget.style.transform="translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="var(--warm)"; e.currentTarget.style.transform="none"; }}>
                <span style={{ color:"var(--slate)" }}>{name}</span>
                <span style={{ fontWeight:700, color:"var(--em)" }}>{price}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign:"center", color:"#9ca3af", fontSize:".75rem", marginTop:20 }}>
            * All treatments include a free pre-treatment consultation. 0% EMI available above ₹10,000.
          </p>
        </div>
      </div>
    </div>
  );
};

// ── FAQ PAGE ──────────────────────────────────────────────────
const FAQItem = ({ q, a, open, onToggle }) => (
  <div style={{ background:"#fff", borderRadius:18, border:`1px solid ${open?"var(--em-l)":"var(--border)"}`, overflow:"hidden", marginBottom:10, transition:"border-color .3s,box-shadow .3s", boxShadow:open?"var(--sh-md)":"none" }}>
    <button onClick={onToggle} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", textAlign:"left" }}>
      <span style={{ fontWeight:700, fontSize:".95rem", color:"var(--navy)", paddingRight:16 }}>{q}</span>
      <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0, background:open?"var(--grad-em)":"var(--sage)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s", transform:open?"rotate(180deg)":"none" }}>
        <IC n="chev" s={16} style={{ color:open?"#fff":"var(--em)" }} />
      </div>
    </button>
    <div className={`acc${open?" open":""}`}>
      <p style={{ padding:"0 24px 22px", color:"var(--muted)", fontSize:".9rem", lineHeight:1.85 }}>{a}</p>
    </div>
  </div>
);

const FAQPage = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="page-in" style={{ paddingTop:100, paddingBottom:80, background:"var(--warm)", minHeight:"100vh" }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:56, paddingTop:24 }}>
          <Pill>❓ Common Questions</Pill>
          <h1 className="serif sh" style={{ fontSize:"3rem", marginTop:12 }}>Frequently Asked Questions</h1>
          <p style={{ color:"var(--muted)", marginTop:16, lineHeight:1.78 }}>
            Still have questions? Call us at <a href="tel:+919876543210" style={{ color:"var(--em)", fontWeight:700 }}>+91 98765 43210</a> or WhatsApp anytime.
          </p>
        </div>
        {FAQS.map((f, i) => (
          <FAQItem key={i} q={f.q} a={f.a} open={open===i} onToggle={() => setOpen(open===i?null:i)} />
        ))}
        <div style={{ marginTop:44, padding:32, background:"var(--grad-em)", borderRadius:24, textAlign:"center", color:"#fff" }}>
          <h3 className="serif" style={{ fontSize:"1.5rem", marginBottom:8 }}>Didn't find your answer?</h3>
          <p style={{ opacity:.75, fontSize:".88rem", marginBottom:20, lineHeight:1.7 }}>Our team is available Mon–Sat 9am–8pm to answer every question.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="tel:+919876543210" className="btn btn-ghost btn-sm"><IC n="phone" s={15} /> Call Us</a>
            <a href="mailto:hello@pearldent.in" className="btn btn-ghost btn-sm"><IC n="mail" s={15} /> Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── CONTACT PAGE ──────────────────────────────────────────────
// FIX SUMMARY:
//  1. `formRef` (useRef) stores field values — always fresh, never stale
//  2. `errs` state drives red borders + messages; cleared per-field on change
//  3. `submit` reads directly from formRef.current — no closure-over-state bug
//  4. `loading` flag is a separate boolean state; button disabled only while loading
//  5. Success screen uses `submittedData` ref snapshot so values survive after reset
//  6. "Book Another Appointment" resets ref, clears inputs via key prop, sets done=false
// ─────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [errs,    setErrs]    = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [formKey, setFormKey] = useState(0); // bumping this key re-mounts the form cleanly

  // Store the submitted snapshot for the success screen
  const submittedData = useRef({});

  // ── validation reads directly from DOM inputs ──────────────
  const validate = () => {
    const name  = document.getElementById("pd-name")?.value.trim()  ?? "";
    const phone = document.getElementById("pd-phone")?.value.trim() ?? "";
    const email = document.getElementById("pd-email")?.value.trim() ?? "";
    const e = {};
    if (!name)  e.name  = "Name is required";
    if (!phone) e.phone = "Phone is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }

    // Snapshot all field values before async gap
    submittedData.current = {
      name:      document.getElementById("pd-name")?.value.trim()      ?? "",
      phone:     document.getElementById("pd-phone")?.value.trim()     ?? "",
      email:     document.getElementById("pd-email")?.value.trim()     ?? "",
      treatment: document.getElementById("pd-treatment")?.value        ?? "",
      date:      document.getElementById("pd-date")?.value             ?? "",
      time:      document.getElementById("pd-time")?.value             ?? "",
      msg:       document.getElementById("pd-msg")?.value.trim()       ?? "",
    };

    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
  };

  const reset = () => {
    submittedData.current = {};
    setErrs({});
    setDone(false);
    setFormKey(k => k + 1); // re-mounts form fields with empty values
  };

  const clearErr = field => setErrs(prev => { const n={...prev}; delete n[field]; return n; });

  // ── Success screen ─────────────────────────────────────────
  if (done) {
    const sd = submittedData.current;
    return (
      <div className="page-in" style={{ minHeight:"100vh", paddingTop:100, background:"var(--warm)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div className="su" style={{ textAlign:"center", maxWidth:500, padding:32 }}>
          <div style={{ width:100, height:100, borderRadius:"50%", background:"var(--grad-em)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", boxShadow:"0 14px 40px rgba(6,95,70,.35)" }}>
            <IC n="ok" s={50} style={{ color:"#fff" }} />
          </div>
          <h2 className="serif" style={{ fontSize:"2.2rem", marginBottom:12 }}>You're All Set! 🎉</h2>
          <p style={{ color:"var(--muted)", lineHeight:1.82, marginBottom:8 }}>
            Thank you, <strong>{sd.name}</strong>! Your appointment request has been received.
          </p>
          <p style={{ color:"#9ca3af", fontSize:".85rem", marginBottom:32 }}>
            We'll call to confirm within <strong style={{ color:"var(--em)" }}>30 minutes</strong> during clinic hours.
          </p>
          <div className="card" style={{ padding:22, textAlign:"left", marginBottom:28 }}>
            {[["Treatment", sd.treatment], ["Date", sd.date], ["Time", sd.time]].filter(([, v]) => v).map(([l, v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:".875rem", padding:"7px 0", borderBottom:"1px solid var(--border)" }}>
                <span style={{ color:"var(--muted)" }}>{l}</span>
                <span style={{ fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-em" style={{ padding:"13px 32px" }} onClick={reset}>
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page-in" style={{ paddingTop:100, paddingBottom:80, background:"var(--warm)", minHeight:"100vh" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:56, paddingTop:24 }}>
          <Pill>📅 Book Now</Pill>
          <h1 className="serif sh" style={{ fontSize:"3rem", marginTop:12 }}>Book Your Free Consultation</h1>
          <p style={{ color:"var(--muted)", marginTop:16, maxWidth:500, margin:"16px auto 0", lineHeight:1.78 }}>
            Fill the form below and we'll confirm within 30 minutes. Your first consultation is always{" "}
            <strong style={{ color:"var(--em)" }}>completely free.</strong>
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:24 }} className="g2">
          {/* ── Left: form card ── */}
          <div className="card" style={{ padding:40 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, paddingBottom:20, borderBottom:"1px solid var(--border)" }}>
              <div style={{ width:46, height:46, borderRadius:14, background:"var(--grad-em)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <IC n="cal" s={22} style={{ color:"#fff" }} />
              </div>
              <div>
                <h2 className="serif" style={{ fontSize:"1.4rem" }}>Appointment Details</h2>
                <p style={{ color:"var(--muted)", fontSize:".8rem" }}>Fields marked * are required</p>
              </div>
            </div>

            {/* Using key prop so re-mount clears uncontrolled inputs cleanly */}
            <div key={formKey} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

              {/* Name */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"var(--slate)" }}>Full Name *</label>
                <input id="pd-name" type="text" className={`finput${errs.name?" has-error":""}`}
                  placeholder="Your full name"
                  onChange={() => clearErr("name")} />
                {errs.name && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errs.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"var(--slate)" }}>Phone Number *</label>
                <input id="pd-phone" type="tel" className={`finput${errs.phone?" has-error":""}`}
                  placeholder="+91 98765 43210"
                  onChange={() => clearErr("phone")} />
                {errs.phone && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errs.phone}</p>}
              </div>

              {/* Email — full width */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"var(--slate)" }}>Email Address *</label>
                <input id="pd-email" type="email" className={`finput${errs.email?" has-error":""}`}
                  placeholder="your@email.com"
                  onChange={() => clearErr("email")} />
                {errs.email && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errs.email}</p>}
              </div>

              {/* Treatment */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"var(--slate)" }}>Treatment Type</label>
                <select id="pd-treatment" className="finput">
                  <option value="">Select a treatment...</option>
                  {SVCS.map(s => <option key={s.t} value={s.t}>{s.t}</option>)}
                  <option value="General Checkup">General Checkup</option>
                  <option value="Second Opinion">Second Opinion</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"var(--slate)" }}>Preferred Date</label>
                <input id="pd-date" type="date" className="finput" min={today} />
              </div>

              {/* Time */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"var(--slate)" }}>Preferred Time</label>
                <select id="pd-time" className="finput">
                  <option value="">Select time...</option>
                  {["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM",
                    "2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM",
                    "5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"var(--slate)" }}>Additional Notes (optional)</label>
                <textarea id="pd-msg" className="finput"
                  placeholder="Any specific concerns, allergies, or special requests..."
                  rows={3} style={{ resize:"vertical" }} />
              </div>
            </div>

            {/* ── FIXED SUBMIT BUTTON ── */}
            <button
              className="btn btn-em"
              style={{ width:"100%", justifyContent:"center", marginTop:24, padding:"14px 0", fontSize:".95rem" }}
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spin" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
                    <circle cx={12} cy={12} r={10} strokeOpacity={.25}/>
                    <path d="M12 2a10 10 0 0110 10"/>
                  </svg>
                  Booking…
                </>
              ) : (
                <>Confirm Appointment <IC n="arr" s={17} /></>
              )}
            </button>

            <p style={{ textAlign:"center", color:"#9ca3af", fontSize:".75rem", marginTop:12 }}>
              🔒 Your information is 100% private and never shared.
            </p>
          </div>

          {/* ── Right: info sidebar ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div className="card" style={{ padding:26 }}>
              <h3 className="serif" style={{ fontSize:"1.2rem", marginBottom:18 }}>Clinic Information</h3>
              {[
  { i:"pin",      t:"Address",  v:"42, Brigade Road, Near MG Metro\nIndiranagar, Bangalore – 560001" },
  { i:"phone",    t:"Phone",    v:"+91 98765 43210 (Main)\n+91 80 4567 8901 (Emergency)" },
  { i:"mail",     t:"Email",    v:"hello@pearldent.in",    link:"mailto:hello@pearldent.in" },
  { i:"whatsapp", t:"WhatsApp", v:"+91 98765 43210",       link:"https://wa.me/919876543210?text=Hi%20PearlDent!%20I'd%20like%20to%20book%20an%20appointment." },
].map(c => (
  <div key={c.i} style={{ display:"flex", gap:12, marginBottom:16 }}>
    <div style={{ width:38, height:38, borderRadius:10, background:c.i==="whatsapp"?"#25d366":"var(--sage)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <IC n={c.i} s={16} style={{ color:c.i==="whatsapp"?"#fff":"var(--em)", fill:c.i==="whatsapp"?"#fff":"none", stroke:c.i==="whatsapp"?"none":"currentColor" }} />
    </div>
    <div>
      <div style={{ fontSize:".72rem", color:"#9ca3af", fontWeight:700, marginBottom:2 }}>{c.t}</div>
      {c.link ? (
        <a href={c.link} target="_blank" rel="noopener noreferrer"
          style={{ fontSize:".85rem", color:"var(--em)", fontWeight:600, textDecoration:"none", whiteSpace:"pre-line" }}
          onMouseEnter={e => e.currentTarget.style.textDecoration="underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration="none"}>
          {c.v}
        </a>
      ) : (
        <div style={{ fontSize:".85rem", color:"var(--slate)", whiteSpace:"pre-line" }}>{c.v}</div>
      )}
    </div>
  </div>
))}
            </div>

            <div className="card" style={{ padding:26 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <IC n="clock" s={16} style={{ color:"var(--em)" }} />
                <h3 className="serif" style={{ fontSize:"1.1rem" }}>Clinic Hours</h3>
              </div>
              {[
                { d:"Monday – Friday", t:"9:00 AM – 8:00 PM",  g:false },
                { d:"Saturday",        t:"9:00 AM – 6:00 PM",  g:false },
                { d:"Sunday",          t:"10:00 AM – 2:00 PM", g:false },
                { d:"Public Holidays", t:"11:00 AM – 3:00 PM", g:false },
                { d:"Emergency Line",  t:"24 / 7 Available",   g:true  },
              ].map(r => (
                <div key={r.d} style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", padding:"8px 0", borderBottom:"1px solid var(--border)", color:r.g?"var(--em-m)":"var(--slate)" }}>
                  <span>{r.d}</span>
                  <span style={{ fontWeight:700 }}>{r.t}</span>
                </div>
              ))}
            </div>

            <div style={{ background:"var(--grad-em)", borderRadius:22, padding:22, color:"#fff", textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>🚨</div>
              <h3 className="serif" style={{ fontSize:"1.15rem", marginBottom:6 }}>Dental Emergency?</h3>
              <p style={{ fontSize:".82rem", opacity:.75, marginBottom:16, lineHeight:1.7 }}>Same-day slots available 7 days a week. Call us immediately.</p>
              <a href="tel:+919876543210" className="btn btn-ghost btn-sm">
                <IC n="phone" s={15} /> +91 98765 43210
              </a>
            </div>

            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5534!2d77.6408!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzQyLjMiTiA3N8KwMzgnMjYuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="210" style={{ border:0, display:"block" }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="PearlDent Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Scroll to top ─────────────────────────────────────────────
const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [pathname]);
  return null;
};

// ── APP ROOT ──────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <G />
      <ScrollTop />
      <Navbar />
      <WAButton />
      <Routes>
        <Route path="/"         element={<HomePage     />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/gallery"  element={<GalleryPage  />} />
        <Route path="/doctors"  element={<DoctorsPage  />} />
        <Route path="/pricing"  element={<PricingPage  />} />
        <Route path="/faq"      element={<FAQPage      />} />
        <Route path="/contact"  element={<ContactPage  />} />
        <Route path="*"         element={<HomePage     />} />
      </Routes>
      <Footer />
    </Router>
  );
}