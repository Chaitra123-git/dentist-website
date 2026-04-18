// ============================================================
//  PearlDent Clinic — App.jsx
//  Single-file React app • React Router v6 • Tailwind CSS
//  All 7 pages: Home, Services, Gallery, Doctors, Pricing, FAQ, Contact
// ============================================================
//
//  SETUP INSTRUCTIONS:
//  1. npx create-react-app pearldent  (or use Vite)
//  2. npm install react-router-dom
//  3. Add Tailwind CSS (https://tailwindcss.com/docs/guides/create-react-app)
//  4. Add to index.css:
//       @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');
//  5. Replace src/App.jsx with this file
//  6. npm start
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES (injected via <style> tag)
// ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    :root {
      --navy:   #113c72;
      --teal:   #0ea5e9;
      --mint:   #10b981;
      --sky:    #e0f2fe;
      --cream:  #f8fafc;
      --gold:   #f59e0b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Nunito', sans-serif;
      background: var(--cream);
      color: var(--navy);
      overflow-x: hidden;
    }
    h1,h2,h3,h4,.serif { font-family: 'Playfair Display', serif; }

    /* ── Keyframes ── */
    @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes scaleIn  { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
    @keyframes slideRight{ from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
    @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes ripple   { 0%{transform:scale(0);opacity:.6} 100%{transform:scale(2.5);opacity:0} }

    .fade-up   { animation: fadeUp   .65s ease both }
    .fade-in   { animation: fadeIn   .5s  ease both }
    .scale-in  { animation: scaleIn  .4s  ease both }
    .slide-r   { animation: slideRight .5s ease both }
    .anim-float{ animation: float    3.2s ease-in-out infinite }

    .d1{ animation-delay:.1s }
    .d2{ animation-delay:.22s }
    .d3{ animation-delay:.36s }
    .d4{ animation-delay:.5s }
    .d5{ animation-delay:.65s }
    .d6{ animation-delay:.8s }

    /* ── Nav link ── */
    .nav-link {
      position:relative; font-weight:600; font-size:.88rem;
      letter-spacing:.03em; color:#334155;
      transition: color .25s;
    }
    .nav-link::after {
      content:''; position:absolute; bottom:-4px; left:0;
      width:0; height:2px; border-radius:2px;
      background: linear-gradient(90deg,#0ea5e9,#10b981);
      transition: width .3s ease;
    }
    .nav-link:hover, .nav-link.active { color:#0ea5e9; }
    .nav-link:hover::after, .nav-link.active::after { width:100%; }

    /* ── Buttons ── */
    .btn-primary {
      display:inline-flex; align-items:center; gap:8px;
      background: linear-gradient(135deg,#0ea5e9,#10b981);
      color:#fff; font-weight:700; font-size:.9rem;
      padding:13px 30px; border-radius:50px; border:none;
      cursor:pointer; font-family:'Nunito',sans-serif;
      transition: transform .2s, box-shadow .2s;
      box-shadow: 0 4px 20px rgba(14,165,233,.35);
    }
    .btn-primary:hover {
      transform:translateY(-2px);
      box-shadow:0 10px 32px rgba(14,165,233,.45);
    }
    .btn-outline {
      display:inline-flex; align-items:center; gap:8px;
      border:2px solid #0ea5e9; color:#0ea5e9;
      font-weight:700; font-size:.9rem;
      padding:11px 28px; border-radius:50px;
      background:transparent; cursor:pointer;
      font-family:'Nunito',sans-serif;
      transition: all .25s;
    }
    .btn-outline:hover { background:#0ea5e9; color:#fff; }

    /* ── Hero ── */
    .hero-bg {
      background: linear-gradient(140deg,#0b2545 0%,#134e7c 55%,#0c7a6b 100%);
      position:relative; overflow:hidden;
    }
    .hero-blob {
      position:absolute; border-radius:50%; pointer-events:none;
      filter:blur(80px); opacity:.18;
    }

    /* ── Cards ── */
    .card {
      background:#fff; border-radius:20px;
      border:1px solid #e2e8f0;
      transition: transform .3s, box-shadow .3s;
    }
    .card:hover {
      transform:translateY(-6px);
      box-shadow:0 20px 50px rgba(14,165,233,.13);
    }

    /* ── Service icon ── */
    .svc-icon {
      background: linear-gradient(135deg,#e0f2fe,#d1fae5);
      transition: background .3s;
      border-radius:16px;
      width:56px; height:56px;
      display:flex; align-items:center; justify-content:center;
    }
    .card:hover .svc-icon { background:linear-gradient(135deg,#0ea5e9,#10b981); }
    .card:hover .svc-icon svg { color:#fff !important; }

    /* ── Gradient text ── */
    .g-text {
      background: linear-gradient(90deg,#0ea5e9,#10b981);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
    }

    /* ── Section heading ── */
    .section-title::after {
      content:''; display:block; width:56px; height:4px;
      background:linear-gradient(90deg,#0ea5e9,#10b981);
      border-radius:2px; margin:10px auto 0;
    }

    /* ── Before/After slider ── */
    .ba-wrap { position:relative; overflow:hidden; border-radius:16px; cursor:ew-resize; user-select:none; }
    .ba-handle {
      position:absolute; top:0; height:100%; width:3px;
      background:#fff; box-shadow:0 0 16px rgba(0,0,0,.5);
    }
    .ba-btn {
      position:absolute; top:50%; left:50%;
      transform:translate(-50%,-50%);
      width:42px; height:42px; border-radius:50%;
      background:#fff; display:flex; align-items:center; justify-content:center;
      box-shadow:0 4px 16px rgba(0,0,0,.3);
    }

    /* ── Gallery zoom ── */
    .gallery-item { overflow:hidden; border-radius:14px; }
    .gallery-item > div { transition:transform .5s ease; }
    .gallery-item:hover > div { transform:scale(1.07); }

    /* ── Accordion ── */
    .acc-body {
      max-height:0; overflow:hidden;
      transition:max-height .4s cubic-bezier(.4,0,.2,1), padding .3s;
    }
    .acc-body.open { max-height:400px; }

    /* ── Pricing popular ── */
    .price-popular {
      background:linear-gradient(145deg,#0b2545,#134e7c);
      color:#fff; transform:scale(1.04);
      box-shadow:0 24px 64px rgba(11,37,69,.3);
    }

    /* ── Form input ── */
    .f-input {
      width:100%; padding:12px 16px;
      border:2px solid #e2e8f0; border-radius:10px;
      font-family:'Nunito',sans-serif; font-size:.9rem;
      color:#0b2545; background:#fff;
      transition:border-color .25s, box-shadow .25s;
      outline:none;
    }
    .f-input:focus { border-color:#0ea5e9; box-shadow:0 0 0 4px rgba(14,165,233,.1); }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:#f1f5f9; }
    ::-webkit-scrollbar-thumb { background:#0ea5e9; border-radius:3px; }

    /* ── Trust badge glass ── */
    .trust-glass {
      background:rgba(255,255,255,.08);
      backdrop-filter:blur(12px);
      border:1px solid rgba(255,255,255,.18);
      border-radius:18px;
    }

    /* ── Review card ── */
    .review-card {
      background:#fff; border-radius:20px;
      border:1px solid #e0f2fe;
      box-shadow:0 6px 28px rgba(14,165,233,.07);
      transition:transform .3s, box-shadow .3s;
    }
    .review-card:hover {
      transform:translateY(-4px);
      box-shadow:0 16px 44px rgba(14,165,233,.14);
    }

    /* ── Map wrapper ── */
    .map-wrap { border-radius:18px; overflow:hidden; box-shadow:0 12px 40px rgba(11,37,69,.12); }

    /* ── Star ── */
    .star-on  { color:#f59e0b; }
    .star-off { color:#d1d5db; }

    /* ── Page enter ── */
    .page-enter { animation:fadeIn .4s ease; }

    /* ── Spinner ── */
    .spin { animation:spin .8s linear infinite; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
// ICON COMPONENTS
// ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 22, style = {}, className = "" }) => {
  const paths = {
    tooth:     <><path d="M12 2C9 2 6 4.5 6 7c0 2.2 1.1 4.4 1.1 6.6C7.1 17 6 21 6 22h3.5c0-2 .7-4 2.5-4s2.5 2 2.5 4H18s-1.1-5-1.1-8.4C16.9 11.4 18 9.2 18 7c0-2.5-3-5-6-5z"/></>,
    cleaning:  <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>,
    braces:    <><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="12" r="1.5" fill="currentColor"/></>,
    whitening: <><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></>,
    implants:  <><path d="M12 2v8M9 4.5h6M8 22h8l-1-12H9L8 22z"/></>,
    rct:       <><path d="M9 2h6l3 10H6L9 2z"/><path d="M6 12v5a3 3 0 006 0v-5"/><line x1="12" y1="12" x2="12" y2="17"/></>,
    cosmetic:  <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>,
    star:      <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/></>,
    chevron:   <><polyline points="6 9 12 15 18 9"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    phone:     <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></>,
    mail:      <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    location:  <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    shield:    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    award:     <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    users:     <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    menu:      <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    close:     <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    arrow:     <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    quote:     <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/></>,
    success:   <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  };
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className}
    >
      {paths[name]}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const SERVICES = [
  { icon:"cleaning",  color:"#0ea5e9", title:"Dental Cleaning",      price:"₹800+",   desc:"Professional scaling & polishing to remove plaque and tartar. Keeps gums healthy and breath fresh." },
  { icon:"braces",    color:"#10b981", title:"Orthodontics & Braces", price:"₹25,000+",desc:"Metal, ceramic, or invisible aligners. Straighten teeth and correct bite issues permanently." },
  { icon:"whitening", color:"#f59e0b", title:"Teeth Whitening",       price:"₹3,500+", desc:"Laser whitening and professional bleaching. Brighten your smile up to 8 shades in one session." },
  { icon:"implants",  color:"#7c3aed", title:"Dental Implants",       price:"₹35,000+",desc:"Titanium tooth replacements that look, feel, and function like natural teeth. Lifetime results." },
  { icon:"rct",       color:"#ef4444", title:"Root Canal Treatment",  price:"₹5,000+", desc:"Pain-free RCT with advanced rotary instruments. Save infected teeth and eliminate severe pain." },
  { icon:"cosmetic",  color:"#ec4899", title:"Cosmetic Dentistry",    price:"₹8,000+", desc:"Veneers, bonding, and smile makeovers designed to give you the Hollywood smile you deserve." },
];

const DOCTORS = [
  {
    emoji:"👩‍⚕️", name:"Dr. Priya Sharma", role:"Chief Dental Surgeon",
    exp:"14 Yrs", rating:5, reviews:487,
    quals:["BDS, MDS – Prosthodontics","Fellowship – American Dental Assoc.","Certified Implantologist"],
    bio:"Dr. Sharma specialises in full-mouth rehabilitation and cosmetic makeovers. Known for her gentle precision."
  },
  {
    emoji:"👨‍⚕️", name:"Dr. Arjun Mehta", role:"Orthodontist",
    exp:"10 Yrs", rating:5, reviews:312,
    quals:["BDS – Manipal University","MDS – Orthodontics","Invisalign Certified Provider"],
    bio:"Dr. Mehta has aligned over 1,200 smiles with braces and clear aligners. Passionate about confident smiles."
  },
  {
    emoji:"👩‍⚕️", name:"Dr. Kavya Nair", role:"Paediatric Dentist",
    exp:"8 Yrs", rating:4, reviews:241,
    quals:["BDS – Bangalore University","MDS – Pedodontics","Child Behaviour Cert."],
    bio:"Dr. Kavya's child-friendly approach makes dental visits fun and fear-free for kids of all ages."
  },
];

const REVIEWS = [
  { name:"Rohan D.",    rating:5, service:"Implants",       date:"Mar 2025", text:"Absolutely transformed my smile! Painless procedure, incredible results, spotless clinic. Dr. Sharma is a genius." },
  { name:"Ananya K.",   rating:5, service:"Orthodontics",   date:"Jan 2025", text:"18-month braces journey was so smooth. Dr. Mehta explained everything clearly. Results are stunning!" },
  { name:"Vikram P.",   rating:5, service:"Root Canal",     date:"Feb 2025", text:"Emergency RCT same day, zero pain. The technology is next level. Highly recommend PearlDent!" },
  { name:"Sneha I.",    rating:4, service:"Paediatric",     date:"Apr 2025", text:"My 6-year-old was terrified. Dr. Kavya was magical. He walked out smiling! We're regulars now." },
  { name:"Aryan G.",    rating:5, service:"Whitening",      date:"Mar 2025", text:"8 shades brighter in one session! Professional, clean, worth every rupee. Can't stop smiling." },
  { name:"Meera B.",    rating:5, service:"Cosmetic",       date:"Feb 2025", text:"My veneers look completely natural. Dr. Sharma matched the shade perfectly. Life-changing experience!" },
];

const PRICING = [
  {
    name:"Basic Care", price:"₹999", period:"/month", popular:false,
    features:["2 Cleaning Sessions","Annual X-Ray","Fluoride Treatment","Emergency Consultation","10% Discount on Treatments"],
    cta:"Get Started"
  },
  {
    name:"Complete Smile", price:"₹2,499", period:"/month", popular:true,
    features:["4 Cleaning Sessions","Quarterly X-Rays","1 Whitening Session","Priority Appointments","25% Discount","Free Consultation","Family Cover (2)"],
    cta:"Book Now"
  },
  {
    name:"Premium Family", price:"₹4,999", period:"/month", popular:false,
    features:["Unlimited Cleanings","Monthly X-Rays","2 Whitening Sessions","Same-Day Emergency","40% Discount","Home Dental Kit","Family Cover (4)","Annual Smile Report"],
    cta:"Contact Us"
  },
];

const FAQS = [
  { q:"How often should I visit the dentist?",              a:"We recommend at least twice a year for cleaning and checkups. Patients with gum disease or frequent cavities may need visits every 3–4 months." },
  { q:"Is teeth whitening safe for sensitive teeth?",       a:"Yes! We use desensitising agents before and after. Our gel is formulated for sensitive teeth and our dentists assess every patient individually." },
  { q:"How long do dental implants last?",                  a:"With proper care, implants can last a lifetime. The crown typically lasts 15–20 years. Good oral hygiene and regular checkups maximise longevity." },
  { q:"Is root canal treatment painful?",                   a:"Modern RCT is virtually painless. Advanced local anaesthesia and rotary instruments mean most patients feel little to no discomfort during the procedure." },
  { q:"At what age should children first see a dentist?",   a:"By age 1 or within 6 months of their first tooth. Early visits establish good habits and allow early detection of developmental issues." },
  { q:"How long does orthodontic treatment take?",          a:"Mild cases: 6–12 months. Moderate–severe cases: 18–24 months. Clear aligners often work faster for mild misalignment than traditional braces." },
  { q:"Do you offer EMI / payment plans?",                  a:"Yes! 0% interest EMI on treatments above ₹10,000 via major credit cards. We partner with 20+ insurance providers and assist with claims." },
  { q:"What should I do in a dental emergency?",            a:"Call our emergency line immediately: +91 98765 43210. For a knocked-out tooth, keep it moist in milk and come in within 30 minutes. We're open 7 days." },
];

// ─────────────────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────────────────
const Stars = ({ n, size = 16 }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <Icon key={i} name="star" size={size} className={i <= n ? "star-on" : "star-off"} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label:"Home",     to:"/"         },
  { label:"Services", to:"/services" },
  { label:"Gallery",  to:"/gallery"  },
  { label:"Doctors",  to:"/doctors"  },
  { label:"Pricing",  to:"/pricing"  },
  { label:"FAQ",      to:"/faq"      },
  { label:"Contact",  to:"/contact"  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        background: scrolled ? "rgba(255,255,255,.97)" : "rgba(255,255,255,.92)",
        backdropFilter:"blur(12px)",
        boxShadow: scrolled ? "0 2px 24px rgba(11,37,69,.1)" : "none",
        transition:"all .3s",
        padding: scrolled ? "12px 0" : "16px 0",
      }}
    >
      <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <div
          style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
          onClick={() => navigate("/")}
        >
          <div style={{
            width:38, height:38, borderRadius:12,
            background:"linear-gradient(135deg,#0ea5e9,#10b981)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="tooth" size={20} style={{ color:"#fff" }} />
          </div>
          <span className="serif" style={{ fontSize:"1.3rem", fontWeight:700, color:"#0b2545" }}>
            Pearl<span style={{ color:"#0ea5e9" }}>Dent</span>
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display:"flex", alignItems:"center", gap:28 }} className="hidden-mobile">
          {NAV_ITEMS.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to==="/"} className={({ isActive }) => `nav-link${isActive?" active":""}`}>
              {n.label}
            </NavLink>
          ))}
        </div>

        <button className="btn-primary hidden-mobile" style={{ fontSize:".85rem", padding:"10px 22px" }} onClick={() => navigate("/contact")}>
          Book Appointment <Icon name="arrow" size={15} />
        </button>

        {/* Mobile toggle */}
        <button
          style={{ background:"none", border:"none", cursor:"pointer", display:"none" }}
          className="show-mobile"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} size={26} style={{ color:"#0b2545" }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          background:"#fff", borderTop:"1px solid #e2e8f0",
          padding:"16px 24px", display:"flex", flexDirection:"column", gap:12
        }}>
          {NAV_ITEMS.map(n => (
            <NavLink
              key={n.to} to={n.to} end={n.to==="/"}
              className={({ isActive }) => `nav-link${isActive?" active":""}`}
              onClick={() => setOpen(false)}
              style={{ padding:"6px 0", fontSize:"1rem" }}
            >
              {n.label}
            </NavLink>
          ))}
          <button className="btn-primary" style={{ marginTop:8 }} onClick={() => { navigate("/contact"); setOpen(false); }}>
            Book Appointment
          </button>
        </div>
      )}

      {/* Responsive helpers */}
      <style>{`
        @media(max-width:768px){
          .hidden-mobile{ display:none !important; }
          .show-mobile{ display:block !important; }
        }
        @media(min-width:769px){
          .show-mobile{ display:none !important; }
        }
      `}</style>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer style={{ background:"#0b2545", color:"#fff", padding:"64px 24px 32px" }}>
      <div style={{ maxWidth:1180, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:40, marginBottom:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, cursor:"pointer" }} onClick={() => navigate("/")}>
              <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#0ea5e9,#10b981)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Icon name="tooth" size={18} style={{ color:"#fff" }} />
              </div>
              <span className="serif" style={{ fontSize:"1.2rem", fontWeight:700 }}>Pearl<span style={{ color:"#0ea5e9" }}>Dent</span></span>
            </div>
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:".85rem", lineHeight:1.7 }}>
              Premium dental care in the heart of Bangalore. Your smile is our greatest achievement.
            </p>
          </div>
          {[
            { title:"Quick Links", items:["Home:/ ","Services:/services","Gallery:/gallery","Pricing:/pricing"] },
            { title:"Treatments",  items:["Cleaning","Braces","Whitening","Implants","Root Canal"] },
            { title:"Contact",     items:["+91 98765 43210","hello@pearldent.in","42 Brigade Road","Bangalore – 560001"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:".82rem", fontWeight:700, letterSpacing:".08em", color:"#67e8f9", marginBottom:16, textTransform:"uppercase" }}>
                {col.title}
              </h4>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                {col.items.map(item => {
                  const parts = item.split(":");
                  const label = parts[0]; const path = parts[1];
                  return (
                    <li key={label}>
                      {path
                        ? <span style={{ color:"rgba(255,255,255,.5)", fontSize:".85rem", cursor:"pointer", transition:"color .2s" }}
                            onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}
                            onClick={()=>navigate(path.trim())}>{label}</span>
                        : <span style={{ color:"rgba(255,255,255,.5)", fontSize:".85rem" }}>{label}</span>
                      }
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:"rgba(255,255,255,.3)", fontSize:".8rem" }}>© 2025 PearlDent Clinic. All rights reserved.</p>
          <div style={{ display:"flex", gap:16, color:"rgba(255,255,255,.3)", fontSize:".8rem" }}>
            <span>Privacy Policy</span><span>·</span><span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: HOME
// ─────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="hero-bg" style={{ minHeight:"100vh", display:"flex", alignItems:"center", paddingTop:100, paddingBottom:64, paddingLeft:24, paddingRight:24 }}>
        {/* blobs */}
        <div className="hero-blob" style={{ width:560,height:560,background:"#0ea5e9",top:-140,right:-80 }}/>
        <div className="hero-blob" style={{ width:380,height:380,background:"#10b981",bottom:-60,left:80 }}/>

        <div style={{ maxWidth:1180, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          {/* Left copy */}
          <div style={{ color:"#fff" }}>
            <div className="fade-up d1" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)",
              borderRadius:50, padding:"6px 16px", fontSize:".82rem", marginBottom:24
            }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:"#4ade80",animation:"pulse 1.5s infinite" }}/>
              Now accepting new patients
            </div>
            <h1 className="fade-up d2 serif" style={{ fontSize:"clamp(2.4rem,5vw,4rem)", lineHeight:1.15, fontWeight:700, marginBottom:20 }}>
              Your Smile,<br/>
              <span className="g-text">Our Priority</span>
            </h1>
            <p className="fade-up d3" style={{ color:"rgba(255,255,255,.65)", fontSize:"1.05rem", lineHeight:1.75, maxWidth:440, marginBottom:32 }}>
              Experience world-class dental care in a warm, welcoming environment. Advanced technology meets genuine compassion.
            </p>
            <div className="fade-up d4" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ fontSize:".95rem" }} onClick={() => navigate("/contact")}>
                Book Appointment <Icon name="arrow" size={16} />
              </button>
              <button className="btn-outline" style={{ borderColor:"rgba(255,255,255,.35)", color:"#fff" }} onClick={() => navigate("/services")}>
                Our Services
              </button>
            </div>

            {/* Trust badges */}
            <div className="fade-up d5" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:48 }}>
              {[
                { icon:"shield", val:"Certified", sub:"Doctors" },
                { icon:"award",  val:"10+ Years", sub:"Experience" },
                { icon:"users",  val:"5000+",     sub:"Patients" },
              ].map(b => (
                <div key={b.val} className="trust-glass" style={{ padding:"16px 12px", textAlign:"center" }}>
                  <Icon name={b.icon} size={22} style={{ color:"#67e8f9", margin:"0 auto 8px" }} />
                  <div style={{ fontWeight:700, fontSize:".9rem" }}>{b.val}</div>
                  <div style={{ color:"rgba(255,255,255,.5)", fontSize:".76rem" }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual card */}
          <div className="anim-float fade-up d3" style={{ display:"flex", justifyContent:"center" }}>
            <div style={{
              width:360, height:400, borderRadius:28,
              background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)",
              backdropFilter:"blur(10px)",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, position:"relative"
            }}>
              <div style={{ fontSize:96 }}>😁</div>
              <p className="serif" style={{ color:"#fff", fontSize:"1.6rem", textAlign:"center", padding:"0 24px" }}>Smile Confidently</p>
              <p style={{ color:"rgba(255,255,255,.5)", fontSize:".85rem" }}>With PearlDent's expert care</p>

              {/* floating chips */}
              <div style={{
                position:"absolute", left:-20, top:"30%",
                background:"#fff", borderRadius:14, padding:"10px 14px",
                display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 28px rgba(0,0,0,.15)"
              }}>
                <div style={{ width:36,height:36,borderRadius:10,background:"#d1fae5",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Icon name="check" size={16} style={{ color:"#10b981" }} />
                </div>
                <div>
                  <div style={{ fontSize:".7rem", color:"#94a3b8" }}>Treatment</div>
                  <div style={{ fontSize:".82rem", fontWeight:700, color:"#0b2545" }}>Completed ✓</div>
                </div>
              </div>
              <div style={{
                position:"absolute", right:-20, bottom:"28%",
                background:"#fff", borderRadius:14, padding:"10px 14px",
                display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 28px rgba(0,0,0,.15)"
              }}>
                <div style={{ width:36,height:36,borderRadius:10,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Icon name="star" size={16} style={{ color:"#f59e0b" }} />
                </div>
                <div>
                  <div style={{ fontSize:".7rem", color:"#94a3b8" }}>Rating</div>
                  <div style={{ fontSize:".82rem", fontWeight:700, color:"#0b2545" }}>4.9 / 5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE STRIP ── */}
      <section style={{ background:"#fff", padding:"40px 24px", borderBottom:"1px solid #f1f5f9" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"center", gap:32 }}>
          {[
            { icon:"cleaning",  label:"Cleaning"  },
            { icon:"braces",    label:"Braces"    },
            { icon:"whitening", label:"Whitening" },
            { icon:"implants",  label:"Implants"  },
            { icon:"rct",       label:"RCT"       },
            { icon:"cosmetic",  label:"Cosmetic"  },
          ].map(s => (
            <div key={s.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }}
              onClick={() => navigate("/services")}
              className="svc-strip-item">
              <div className="svc-icon">
                <Icon name={s.icon} size={26} style={{ color:"#0ea5e9" }} />
              </div>
              <span style={{ fontSize:".82rem", fontWeight:600, color:"#64748b" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ background:"#f8fafc", padding:"96px 24px" }}>
        <div style={{ maxWidth:1180, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 className="serif section-title" style={{ fontSize:"2.4rem" }}>Why Choose PearlDent?</h2>
            <p style={{ color:"#64748b", marginTop:16, maxWidth:480, margin:"16px auto 0" }}>
              Cutting-edge technology with a caring touch — every visit is exceptional.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {[
              { e:"🔬", t:"Advanced Technology",    d:"Digital X-rays, 3D scanning, laser dentistry and AI-assisted diagnosis for precise, painless treatments." },
              { e:"💊", t:"Pain-Free Care",          d:"Topical anaesthesia, sedation options, and gentle techniques ensure a comfortable, stress-free visit." },
              { e:"🕐", t:"Same-Day Treatment",      d:"Emergency slots 7 days a week. Walk-ins welcome. Most treatments completed in a single visit." },
              { e:"🏆", t:"Award-Winning Clinic",    d:"Bangalore's Best Dental Clinic 2024 – Indian Dental Association, Karnataka Chapter." },
              { e:"💰", t:"Transparent Pricing",     d:"No hidden costs. Free consultations. EMI options. Partnered with 20+ insurance providers." },
              { e:"🌿", t:"Eco-Friendly Practice",   d:"Digital records, biodegradable materials, and sustainable practices for a greener experience." },
            ].map((item,i) => (
              <div key={i} className={`card fade-up d${(i%4)+1}`} style={{ padding:28 }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{item.e}</div>
                <h3 className="serif" style={{ fontSize:"1.15rem", marginBottom:8 }}>{item.t}</h3>
                <p style={{ color:"#64748b", fontSize:".875rem", lineHeight:1.7 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:"linear-gradient(135deg,#0b2545,#134e7c)", padding:"72px 24px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:24, textAlign:"center", color:"#fff" }}>
          {[
            { val:"5,000+", l:"Happy Patients"    },
            { val:"15+",    l:"Expert Doctors"    },
            { val:"10+",    l:"Years Excellence"  },
            { val:"4.9★",   l:"Average Rating"    },
          ].map(s => (
            <div key={s.val}>
              <div className="serif g-text" style={{ fontSize:"3rem", fontWeight:700 }}>{s.val}</div>
              <div style={{ color:"rgba(255,255,255,.55)", marginTop:6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:"#fff", padding:"96px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <h2 className="serif" style={{ fontSize:"2.2rem", marginBottom:16 }}>
            Ready for Your <span className="g-text">Dream Smile?</span>
          </h2>
          <p style={{ color:"#64748b", marginBottom:32, lineHeight:1.7 }}>
            Book a free consultation today. Our expert team is ready to create your perfect smile.
          </p>
          <button className="btn-primary" style={{ fontSize:"1rem", padding:"15px 36px" }} onClick={() => navigate("/contact")}>
            Book Free Consultation <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: SERVICES
// ─────────────────────────────────────────────────────────────
const ServicesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ paddingTop:100, paddingBottom:80, background:"#f8fafc", minHeight:"100vh" }}>
      <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ display:"inline-block", background:"#e0f2fe", color:"#0ea5e9", fontSize:".82rem", fontWeight:700, padding:"6px 18px", borderRadius:50, marginBottom:14 }}>
            Our Services
          </div>
          <h1 className="serif section-title" style={{ fontSize:"2.8rem" }}>Comprehensive Dental Care</h1>
          <p style={{ color:"#64748b", marginTop:16, maxWidth:500, margin:"16px auto 0" }}>
            From routine cleanings to full smile makeovers — every dental service under one roof.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:22 }}>
          {SERVICES.map((s,i) => (
            <div key={i} className={`card fade-up d${(i%3)+1}`} style={{ padding:28 }}>
              <div className="svc-icon" style={{ marginBottom:20 }}>
                <Icon name={s.icon} size={28} style={{ color:s.color }} />
              </div>
              <h3 className="serif" style={{ fontSize:"1.2rem", marginBottom:10 }}>{s.title}</h3>
              <p style={{ color:"#64748b", fontSize:".875rem", lineHeight:1.75, marginBottom:18 }}>{s.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:700, fontSize:".9rem", color:s.color }}>From {s.price}</span>
                <button style={{
                  display:"flex", alignItems:"center", gap:4, background:"none", border:"none",
                  fontWeight:700, fontSize:".85rem", color:s.color, cursor:"pointer", fontFamily:"Nunito"
                }} onClick={() => navigate("/contact")}>
                  Book <Icon name="arrow" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Process */}
        <div style={{ marginTop:96 }}>
          <h2 className="serif section-title" style={{ fontSize:"2rem", textAlign:"center", marginBottom:56 }}>How It Works</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:32, position:"relative" }}>
            {[
              { step:"01", e:"📅", t:"Book Online",      d:"Schedule in 60 seconds via our form or call us directly." },
              { step:"02", e:"💬", t:"Free Consult",     d:"Meet your dentist and get a personalised treatment plan." },
              { step:"03", e:"🦷", t:"Treatment",        d:"Experience gentle, state-of-the-art dental care." },
              { step:"04", e:"😁", t:"Smile! ✨",         d:"Walk out confident with your new smile and aftercare plan." },
            ].map((step,i) => (
              <div key={i} style={{ textAlign:"center", position:"relative" }}>
                <div style={{
                  width:64,height:64,borderRadius:"50%",
                  background:"linear-gradient(135deg,#e0f2fe,#d1fae5)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:26, margin:"0 auto 12px",
                }}>
                  {step.e}
                </div>
                <div style={{ fontSize:".7rem", fontWeight:800, color:"#0ea5e9", letterSpacing:".1em", marginBottom:6 }}>{step.step}</div>
                <h3 className="serif" style={{ fontSize:"1.1rem", marginBottom:6 }}>{step.t}</h3>
                <p style={{ color:"#64748b", fontSize:".85rem", lineHeight:1.6 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: GALLERY — Before/After Slider
// ─────────────────────────────────────────────────────────────
const BASlider = ({ before, after, label }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const update = useCallback((clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(x);
  }, []);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseUp   = () => { dragging.current = false; };
  const onMouseMove = (e) => { if (dragging.current) update(e.clientX); };
  const onTouch     = (e) => update(e.touches[0].clientX);

  useEffect(() => {
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div ref={ref} className="ba-wrap" style={{ height:260 }}
      onMouseDown={onMouseDown} onTouchMove={onTouch}
    >
      {/* After */}
      <div style={{
        position:"absolute", inset:0, height:"100%",
        background:"linear-gradient(135deg,#d1fae5,#a7f3d0)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8
      }}>
        <div style={{ fontSize:72 }}>{after}</div>
        <span style={{ fontSize:".72rem", fontWeight:700, background:"#10b981", color:"#fff", padding:"3px 12px", borderRadius:50 }}>AFTER</span>
      </div>
      {/* Before (clipped) */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", width:`${pos}%` }}>
        <div style={{
          minWidth:400, width:400, height:"100%",
          background:"linear-gradient(135deg,#fff8f0,#fed7aa)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8
        }}>
          <div style={{ fontSize:72 }}>{before}</div>
          <span style={{ fontSize:".72rem", fontWeight:700, background:"#f97316", color:"#fff", padding:"3px 12px", borderRadius:50 }}>BEFORE</span>
        </div>
      </div>
      {/* Handle */}
      <div className="ba-handle" style={{ left:`${pos}%` }}>
        <div className="ba-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b2545" strokeWidth="2.5">
            <path d="M8 4l-4 8 4 8M16 4l4 8-4 8"/>
          </svg>
        </div>
      </div>
      {/* Label */}
      <div style={{
        position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
        background:"rgba(11,37,69,.7)", color:"#fff", fontSize:".72rem",
        padding:"3px 12px", borderRadius:50, whiteSpace:"nowrap"
      }}>
        {label}
      </div>
    </div>
  );
};

const GalleryPage = () => (
  <div className="page-enter" style={{ paddingTop:100, paddingBottom:80, background:"#fff", minHeight:"100vh" }}>
    <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px" }}>
      <div style={{ textAlign:"center", marginBottom:64 }}>
        <div style={{ display:"inline-block", background:"#e0f2fe", color:"#0ea5e9", fontSize:".82rem", fontWeight:700, padding:"6px 18px", borderRadius:50, marginBottom:14 }}>
          Smile Gallery
        </div>
        <h1 className="serif section-title" style={{ fontSize:"2.8rem" }}>Real Transformations</h1>
        <p style={{ color:"#64748b", marginTop:16, maxWidth:480, margin:"16px auto 0" }}>
          Drag the slider to compare before &amp; after results from our real patients.
        </p>
      </div>

      {/* Sliders */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20, marginBottom:80 }}>
        {[
          { b:"😬", a:"😁",  l:"Teeth Whitening – 8 shades brighter"  },
          { b:"😶", a:"😄",  l:"Orthodontic Treatment – 18 months"     },
          { b:"😮", a:"🤩",  l:"Full Implant Restoration"              },
        ].map((item,i) => (
          <div key={i} style={{ background:"#f8fafc", borderRadius:20, padding:16, border:"1px solid #e2e8f0" }}>
            <BASlider before={item.b} after={item.a} label={item.l} />
            <p style={{ textAlign:"center", fontSize:".72rem", color:"#94a3b8", marginTop:8 }}>← Drag to compare →</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <h2 className="serif section-title" style={{ fontSize:"1.8rem", textAlign:"center", marginBottom:40 }}>Our Work</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
        {[
          { e:"😁", bg:"from-cyan-100 to-teal-50",   l:"Veneers"    },
          { e:"😄", bg:"from-blue-100 to-sky-50",    l:"Whitening"  },
          { e:"🤗", bg:"from-green-100 to-emerald-50",l:"Braces"    },
          { e:"😊", bg:"from-orange-100 to-amber-50", l:"Implant"   },
          { e:"🤩", bg:"from-purple-100 to-pink-50",  l:"Makeover"  },
          { e:"😎", bg:"from-indigo-100 to-blue-50",  l:"Cleaning"  },
          { e:"😃", bg:"from-yellow-100 to-lime-50",  l:"RCT"       },
          { e:"🥰", bg:"from-rose-100 to-pink-50",    l:"Paediatric"},
        ].map((item,i) => (
          <div key={i} className="gallery-item" style={{ aspectRatio:"1", cursor:"pointer" }}>
            <div style={{
              width:"100%", height:"100%",
              background:`linear-gradient(135deg,var(--tw-gradient-from,#e0f2fe),var(--tw-gradient-to,#f0fdf4))`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
              borderRadius:14,
              backgroundColor: ["#e0f7fa","#e3f2fd","#e8f5e9","#fff8e1","#fce4ec","#ede7f6","#f9fbe7","#fce4ec"][i],
            }}>
              <span style={{ fontSize:42 }}>{item.e}</span>
              <span style={{ fontSize:".72rem", fontWeight:700, background:"rgba(255,255,255,.7)", padding:"2px 10px", borderRadius:50, color:"#334155" }}>{item.l}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// PAGE: DOCTORS
// ─────────────────────────────────────────────────────────────
const DoctorsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ paddingTop:100, paddingBottom:80, background:"#f8fafc", minHeight:"100vh" }}>
      <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ display:"inline-block", background:"#e0f2fe", color:"#0ea5e9", fontSize:".82rem", fontWeight:700, padding:"6px 18px", borderRadius:50, marginBottom:14 }}>
            Our Team
          </div>
          <h1 className="serif section-title" style={{ fontSize:"2.8rem" }}>Meet Our Specialists</h1>
          <p style={{ color:"#64748b", marginTop:16, maxWidth:480, margin:"16px auto 0" }}>
            Board-certified dentists with decades of expertise and a genuine passion for beautiful smiles.
          </p>
        </div>

        {/* Doctor cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24, marginBottom:80 }}>
          {DOCTORS.map((doc,i) => (
            <div key={i} className={`card fade-up d${i+1}`} style={{ overflow:"hidden" }}>
              <div style={{
                padding:"40px 24px 24px",
                background:"linear-gradient(135deg,#e0f2fe,#d1fae5)",
                textAlign:"center"
              }}>
                <div style={{ fontSize:72, marginBottom:8 }}>{doc.emoji}</div>
                <div style={{
                  display:"inline-block", background:"rgba(255,255,255,.7)",
                  borderRadius:50, padding:"4px 14px",
                  fontSize:".75rem", fontWeight:700, color:"#0ea5e9"
                }}>{doc.exp} Experience</div>
              </div>
              <div style={{ padding:24 }}>
                <h3 className="serif" style={{ fontSize:"1.25rem", marginBottom:4 }}>{doc.name}</h3>
                <p style={{ color:"#0ea5e9", fontWeight:600, fontSize:".875rem", marginBottom:8 }}>{doc.role}</p>
                <Stars n={doc.rating} />
                <p style={{ color:"#94a3b8", fontSize:".75rem", marginTop:4, marginBottom:12 }}>{doc.reviews} patient reviews</p>
                <p style={{ color:"#64748b", fontSize:".85rem", lineHeight:1.7, marginBottom:14 }}>{doc.bio}</p>
                {doc.quals.map((q,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                    <Icon name="check" size={14} style={{ color:"#10b981", flexShrink:0, marginTop:2 }} />
                    <span style={{ fontSize:".8rem", color:"#475569" }}>{q}</span>
                  </div>
                ))}
                <button className="btn-primary" style={{ width:"100%", justifyContent:"center", marginTop:18, fontSize:".85rem", padding:"11px 0" }}
                  onClick={() => navigate("/contact")}>
                  Book with {doc.name.split(" ")[1]}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <h2 className="serif section-title" style={{ fontSize:"2rem", textAlign:"center", marginBottom:40 }}>Patient Reviews</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
          {REVIEWS.map((rev,i) => (
            <div key={i} className={`review-card fade-up d${(i%3)+1}`} style={{ padding:24 }}>
              <Icon name="quote" size={28} style={{ color:"#0ea5e9", opacity:.25 }} />
              <p style={{ color:"#475569", fontSize:".875rem", lineHeight:1.75, margin:"10px 0 18px" }}>{rev.text}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{
                    width:38, height:38, borderRadius:"50%",
                    background:"linear-gradient(135deg,#0ea5e9,#10b981)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"#fff", fontWeight:700, fontSize:".85rem"
                  }}>{rev.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:".85rem" }}>{rev.name}</div>
                    <div style={{ fontSize:".72rem", color:"#94a3b8" }}>{rev.date} · {rev.service}</div>
                  </div>
                </div>
                <Stars n={rev.rating} size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: PRICING
// ─────────────────────────────────────────────────────────────
const PricingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ paddingTop:100, paddingBottom:80, background:"#f8fafc", minHeight:"100vh" }}>
      <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ display:"inline-block", background:"#e0f2fe", color:"#0ea5e9", fontSize:".82rem", fontWeight:700, padding:"6px 18px", borderRadius:50, marginBottom:14 }}>
            Pricing
          </div>
          <h1 className="serif section-title" style={{ fontSize:"2.8rem" }}>Simple, Transparent Plans</h1>
          <p style={{ color:"#64748b", marginTop:16, maxWidth:440, margin:"16px auto 0" }}>
            No hidden fees. Choose the plan that fits your dental care needs and budget.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, alignItems:"start", marginBottom:72 }}>
          {PRICING.map((plan,i) => (
            <div key={i} className={`${plan.popular ? "price-popular" : "card"} fade-up d${i+1}`}
              style={{ padding:36, borderRadius:24, position:"relative" }}>
              {plan.popular && (
                <div style={{
                  position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)",
                  background:"linear-gradient(90deg,#0ea5e9,#10b981)", color:"#fff",
                  fontSize:".75rem", fontWeight:700, padding:"6px 20px", borderRadius:50,
                  boxShadow:"0 4px 16px rgba(14,165,233,.4)", whiteSpace:"nowrap"
                }}>⭐ Most Popular</div>
              )}
              <div style={{ fontSize:".8rem", fontWeight:700, color: plan.popular ? "#67e8f9" : "#0ea5e9", marginBottom:8 }}>
                {plan.name}
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, marginBottom:4 }}>
                <span className="serif" style={{ fontSize:"3rem", fontWeight:700, color: plan.popular ? "#fff" : "#0b2545" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize:".85rem", marginBottom:8, color: plan.popular ? "rgba(255,255,255,.55)" : "#94a3b8" }}>{plan.period}</span>
              </div>
              <p style={{ fontSize:".75rem", color: plan.popular ? "rgba(255,255,255,.45)" : "#94a3b8", marginBottom:24 }}>
                Billed monthly · Cancel anytime
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {plan.features.map((f,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{
                      width:20,height:20,borderRadius:"50%",flexShrink:0,
                      background: plan.popular ? "rgba(255,255,255,.15)" : "#d1fae5",
                      display:"flex",alignItems:"center",justifyContent:"center"
                    }}>
                      <Icon name="check" size={11} style={{ color: plan.popular ? "#a7f3d0" : "#10b981" }} />
                    </div>
                    <span style={{ fontSize:".85rem", color: plan.popular ? "rgba(255,255,255,.8)" : "#475569" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  width:"100%", padding:"13px 0", borderRadius:50, fontFamily:"Nunito",
                  fontWeight:700, fontSize:".9rem", cursor:"pointer",
                  border:"none",
                  background: plan.popular ? "#fff" : "linear-gradient(135deg,#0ea5e9,#10b981)",
                  color: plan.popular ? "#0b2545" : "#fff",
                  boxShadow: plan.popular ? "0 4px 16px rgba(0,0,0,.1)" : "0 4px 20px rgba(14,165,233,.35)",
                  transition:"transform .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
                onClick={() => navigate("/contact")}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* One-time prices */}
        <div className="card" style={{ padding:36 }}>
          <h2 className="serif" style={{ fontSize:"1.6rem", textAlign:"center", marginBottom:28 }}>One-Time Treatment Prices</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:8 }}>
            {[
              ["Dental Cleaning",       "₹800 – ₹1,200"],
              ["Teeth Whitening",       "₹3,500 – ₹6,000"],
              ["Single Tooth Implant",  "₹25,000 – ₹40,000"],
              ["Root Canal Treatment",  "₹5,000 – ₹8,000"],
              ["Metal Braces",          "₹20,000 – ₹30,000"],
              ["Invisalign Aligners",   "₹80,000 – ₹1,50,000"],
              ["Porcelain Veneer/tooth","₹8,000 – ₹12,000"],
              ["Dental Crown",          "₹5,000 – ₹10,000"],
              ["Tooth Extraction",      "₹500 – ₹2,000"],
            ].map(([name,price],i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between",
                padding:"10px 14px", borderRadius:10, background:"#f8fafc",
                fontSize:".875rem", transition:"background .2s", cursor:"default"
              }}
                onMouseEnter={e=>e.currentTarget.style.background="#e0f2fe"}
                onMouseLeave={e=>e.currentTarget.style.background="#f8fafc"}
              >
                <span style={{ color:"#475569" }}>{name}</span>
                <span style={{ fontWeight:700, color:"#0ea5e9" }}>{price}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign:"center", color:"#94a3b8", fontSize:".75rem", marginTop:18 }}>
            * Prices may vary based on case complexity. Free consultation included.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: FAQ
// ─────────────────────────────────────────────────────────────
const FAQItem = ({ q, a, open, onToggle }) => (
  <div style={{
    background:"#fff", borderRadius:16,
    border:`1px solid ${open ? "#bae6fd" : "#e2e8f0"}`,
    overflow:"hidden", marginBottom:10,
    transition:"border-color .3s",
  }}>
    <button
      onClick={onToggle}
      style={{
        width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"20px 24px", background:"none", border:"none", cursor:"pointer",
        fontFamily:"Nunito", textAlign:"left",
      }}
    >
      <span style={{ fontWeight:700, fontSize:".95rem", color:"#0b2545", paddingRight:16 }}>{q}</span>
      <div style={{
        width:32, height:32, borderRadius:"50%", flexShrink:0,
        background: open ? "linear-gradient(135deg,#0ea5e9,#10b981)" : "#e0f2fe",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all .3s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}>
        <Icon name="chevron" size={16} style={{ color: open ? "#fff" : "#0ea5e9" }} />
      </div>
    </button>
    <div className={`acc-body ${open ? "open" : ""}`}>
      <p style={{ padding:"0 24px 20px", color:"#64748b", fontSize:".9rem", lineHeight:1.8 }}>{a}</p>
    </div>
  </div>
);

const FAQPage = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="page-enter" style={{ paddingTop:100, paddingBottom:80, background:"#fff", minHeight:"100vh" }}>
      <div style={{ maxWidth:760, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ display:"inline-block", background:"#e0f2fe", color:"#0ea5e9", fontSize:".82rem", fontWeight:700, padding:"6px 18px", borderRadius:50, marginBottom:14 }}>
            FAQ
          </div>
          <h1 className="serif section-title" style={{ fontSize:"2.8rem" }}>Frequently Asked Questions</h1>
          <p style={{ color:"#64748b", marginTop:16 }}>
            Can't find your answer? Call us at{" "}
            <a href="tel:+919876543210" style={{ color:"#0ea5e9", fontWeight:600 }}>+91 98765 43210</a>
          </p>
        </div>
        {FAQS.map((faq,i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} open={open===i} onToggle={() => setOpen(open===i ? null : i)} />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: CONTACT
// ─────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm]           = useState({ name:"", phone:"", email:"", treatment:"", date:"", time:"" });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Name is required";
    if (!form.phone.trim())    e.phone    = "Phone is required";
    if (!form.email.trim())    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1300));
    setLoading(false);
    setSubmitted(true);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]:v })); setErrors(e => ({ ...e, [k]:undefined })); };

  if (submitted) return (
    <div className="page-enter" style={{ minHeight:"100vh", paddingTop:100, display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc" }}>
      <div className="scale-in" style={{ textAlign:"center", maxWidth:480, padding:24 }}>
        <div style={{
          width:96, height:96, borderRadius:"50%", background:"#d1fae5",
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px"
        }}>
          <Icon name="success" size={48} style={{ color:"#10b981" }} />
        </div>
        <h2 className="serif" style={{ fontSize:"2rem", marginBottom:12 }}>Appointment Booked!</h2>
        <p style={{ color:"#64748b", lineHeight:1.7, marginBottom:8 }}>
          Thank you, <strong>{form.name}</strong>! Your appointment request has been received.
        </p>
        <p style={{ color:"#94a3b8", fontSize:".85rem", marginBottom:28 }}>
          We'll confirm via SMS and email within 30 minutes.
        </p>
        <div className="card" style={{ padding:20, textAlign:"left", marginBottom:28 }}>
          {[["Treatment", form.treatment],["Date", form.date],["Time", form.time]].filter(([,v]) => v).map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:".875rem", padding:"6px 0", borderBottom:"1px solid #f1f5f9" }}>
              <span style={{ color:"#64748b" }}>{l}</span>
              <span style={{ fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ name:"",phone:"",email:"",treatment:"",date:"",time:"" }); }}>
          Book Another Appointment
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-enter" style={{ paddingTop:100, paddingBottom:80, background:"#f8fafc", minHeight:"100vh" }}>
      <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ display:"inline-block", background:"#e0f2fe", color:"#0ea5e9", fontSize:".82rem", fontWeight:700, padding:"6px 18px", borderRadius:50, marginBottom:14 }}>
            Contact Us
          </div>
          <h1 className="serif section-title" style={{ fontSize:"2.8rem" }}>Book Your Appointment</h1>
          <p style={{ color:"#64748b", marginTop:16, maxWidth:440, margin:"16px auto 0" }}>
            Fill the form below and we'll confirm your appointment within 30 minutes.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:24 }}>
          {/* Form */}
          <div className="card" style={{ padding:36 }}>
            <h2 className="serif" style={{ fontSize:"1.5rem", marginBottom:24 }}>Appointment Form</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Name */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"#334155" }}>Full Name *</label>
                <input className="f-input" placeholder="Your full name" value={form.name} onChange={e => set("name", e.target.value)} />
                {errors.name && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errors.name}</p>}
              </div>
              {/* Phone */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"#334155" }}>Phone *</label>
                <input className="f-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set("phone", e.target.value)} />
                {errors.phone && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errors.phone}</p>}
              </div>
              {/* Email */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"#334155" }}>Email *</label>
                <input className="f-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                {errors.email && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errors.email}</p>}
              </div>
              {/* Treatment */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"#334155" }}>Treatment Type</label>
                <select className="f-input" value={form.treatment} onChange={e => set("treatment", e.target.value)}>
                  <option value="">Select a treatment...</option>
                  {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                  <option value="General Checkup">General Checkup</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              {/* Date */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"#334155" }}>Preferred Date</label>
                <input className="f-input" type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                  onChange={e => set("date", e.target.value)} />
              </div>
              {/* Time */}
              <div>
                <label style={{ display:"block", fontWeight:700, fontSize:".82rem", marginBottom:6, color:"#334155" }}>Preferred Time</label>
                <select className="f-input" value={form.time} onChange={e => set("time", e.target.value)}>
                  <option value="">Select time...</option>
                  {["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","5:00 PM","5:30 PM","6:00 PM"].map(t =>
                    <option key={t} value={t}>{t}</option>
                  )}
                </select>
              </div>
            </div>
            <button className="btn-primary" style={{ width:"100%", justifyContent:"center", marginTop:24, padding:"14px 0", fontSize:".95rem" }}
              onClick={handleSubmit} disabled={loading}>
              {loading
                ? <><svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg> Booking…</>
                : <>Confirm Appointment <Icon name="arrow" size={17} /></>
              }
            </button>
          </div>

          {/* Info panel */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Contact info */}
            <div className="card" style={{ padding:24 }}>
              <h3 className="serif" style={{ fontSize:"1.2rem", marginBottom:16 }}>Clinic Information</h3>
              {[
                { icon:"location", t:"Address",  v:"42 Brigade Road, Indiranagar\nBangalore – 560001" },
                { icon:"phone",    t:"Phone",    v:"+91 98765 43210\n+91 80 4567 8901"              },
                { icon:"mail",     t:"Email",    v:"hello@pearldent.in"                              },
              ].map(c => (
                <div key={c.icon} style={{ display:"flex", gap:12, marginBottom:16 }}>
                  <div style={{
                    width:36,height:36,borderRadius:10,background:"#e0f2fe",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0
                  }}>
                    <Icon name={c.icon} size={15} style={{ color:"#0ea5e9" }} />
                  </div>
                  <div>
                    <div style={{ fontSize:".72rem", color:"#94a3b8", fontWeight:700 }}>{c.t}</div>
                    <div style={{ fontSize:".85rem", color:"#334155", whiteSpace:"pre-line" }}>{c.v}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timings */}
            <div className="card" style={{ padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <Icon name="clock" size={16} style={{ color:"#0ea5e9" }} />
                <h3 className="serif" style={{ fontSize:"1.1rem" }}>Clinic Timings</h3>
              </div>
              {[
                { d:"Mon – Fri",   t:"9:00 AM – 8:00 PM" },
                { d:"Saturday",    t:"9:00 AM – 6:00 PM" },
                { d:"Sunday",      t:"10:00 AM – 2:00 PM" },
                { d:"Emergency",   t:"24 / 7 Available", g:true },
              ].map(row => (
                <div key={row.d} style={{
                  display:"flex", justifyContent:"space-between",
                  fontSize:".85rem", padding:"7px 0",
                  borderBottom:"1px solid #f1f5f9", color: row.g ? "#10b981" : "#475569"
                }}>
                  <span>{row.d}</span>
                  <span style={{ fontWeight:700 }}>{row.t}</span>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5534!2d77.6408!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzQyLjMiTiA3N8KwMzgnMjYuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="200" style={{ border:0, display:"block" }}
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

// ─────────────────────────────────────────────────────────────
// SCROLL TO TOP ON ROUTE CHANGE
// ─────────────────────────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [pathname]);
  return null;
};

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <GlobalStyles />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"         element={<HomePage    />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/gallery"  element={<GalleryPage  />} />
        <Route path="/doctors"  element={<DoctorsPage  />} />
        <Route path="/pricing"  element={<PricingPage  />} />
        <Route path="/faq"      element={<FAQPage      />} />
        <Route path="/contact"  element={<ContactPage  />} />
      </Routes>
      <Footer />
    </Router>
  );
}