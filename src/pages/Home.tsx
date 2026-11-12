import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone, WhatsApp, Email, LocationOn, Close, Menu, ChevronLeft, ChevronRight,
  Pause, PlayArrow, VolumeOff, VolumeUp, Fullscreen, Plumbing, WaterDrop,
  Whatshot, SolarPower, Engineering, Home as HomeIcon, Verified, Add,
  DarkMode, LightMode, KeyboardArrowUp, Bolt, Star, Favorite, FavoriteBorder,
  Download, Share, ZoomIn, Search, GridView, ViewQuilt, Shuffle, ContactPage, Slideshow,
  SmartToy, MyLocation, CheckCircle,
} from "@mui/icons-material";
import "./Home.css";

/* ---------- ASSETS (works with .jpg / .jpeg / .png / .webp automatically) ---------- */
const imgCtx = (require as any).context("../assets", false, /^\.\/mtt(\d+)\.(jpe?g|png|webp)$/i);
const vidCtx = (require as any).context("../assets", false, /^\.\/mttVideo\.(mp4|webm|mov)$/i);
const asUrl = (m: any) => (m && m.default ? m.default : m);
const PHOTOS: { n: number; src: string }[] = imgCtx
  .keys()
  .map((k: string) => ({ n: Number(k.match(/mtt(\d+)/i)![1]), src: asUrl(imgCtx(k)) }))
  .sort((a: any, b: any) => a.n - b.n);
const VIDEO: string | null = vidCtx.keys().length ? asUrl(vidCtx(vidCtx.keys()[0])) : null;
const LOGO: string = asUrl(require("../assets/MyLogo.jpeg"));

/* ---------- BUSINESS DETAILS ---------- */
const PHONE_1 = "+266 6292 0883";
const PHONE_2 = "+266 5967 3049";
const EMAIL = "mttplumberscon@gmail.com";
const WA = "26662920883";

const SERVICES = [
  { icon: <Plumbing />, t: "Plumbing & repairs", d: "Leaks, burst pipes, blocked drains, taps, toilets and full house re-piping." },
  { icon: <SolarPower />, t: "Solar geysers", d: "Supply, installation and servicing of solar water heaters and evacuated-tube systems." },
  { icon: <Whatshot />, t: "Geysers & hot water", d: "Electric geyser replacement, thermostats, pressure valves and insulation." },
  { icon: <WaterDrop />, t: "Boreholes & water tanks", d: "Tank stands, pumps, pressure systems and rainwater harvesting." },
  { icon: <Engineering />, t: "Drainage & sewer", d: "Septic tanks, soak-aways, sewer lines and stormwater drainage." },
  { icon: <HomeIcon />, t: "Building & contracting", d: "New builds, renovations, bathrooms, kitchens and roofing, delivered start to finish." },
];

const AREAS = {
  Lesotho: ["Maseru", "Leribe", "Berea", "Mafeteng", "Mohale's Hoek", "Quthing", "Qacha's Nek", "Mokhotlong", "Thaba-Tseka", "Butha-Buthe"],
  "South Africa": ["Free State", "Gauteng", "KwaZulu-Natal", "Eastern Cape", "Western Cape", "Northern Cape", "North West", "Limpopo", "Mpumalanga"],
};

const STEPS = [
  ["Tell us the problem", "Call, WhatsApp or use the quote form below."],
  ["Site visit and quote", "We inspect the job and give you a clear, written price."],
  ["Work done properly", "Qualified plumbers and builders, with tidy and safe work."],
  ["Handover and support", "We test everything with you and stay reachable afterwards."],
];

const REVIEWS = [
  ["Solar geyser installed in one day, and the hot water has been excellent since.", "Homeowner, Maseru"],
  ["They arrived fast for a burst pipe and left the place clean. Fair price too.", "Property manager, Bloemfontein"],
  ["Our full bathroom renovation finished on time and looks superb.", "Homeowner, Leribe"],
];

const FAQ = [
  ["Do you work in both South Africa and Lesotho?", "Yes. We work nationwide in Lesotho and South Africa, including cross-border jobs."],
  ["Do you handle emergencies?", "Call or WhatsApp us any time. Emergency leaks and burst pipes are prioritised."],
  ["Is the quote free?", "Quotes through WhatsApp are free. For larger jobs we visit the site first so the price is accurate."],
  ["Can you install solar water heaters?", "Yes. We supply, install and service solar geysers and evacuated-tube systems."],
];

const PAGE = 12;

/* Optional portfolio categories: list the photo numbers for each group and filter chips appear.
   Example: { "Solar geysers": [1, 2, 5], "Bathrooms": [3, 4, 9] } */
const CATEGORIES: Record<string, number[]> = {};

const TIPS = [
  ["Burst pipe", "Close the main water valve, open the taps to drain the line, switch off the geyser at the board, then call us."],
  ["No hot water", "Check the geyser breaker and the thermostat reset button. If it still stays cold, do not keep resetting it. Call us."],
  ["Blocked drain", "Stop pouring water down it. Avoid harsh chemicals, which can damage pipes. We clear it properly."],
];

/* Quick-answer assistant (rule-based, no AI service needed) */
const ASSIST: [string, string][] = [
  ["Burst pipe right now", TIPS[0][1] + " Then call us on " + PHONE_2 + "."],
  ["No hot water", TIPS[1][1]],
  ["Blocked drain", TIPS[2][1]],
  ["Where do you work?", FAQ[0][1]],
  ["Solar geysers?", FAQ[3][1]],
  ["How do I get a quote?", "Use the quote form on this page, or tap the WhatsApp button below. Quotes through WhatsApp are free."],
];
const TOWNS = ["Bloemfontein", "Welkom", "Bethlehem", "Ladybrand", "Ficksburg", "Johannesburg", "Pretoria", "Durban", "Pietermaritzburg", "Cape Town", "Gqeberha", "Kimberley", "Polokwane", "Mbombela", "Rustenburg"];

const NAV_IDS = ["services", "portfolio", "video", "areas", "faq", "contact"];

const saveContact = () => {
  const v = ["BEGIN:VCARD", "VERSION:3.0", "FN:MTT Plumbers & Contractors", "ORG:MTT Plumbers & Contractors",
    `TEL;TYPE=CELL:${PHONE_1.replace(/\s/g, "")}`, `TEL;TYPE=CELL:${PHONE_2.replace(/\s/g, "")}`, `EMAIL:${EMAIL}`, "END:VCARD"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([v], { type: "text/vcard" }));
  a.download = "MTT-Plumbers-Contractors.vcf";
  a.click();
};

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const s = localStorage.getItem("mtt-theme");
      if (s === "light" || s === "dark") return s;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch { return "light"; }
  });
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(PAGE);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [faq, setFaq] = useState<number | null>(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", service: SERVICES[0].t, country: "Lesotho", place: "", msg: "" });
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("");
  const [toast, setToast] = useState("");
  const [favs, setFavs] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("mtt-favs") || "[]"); } catch { return []; }
  });
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"asc" | "desc" | "shuffle">("asc");
  const [seed, setSeed] = useState(1);
  const [view, setView] = useState<"masonry" | "grid">("masonry");
  const [zoom, setZoom] = useState(false);
  const [auto, setAuto] = useState(false);
  const touchX = useRef(0);
  const [people, setPeople] = useState(4);
  const [usage, setUsage] = useState(50);
  const [town, setTown] = useState("");
  const [loc, setLoc] = useState("");
  const [chat, setChat] = useState(false);
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "Hi, I am the MTT quick-help assistant. What do you need?" }]);
  const chatLog = useRef<HTMLDivElement>(null);

  const q3 = town.trim().toLowerCase();
  const hit = useMemo(() => {
    if (q3.length < 3) return null;
    const all: [string, string][] = [
      ...Object.entries(AREAS).flatMap(([c, l]) => l.map((a): [string, string] => [a, c])),
      ...TOWNS.map((a): [string, string] => [a, "South Africa"]),
    ];
    return all.find(([a]) => a.toLowerCase().includes(q3) || q3.includes(a.toLowerCase())) || null;
  }, [q3]);

  const list = useMemo(() => {
    let l = PHOTOS.filter((p) =>
      (!onlyFavs || favs.includes(p.n)) &&
      (!q.trim() || String(p.n).includes(q.trim())) &&
      (cat === "All" || (CATEGORIES[cat] || []).includes(p.n)));
    if (sort === "desc") l = [...l].reverse();
    if (sort === "shuffle") l = [...l].sort((a, b) => Math.sin(a.n * seed) - Math.sin(b.n * seed));
    return l;
  }, [onlyFavs, favs, q, cat, sort, seed]);

  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 1800); };
  const toggleTheme = () => {
    const n = theme === "light" ? "dark" : "light";
    setTheme(n);
    try { localStorage.setItem("mtt-theme", n); } catch { /* ignore */ }
  };
  const ask = (i: number) => setMsgs((m) => [...m, { me: true, t: ASSIST[i][0] }, { me: false, t: ASSIST[i][1] }]);
  const getLocation = () => {
    if (!navigator.geolocation) { say("Location is not available on this device"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setLoc(`https://maps.google.com/?q=${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`); say("Location added to your quote"); },
      () => say("Could not get your location. Please type your town."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  const toggleFav = (n: number) => {
    const next = favs.includes(n) ? favs.filter((x) => x !== n) : [...favs, n];
    setFavs(next);
    try { localStorage.setItem("mtt-favs", JSON.stringify(next)); } catch { /* ignore */ }
    say(favs.includes(n) ? "Removed from favourites" : "Saved to favourites");
  };
  const shareLink = async (n: number) => {
    const text = `Check out this MTT Plumbers & Contractors project (photo ${n}). Call ${PHONE_1}.`;
    try {
      if (navigator.share) await navigator.share({ title: "MTT Plumbers & Contractors", text, url: window.location.href });
      else window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.href)}`, "_blank", "noopener");
    } catch { /* cancelled */ }
  };
  const openAt = (i: number, slideshow = false) => { setZoom(false); setAuto(slideshow); setLightbox(i); };
  const step = (d: number) => { setZoom(false); setLightbox((i) => (i === null || !list.length ? i : (i + d + list.length) % list.length)); };

  const litres = people * usage;
  const size = [100, 150, 200, 300, 450, 600].find((s) => s >= litres) || 600;

  useEffect(() => {
    const els = NAV_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  const video = useRef<HTMLVideoElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState([0, 0, 0]);

  const STATS = [PHOTOS.length || 43, 2, 24];
  const STAT_LABELS = ["Projects pictured", "Countries served", "Hour emergency line"];

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrolled(h.scrollTop > 40);
      setProgress((h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1400, 1);
        setCounts(STATS.map((s) => Math.round(s * (1 - Math.pow(1 - p, 3)))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "+" || e.key === "z") setZoom((z) => !z);
      if (e.key === " ") { e.preventDefault(); setAuto((x) => !x); }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    const timer = auto ? setInterval(() => step(1), 3000) : undefined;
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = ""; if (timer) clearInterval(timer); };
    // eslint-disable-next-line
  }, [lightbox === null, auto, list.length]);

  useEffect(() => { document.querySelector(".mtt-thumb.on")?.scrollIntoView({ inline: "center", block: "nearest" }); }, [lightbox]);

  /* scroll-reveal animation */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(
      ".mtt-section h2, .mtt-section .mtt-sub, .mtt-services article, .mtt-steps li, .mtt-why div, .mtt-reviews figure, .mtt-areas > div, .mtt-calc-card, .mtt-faq"));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    els.forEach((el, i) => {
      el.classList.add("mtt-rv");
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      el.addEventListener("transitionend", () => { el.style.transitionDelay = ""; }, { once: true });
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* cursor spotlight on cards */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const c = (e.target as HTMLElement).closest?.(".mtt-services article, .mtt-areas > div, .mtt-reviews figure") as HTMLElement | null;
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("mousemove", move, { passive: true });
    return () => document.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => { chatLog.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [msgs, chat]);

  const togglePlay = () => {
    const v = video.current; if (!v) return;
    if (v.paused) { void v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const v = video.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
    if (!v.muted && v.paused) { void v.play(); setPlaying(true); }
  };
  const fullscreen = () => { void video.current?.requestFullscreen?.(); };

  const sendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const f = form;
    const details = f.msg.trim() ? ` Job details: ${f.msg.trim()}${/[.!?]$/.test(f.msg.trim()) ? "" : "."}` : "";
    const text =
      `Hello MTT Plumbers & Contractors, my name is ${f.name.trim()}. ` +
      `I am in ${f.place.trim()}, ${f.country}, and I need help with ${f.service.toLowerCase()}.${details} ` +
      `${loc ? `My location: ${loc} ` : ""}Please send me a quote. You can reach me on ${f.phone.trim()}. Thank you.`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };
  const go = () => setMenu(false);
  const set = (k: string) => (e: React.ChangeEvent<any>) => setForm({ ...form, [k]: e.target.value });

  const ld = {
    "@context": "https://schema.org", "@type": "Plumber", name: "MTT Plumbers & Contractors",
    telephone: PHONE_1, email: EMAIL, areaServed: ["Lesotho", "South Africa"],
  };

  return (
    <div className="mtt" data-theme={theme}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mtt-progress" style={{ width: `${progress}%` }} />

      {/* NAV */}
      <header className={`mtt-nav ${scrolled ? "is-solid" : ""}`}>
        <a href="#top" className="mtt-brand" aria-label="MTT Plumbers & Contractors">
          <img src={LOGO} alt="" />
          <span className="mtt-wordmark"><b>MTT</b><small>Plumbers &amp; Contractors</small></span>
        </a>
        <nav className={`mtt-links ${menu ? "open" : ""}`}>
          {[["services", "Services"], ["portfolio", "Portfolio"], ["video", "Watch"], ["areas", "Areas"], ["faq", "FAQ"], ["contact", "Contact"]].map(([id, l]) => (
            <a key={id} href={`#${id}`} onClick={go} className={active === id ? "on" : ""}>{l}</a>
          ))}
          <a className="mtt-btn mtt-btn-sm" href={`tel:${PHONE_1.replace(/\s/g, "")}`}><Phone fontSize="small" /> Call now</a>
        </nav>
        <button className="mtt-icon" aria-label="Toggle theme" onClick={toggleTheme}>
          {theme === "light" ? <DarkMode /> : <LightMode />}
        </button>
        <button className="mtt-icon mtt-burger" aria-label="Menu" onClick={() => setMenu(!menu)}>
          {menu ? <Close /> : <Menu />}
        </button>
      </header>

      {/* HERO */}
      <section id="top" className="mtt-hero">
        {VIDEO && (
          <video ref={video} className="mtt-hero-video" src={VIDEO} autoPlay muted loop playsInline poster={PHOTOS[0]?.src} />
        )}
        <div className="mtt-hero-shade" />
        <div className="mtt-wrap mtt-hero-body">
          <p className="mtt-kicker"><LocationOn fontSize="small" /> Lesotho and South Africa, nationwide</p>
          <h1>Water, heat and structure, built to last.</h1>
          <p className="mtt-lead">Plumbers and contractors for homes, farms and businesses. Solar geysers, repairs, drainage and full construction, with clear quotes and fast response.</p>
          <div className="mtt-cta">
            <a className="mtt-btn" href="#contact">Get a free quote</a>
            <a className="mtt-btn mtt-btn-ghost" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"><WhatsApp fontSize="small" /> WhatsApp us</a>
          </div>
        </div>
        {VIDEO && (
          <div className="mtt-hero-ctl">
            <button onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"}>{playing ? <Pause /> : <PlayArrow />}</button>
            <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>{muted ? <VolumeOff /> : <VolumeUp />}</button>
            <button onClick={fullscreen} aria-label="Fullscreen"><Fullscreen /></button>
          </div>
        )}
      </section>

      {/* STATS */}
      <div className="mtt-stats" ref={statsRef}>
        <div className="mtt-wrap mtt-stats-grid">
          {counts.map((c, i) => (
            <div key={i}><strong>{c}{i === 2 ? "/7" : "+"}</strong><span>{STAT_LABELS[i]}</span></div>
          ))}
        </div>
      </div>

      {/* EMERGENCY */}
      <aside className="mtt-emergency">
        <div className="mtt-wrap">
          <Bolt /> <span>Burst pipe or no hot water? We take emergency calls.</span>
          <a href={`tel:${PHONE_2.replace(/\s/g, "")}`}>{PHONE_2}</a>
        </div>
      </aside>

      {/* SERVICES */}
      <section id="services" className="mtt-section">
        <div className="mtt-wrap">
          <h2>What we do</h2>
          <p className="mtt-sub">One team for the pipes, the heat and the building around them.</p>
          <div className="mtt-services">
            {SERVICES.map((s) => (
              <article key={s.t}><span className="mtt-ico">{s.icon}</span><h3>{s.t}</h3><p>{s.d}</p></article>
            ))}
          </div>
        </div>
      </section>

      {/* GEYSER CALCULATOR */}
      <section className="mtt-section mtt-alt">
        <div className="mtt-wrap mtt-calc">
          <div>
            <h2>Solar geyser size guide</h2>
            <p className="mtt-sub">Tell us who lives in the house and we will suggest a tank size. It is a guide, and we confirm it on site.</p>
          </div>
          <div className="mtt-calc-card">
            <label>People in the home: <b>{people}</b>
              <input type="range" min={1} max={12} value={people} onChange={(e) => setPeople(+e.target.value)} />
            </label>
            <label>Hot water use
              <select value={usage} onChange={(e) => setUsage(+e.target.value)}>
                <option value={35}>Light (quick showers)</option>
                <option value={50}>Normal</option>
                <option value={70}>Heavy (baths, big family)</option>
              </select>
            </label>
            <div className="mtt-calc-out"><strong>{size} litres</strong><span>suggested tank for about {litres} litres a day</span></div>
            <a className="mtt-btn" target="_blank" rel="noreferrer"
               href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hello MTT, I would like a quote for a ${size} litre solar geyser for ${people} people.`)}`}>
              <WhatsApp fontSize="small" /> Get a quote for {size} L
            </a>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="mtt-section">
        <div className="mtt-wrap">
          <h2>Portfolio</h2>
          <p className="mtt-sub">Real jobs from our crews. Save favourites, search by photo number, shuffle, or start a slideshow.</p>

          <div className="mtt-bar">
            <label className="mtt-search"><Search fontSize="small" />
              <input placeholder="Photo number" inputMode="numeric" value={q} onChange={(e) => setQ(e.target.value.replace(/\D/g, ""))} aria-label="Search by photo number" />
            </label>
            <div className="mtt-chips">
              <button className={cat === "All" && !onlyFavs ? "on" : ""} onClick={() => { setCat("All"); setOnlyFavs(false); }}>All</button>
              <button className={onlyFavs ? "on" : ""} onClick={() => setOnlyFavs(!onlyFavs)}><Favorite fontSize="inherit" /> Favourites ({favs.length})</button>
              {Object.keys(CATEGORIES).map((c) => <button key={c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>)}
            </div>
            <div className="mtt-tools">
              <select value={sort} onChange={(e) => { setSort(e.target.value as any); if (e.target.value === "shuffle") setSeed(Math.random() * 100 + 1); }} aria-label="Sort photos">
                <option value="asc">Oldest first</option><option value="desc">Newest first</option><option value="shuffle">Shuffle</option>
              </select>
              {sort === "shuffle" && <button className="mtt-icon" aria-label="Shuffle again" onClick={() => setSeed(Math.random() * 100 + 1)}><Shuffle /></button>}
              <button className={`mtt-icon ${view === "masonry" ? "on" : ""}`} aria-label="Masonry view" onClick={() => setView("masonry")}><ViewQuilt /></button>
              <button className={`mtt-icon ${view === "grid" ? "on" : ""}`} aria-label="Grid view" onClick={() => setView("grid")}><GridView /></button>
              <button className="mtt-btn mtt-btn-sm" disabled={!list.length} onClick={() => openAt(0, true)}><Slideshow fontSize="small" /> Slideshow</button>
            </div>
          </div>
          <p className="mtt-count">Showing {Math.min(shown, list.length)} of {list.length} photos</p>

          {list.length === 0 ? (
            <div className="mtt-empty">
              <p>No photos match. {onlyFavs ? "Tap the heart on any photo to save it here." : "Try a different number."}</p>
              <button className="mtt-btn mtt-btn-outline" onClick={() => { setQ(""); setCat("All"); setOnlyFavs(false); }}>Clear filters</button>
            </div>
          ) : (
            <div className={`mtt-grid ${view}`}>
              {list.slice(0, shown).map((p, i) => (
                <div key={p.n} className="mtt-tile">
                  <button className="mtt-open" onClick={() => openAt(i)} aria-label={`Open project photo ${p.n}`}>
                    <img src={p.src} alt={`MTT project ${p.n}`} loading="lazy" />
                  </button>
                  <button className={`mtt-heart ${favs.includes(p.n) ? "on" : ""}`} onClick={() => toggleFav(p.n)} aria-pressed={favs.includes(p.n)} aria-label="Save to favourites">
                    {favs.includes(p.n) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                  </button>
                  <span className="mtt-tag">#{p.n}</span>
                </div>
              ))}
            </div>
          )}
          {shown < list.length && (
            <div className="mtt-center">
              <button className="mtt-btn mtt-btn-outline" onClick={() => setShown(shown + PAGE)}><Add /> Show more ({list.length - shown} left)</button>
              <button className="mtt-btn mtt-btn-outline" onClick={() => setShown(list.length)}>Show all</button>
            </div>
          )}
        </div>
      </section>

      {/* VIDEO SHOWCASE */}
      {VIDEO && (
        <section id="video" className="mtt-section mtt-dark">
          <div className="mtt-wrap mtt-video-grid">
            <div>
              <h2>See the work in motion</h2>
              <p className="mtt-sub">A short walk through our installations and site work.</p>
              <a className="mtt-btn" href="#contact">Book a site visit</a>
            </div>
            <video className="mtt-video" src={VIDEO} controls playsInline preload="metadata" poster={PHOTOS[1]?.src} />
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section className="mtt-section">
        <div className="mtt-wrap">
          <h2>How a job runs</h2>
          <ol className="mtt-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}><b>{i + 1}</b><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* AREAS */}
      <section id="areas" className="mtt-section mtt-alt">
        <div className="mtt-wrap">
          <h2>Where we work</h2>
          <p className="mtt-sub">Nationwide in both countries. If your town is not listed, call us and we will tell you straight away.</p>
          <div className="mtt-check">
            <label className="mtt-search"><Search fontSize="small" />
              <input placeholder="Type your town or province" value={town} onChange={(e) => setTown(e.target.value)} aria-label="Check if we serve your area" />
            </label>
            {q3.length >= 3 && (hit
              ? <span className="mtt-check-out ok" role="status"><CheckCircle fontSize="small" /> Yes, we serve {hit[0]}, {hit[1]}. <a href="#contact">Get a quote</a></span>
              : <span className="mtt-check-out no" role="status">Not on our list yet, but we may still reach you. <a href={`tel:${PHONE_1.replace(/\s/g, "")}`}>Call us</a></span>)}
          </div>
          <div className="mtt-areas">
            {Object.entries(AREAS).map(([c, list]) => (
              <div key={c}>
                <h3><LocationOn /> {c}</h3>
                <ul>{list.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY + REVIEWS */}
      <section className="mtt-section">
        <div className="mtt-wrap">
          <h2>Why customers call us back</h2>
          <div className="mtt-why">
            {["Clear written quotes", "Quality fittings and materials", "Tidy, safe workmanship", "Fast response, both countries"].map((w) => (
              <div key={w}><Verified /> {w}</div>
            ))}
          </div>
          <div className="mtt-reviews">
            {REVIEWS.map(([q, a]) => (
              <figure key={a}>
                <div className="mtt-stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} fontSize="small" />)}</div>
                <blockquote>{q}</blockquote>
                <figcaption>{a}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mtt-note">Sample reviews. Replace with your real customer feedback.</p>
        </div>
      </section>

      {/* EMERGENCY TIPS */}
      <section className="mtt-section mtt-alt">
        <div className="mtt-wrap">
          <h2>Before we arrive</h2>
          <p className="mtt-sub">Quick steps that limit the damage while you wait for us.</p>
          <div className="mtt-services">
            {TIPS.map(([h, d]) => <article key={h}><span className="mtt-ico"><Bolt /></span><h3>{h}</h3><p>{d}</p></article>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mtt-section">
        <div className="mtt-wrap mtt-narrow">
          <h2>Questions</h2>
          {FAQ.map(([q, a], i) => (
            <div key={q} className={`mtt-faq ${faq === i ? "open" : ""}`}>
              <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>{q}<Add /></button>
              <div><p>{a}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mtt-section mtt-dark">
        <div className="mtt-wrap mtt-contact">
          <div>
            <h2>Get your free quote</h2>
            <p className="mtt-sub">Fill the form and it opens WhatsApp with your details ready to send.</p>
            <ul className="mtt-details">
              <li><Phone /> <a href={`tel:${PHONE_1.replace(/\s/g, "")}`}>{PHONE_1}</a></li>
              <li><Phone /> <a href={`tel:${PHONE_2.replace(/\s/g, "")}`}>{PHONE_2}</a></li>
              <li><WhatsApp /> <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">Calls and WhatsApp</a></li>
              <li><Email /> <a href={`mailto:${EMAIL}`}>{EMAIL}</a> <button className="mtt-copy" onClick={copyEmail}>{copied ? "Copied" : "Copy"}</button></li>
              <li><LocationOn /> Lesotho and South Africa</li>
              <li><ContactPage /> <button className="mtt-copy" onClick={saveContact}>Save our contact to your phone</button></li>
            </ul>
          </div>
          <form onSubmit={sendQuote} className="mtt-form">
            <label>Your name<input required value={form.name} onChange={set("name")} autoComplete="name" /></label>
            <label>Phone<input required type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" /></label>
            <label>Service
              <select value={form.service} onChange={set("service")}>{SERVICES.map((s) => <option key={s.t}>{s.t}</option>)}</select>
            </label>
            <div className="mtt-row">
              <label>Country<select value={form.country} onChange={set("country")}><option>Lesotho</option><option>South Africa</option></select></label>
              <label>Town<input required value={form.place} onChange={set("place")} /></label>
            </div>
            <div className="mtt-loc">
              <button type="button" className="mtt-btn mtt-btn-outline mtt-btn-sm" onClick={getLocation}><MyLocation fontSize="small" /> {loc ? "Update my location" : "Share my location"}</button>
              {loc && <span><CheckCircle fontSize="inherit" /> Location will be sent with your quote</span>}
            </div>
            <label>Job details<textarea rows={4} value={form.msg} onChange={set("msg")} /></label>
            <button className="mtt-btn" type="submit"><WhatsApp fontSize="small" /> Send on WhatsApp</button>
          </form>
        </div>
      </section>

      <footer className="mtt-footer">
        <div className="mtt-wrap">
          <img src={LOGO} alt="MTT Plumbers & Contractors logo" />
          <span>© 2026 MTT Plumbers & Contractors. Lesotho and South Africa.</span>
        </div>
      </footer>

      {/* FLOATING */}
      <a className="mtt-fab" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><WhatsApp /></a>
      {scrolled && <button className="mtt-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><KeyboardArrowUp /></button>}

      <div className="mtt-bottombar">
        <a href={`tel:${PHONE_1.replace(/\s/g, "")}`}><Phone fontSize="small" /> Call</a>
        <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"><WhatsApp fontSize="small" /> WhatsApp</a>
        <a href="#contact">Free quote</a>
      </div>
      <button className="mtt-chat-fab" aria-label={chat ? "Close assistant" : "Open quick-help assistant"} aria-expanded={chat} onClick={() => setChat(!chat)}>
        {chat ? <Close /> : <SmartToy />}
      </button>
      {chat && (
        <div className="mtt-chat" role="dialog" aria-label="Ask MTT">
          <div className="mtt-chat-head"><strong>Ask MTT</strong><span>Quick answers, any time</span></div>
          <div className="mtt-chat-log" ref={chatLog}>
            {msgs.map((m, i) => <p key={i} className={m.me ? "me" : ""}>{m.t}</p>)}
          </div>
          <div className="mtt-chat-chips">
            {ASSIST.map(([l], i) => <button key={l} onClick={() => ask(i)}>{l}</button>)}
          </div>
          <a className="mtt-btn mtt-btn-sm" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"><WhatsApp fontSize="small" /> Talk to a person</a>
        </div>
      )}
      {toast && <div className="mtt-toast" role="status">{toast}</div>}

      {/* LIGHTBOX */}
      {lightbox !== null && list[lightbox] && (
        <div className="mtt-lb" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}
             onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
             onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - touchX.current; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); }}>
          <div className="mtt-lb-top" onClick={(e) => e.stopPropagation()}>
            <span>Photo {list[lightbox].n} · {lightbox + 1} of {list.length}</span>
            <div>
              <button aria-label="Favourite" onClick={() => toggleFav(list[lightbox].n)}>{favs.includes(list[lightbox].n) ? <Favorite /> : <FavoriteBorder />}</button>
              <button aria-label="Zoom" onClick={() => setZoom(!zoom)}><ZoomIn /></button>
              <button aria-label={auto ? "Pause slideshow" : "Play slideshow"} onClick={() => setAuto(!auto)}>{auto ? <Pause /> : <PlayArrow />}</button>
              <button aria-label="Share" onClick={() => shareLink(list[lightbox].n)}><Share /></button>
              <a aria-label="Download" href={list[lightbox].src} download={`MTT-project-${list[lightbox].n}`}><Download /></a>
              <button aria-label="Close" onClick={() => setLightbox(null)}><Close /></button>
            </div>
          </div>
          <button className="mtt-lb-n prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1); }}><ChevronLeft /></button>
          <div className={`mtt-lb-stage ${zoom ? "zoom" : ""}`} onClick={(e) => e.stopPropagation()}>
            <img src={list[lightbox].src} alt={`MTT project ${list[lightbox].n}`} onClick={() => setZoom(!zoom)} />
          </div>
          <button className="mtt-lb-n next" aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1); }}><ChevronRight /></button>
          <div className="mtt-lb-bottom" onClick={(e) => e.stopPropagation()}>
            <a className="mtt-btn mtt-btn-sm" target="_blank" rel="noreferrer"
               href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi MTT, I saw project photo ${list[lightbox].n} on your website and want something similar.`)}`}>
              <WhatsApp fontSize="small" /> Ask about a job like this
            </a>
            <div className="mtt-thumbs">
              {list.map((p, i) => <button key={p.n} className={`mtt-thumb ${i === lightbox ? "on" : ""}`} onClick={() => { setZoom(false); setLightbox(i); }} aria-label={`Photo ${p.n}`}><img src={p.src} alt="" loading="lazy" /></button>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
