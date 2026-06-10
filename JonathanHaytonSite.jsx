import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ArrowRight, Shield, TrendingUp, PiggyBank, Landmark,
  HeartHandshake, Home, Phone, Mail, MapPin, ChevronDown, Quote,
  CheckCircle2, Calendar, FileText, Compass, Star, Award, Users, Clock
} from "lucide-react";
import portrait from "./jonathan-hayton-web.webp";

/* ------------------------------------------------------------------ */
/*  Global styles & keyframe animations                               */
/* ------------------------------------------------------------------ */
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes drift {
      0%   { transform: translate(0, 0) scale(1); }
      50%  { transform: translate(30px, -25px) scale(1.08); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes drift2 {
      0%   { transform: translate(0, 0) scale(1); }
      50%  { transform: translate(-25px, 20px) scale(1.05); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes pulseRing {
      0%   { transform: scale(1); opacity: .5; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .anim-fadeUp { animation: fadeUp .8s cubic-bezier(.22,1,.36,1) both; }
    .anim-fadeIn { animation: fadeIn .9s ease both; }
    .blob-1 { animation: drift 14s ease-in-out infinite; }
    .blob-2 { animation: drift2 18s ease-in-out infinite; }
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
    .reveal.is-visible { opacity: 1; transform: translateY(0); }
    .card-lift { transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s; }
    .card-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -12px rgba(6,78,59,.25); }
    .link-underline { position: relative; }
    .link-underline::after {
      content: ''; position: absolute; left: 0; bottom: -4px; height: 2px; width: 100%;
      background: #047857; transform: scaleX(0); transform-origin: left; transition: transform .3s ease;
    }
    .link-underline:hover::after, .link-underline.active::after { transform: scaleX(1); }
    .pulse-dot::before {
      content: ''; position: absolute; inset: 0; border-radius: 9999px;
      background: #34d399; animation: pulseRing 1.8s ease-out infinite;
    }
    html { scroll-behavior: smooth; }
    .bg-sage { background-color: #e9eedd; }
    .bg-sage-soft { background-color: #f2f5e8; }
    .bg-sage-deep { background-color: #dbe3c5; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCountUp(target, start) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);
  return val;
}

/* ------------------------------------------------------------------ */
/*  Placeholder image (SVG-based, no external requests)               */
/* ------------------------------------------------------------------ */
const Placeholder = ({ label, icon: Icon = Users, ratio = "aspect-[4/3]", rounded = "rounded-2xl" }) => (
  <div className={`${ratio} ${rounded} w-full overflow-hidden relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 flex items-center justify-center`}>
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`grid-${label}`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${label})`} />
    </svg>
    <div className="relative text-center px-6">
      <Icon className="w-12 h-12 text-emerald-200 mx-auto mb-3" strokeWidth={1.25} />
      <p className="text-emerald-100 text-sm font-medium tracking-wide uppercase">{label}</p>
      <p className="text-emerald-300 text-xs mt-1">Placeholder image</p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */
const Button = ({ children, onClick, variant = "primary", className = "", ...rest }) => {
  const base = "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 group";
  const styles = {
    primary: "bg-emerald-800 text-amber-50 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/25 hover:-translate-y-0.5",
    light: "bg-amber-50 text-emerald-900 hover:bg-amber-100 hover:shadow-lg hover:-translate-y-0.5",
    outline: "border-2 border-emerald-800 text-emerald-900 hover:bg-emerald-800 hover:text-amber-50",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className} disabled:opacity-60 disabled:cursor-not-allowed`} {...rest}>
      {children}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
};

const SectionLabel = ({ children }) => (
  <p className="text-emerald-700 font-semibold tracking-[0.2em] uppercase text-xs mb-3">{children}</p>
);

const PageHero = ({ label, title, sub }) => (
  <section className="bg-emerald-900 text-amber-50 pt-36 pb-20 px-6 relative overflow-hidden">
    <div className="blob-1 absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-700/40 blur-3xl" />
    <div className="blob-2 absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-emerald-600/30 blur-3xl" />
    <div className="max-w-5xl mx-auto relative">
      <p className="anim-fadeUp text-emerald-300 font-semibold tracking-[0.2em] uppercase text-xs mb-4">{label}</p>
      <h1 className="anim-fadeUp text-4xl md:text-5xl font-bold leading-tight mb-5" style={{ animationDelay: ".1s" }}>{title}</h1>
      {sub && <p className="anim-fadeUp text-emerald-100/85 text-lg max-w-2xl leading-relaxed" style={{ animationDelay: ".2s" }}>{sub}</p>}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const SERVICES = [
  { icon: PiggyBank, title: "Retirement & Pension Planning", desc: "Build a clear picture of the retirement you want, then a realistic plan to fund it — pension consolidation, drawdown strategies and annuity advice." },
  { icon: TrendingUp, title: "Investments & Wealth Management", desc: "Evidence-based portfolios matched to your goals and appetite for risk, reviewed regularly and explained in plain English." },
  { icon: Landmark, title: "Inheritance & Estate Planning", desc: "Pass on more of what you've built. Practical strategies to manage inheritance tax, trusts and gifting — handled sensitively." },
  { icon: Shield, title: "Protection & Insurance", desc: "Life cover, critical illness and income protection, so an unexpected event never derails your family's finances." },
  { icon: Home, title: "Mortgages & Equity Release", desc: "Whole-of-market mortgage advice for movers, remortgagers and later-life borrowing, including equity release." },
  { icon: HeartHandshake, title: "Financial Planning for Life Events", desc: "Divorce, bereavement, business sale or a windfall — calm, structured advice when life changes course." },
];

const STEPS = [
  { icon: Phone, title: "Free Discovery Call", desc: "A relaxed, no-obligation chat — by phone, video or over coffee in Worcester — to understand where you are and where you'd like to be." },
  { icon: Compass, title: "Understanding You", desc: "We go deeper into your finances, goals and attitude to risk. No jargon, no judgement — just honest questions and careful listening." },
  { icon: FileText, title: "Your Personal Plan", desc: "A clear, written financial plan with specific recommendations — and a transparent breakdown of exactly what it costs." },
  { icon: Calendar, title: "Ongoing Partnership", desc: "Annual reviews and proactive check-ins keep your plan on track as life, markets and legislation change." },
];

const TESTIMONIALS = [
  { quote: "Jonathan took the stress out of retirement planning completely. He explained everything clearly and never once made us feel rushed. We finally feel confident about the future.", name: "Margaret & David T.", role: "Retired teachers, Malvern" },
  { quote: "After my father passed away, Jonathan handled the inheritance planning with real sensitivity. Professional, patient and genuinely kind. I can't recommend him highly enough.", name: "Sarah W.", role: "Business owner, Worcester" },
  { quote: "I'd always found pensions baffling. One meeting with Jonathan and I understood more than I had in twenty years. Straight-talking advice without the sales pitch.", name: "James H.", role: "Engineer, Droitwich" },
  { quote: "Jonathan has looked after our family's finances for years. What sets him apart is that he genuinely cares — he remembers the details and always acts in our best interest.", name: "Priya & Anil K.", role: "GP & pharmacist, Worcester" },
];

const FAQS = [
  { q: "What does 'independent' financial advisor actually mean?", a: "As an independent financial advisor (IFA), I'm not tied to any bank, insurer or fund provider. I can recommend products from across the whole of the market, which means my advice is shaped by what's right for you — not by a sales target." },
  { q: "How much does financial advice cost?", a: "The initial discovery call is always free and without obligation. After that, fees depend on the complexity of the work and are always agreed in writing before anything begins. Typically this is a fixed fee for a financial plan, or a percentage for ongoing investment management. You'll never face a surprise invoice." },
  { q: "Do I have enough money to need a financial advisor?", a: "Advice isn't just for the wealthy. If you have a pension, a mortgage, savings you're not sure what to do with, or a family that depends on your income, a conversation is worthwhile. If I don't think paid advice would add value for you, I'll say so." },
  { q: "Is my money safe?", a: "I'm authorised and regulated by the Financial Conduct Authority (FCA). Investments are held with established, FCA-regulated platforms and custodians — never by me personally — and you may be protected by the Financial Services Compensation Scheme (FSCS)." },
  { q: "How often will we meet?", a: "Most clients have a full review once a year, with check-ins whenever something changes — in your life or in the markets. You can always pick up the phone in between; you won't be charged for a quick question." },
  { q: "Can we meet remotely?", a: "Of course. I meet clients face-to-face across Worcestershire — at my Worcester office or in your home — and by video call for those further afield." },
];

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
const NAV = ["Home", "About", "Services", "How I Work", "FAQ", "Contact"];

const Nav = ({ page, setPage }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (p) => { setPage(p); setOpen(false); window.scrollTo({ top: 0, behavior: "instant" }); };
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-amber-50/95 shadow-md backdrop-blur py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button onClick={() => go("Home")} className="flex items-center gap-3 text-left">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${scrolled ? "bg-emerald-800 text-amber-50" : "bg-amber-50 text-emerald-900"}`}>JH</div>
          <div>
            <p className={`font-bold leading-tight transition-colors duration-500 ${scrolled ? "text-emerald-900" : "text-amber-50"}`}>Jonathan Hayton</p>
            <p className={`text-xs transition-colors duration-500 ${scrolled ? "text-emerald-700" : "text-emerald-200"}`}>Independent Financial Advisor</p>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <button key={item} onClick={() => go(item)}
              className={`link-underline text-sm font-medium transition-colors duration-500 ${page === item ? "active" : ""} ${scrolled ? "text-emerald-900" : "text-amber-50"}`}>
              {item}
            </button>
          ))}
          <button onClick={() => go("Contact")}
            className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${scrolled ? "bg-emerald-800 text-amber-50 hover:bg-emerald-700" : "bg-amber-50 text-emerald-900 hover:bg-amber-100"}`}>
            Book a Call
          </button>
        </nav>
        <button className={`md:hidden transition-colors ${scrolled ? "text-emerald-900" : "text-amber-50"}`} onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden anim-fadeIn bg-amber-50 shadow-xl mt-3 mx-4 rounded-2xl overflow-hidden">
          {NAV.map((item) => (
            <button key={item} onClick={() => go(item)}
              className={`block w-full text-left px-6 py-4 font-medium border-b border-emerald-900/5 last:border-0 ${page === item ? "text-emerald-700 bg-sage" : "text-emerald-900"}`}>
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */
const Stats = () => {
  const ref = useRef(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver((e) => e[0].isIntersecting && setStart(true), { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const years = useCountUp(20, start);
  const families = useCountUp(350, start);
  const managed = useCountUp(85, start);
  const items = [
    { val: `${years}+`, label: "Years' experience", icon: Clock },
    { val: `${families}+`, label: "Families advised", icon: Users },
    { val: `£${managed}m+`, label: "Under advice", icon: TrendingUp },
    { val: "5.0", label: "Average client rating", icon: Star },
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map(({ val, label, icon: Icon }) => (
        <div key={label} className="text-center">
          <Icon className="w-6 h-6 text-emerald-300 mx-auto mb-3" />
          <p className="text-3xl md:text-4xl font-bold text-amber-50">{val}</p>
          <p className="text-emerald-200 text-sm mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
};

const TestimonialCarousel = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <div className="max-w-3xl mx-auto text-center">
      <Quote className="w-10 h-10 text-emerald-300 mx-auto mb-6" />
      <div key={i} className="anim-fadeIn">
        <p className="text-xl md:text-2xl text-emerald-950 leading-relaxed font-medium italic">"{t.quote}"</p>
        <p className="mt-6 font-bold text-emerald-900">{t.name}</p>
        <p className="text-emerald-700 text-sm">{t.role}</p>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {TESTIMONIALS.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === i ? "w-8 bg-emerald-700" : "w-2 bg-emerald-300 hover:bg-emerald-500"}`} />
        ))}
      </div>
    </div>
  );
};

const HomePage = ({ setPage }) => {
  const ref = useReveal();
  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="bg-emerald-900 text-amber-50 min-h-screen flex items-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="blob-1 absolute top-10 right-0 w-[480px] h-[480px] rounded-full bg-emerald-700/40 blur-3xl" />
        <div className="blob-2 absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-emerald-600/30 blur-3xl" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center relative">
          <div>
            <div className="anim-fadeUp inline-flex items-center gap-2 bg-emerald-800/70 border border-emerald-600/40 rounded-full px-4 py-1.5 text-sm text-emerald-100 mb-6">
              <span className="relative w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              Now taking on new clients in Worcestershire
            </div>
            <h1 className="anim-fadeUp text-4xl md:text-6xl font-bold leading-[1.1] mb-6" style={{ animationDelay: ".1s" }}>
              Clear, honest financial advice — <span className="text-emerald-300">without the jargon.</span>
            </h1>
            <p className="anim-fadeUp text-emerald-100/85 text-lg leading-relaxed mb-8 max-w-lg" style={{ animationDelay: ".2s" }}>
              I'm Jonathan Hayton, an independent financial advisor based in Worcester. For over 20 years I've helped families and business owners plan retirements, grow investments and protect what matters most.
            </p>
            <div className="anim-fadeUp flex flex-wrap gap-4" style={{ animationDelay: ".3s" }}>
              <Button variant="light" onClick={() => setPage("Contact")}>Book your free discovery call</Button>
              <Button variant="primary" className="!bg-emerald-800/60 border border-emerald-600/50 hover:!bg-emerald-700" onClick={() => setPage("Services")}>Explore services</Button>
            </div>
            <div className="anim-fadeUp flex items-center gap-5 mt-10 text-emerald-200 text-sm" style={{ animationDelay: ".4s" }}>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> FCA regulated</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Chartered status</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Whole of market</span>
            </div>
          </div>
          <div className="anim-fadeUp hidden md:block" style={{ animationDelay: ".25s" }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-700/30 rounded-3xl rotate-3" />
              <img src={portrait} alt="Jonathan Hayton, Independent Financial Advisor"
                className="relative w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-emerald-950 py-16 px-6">
        <div className="max-w-5xl mx-auto"><Stats /></div>
      </section>

      {/* Intro */}
      <section className="bg-amber-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <Placeholder label="Worcester Cathedral & riverside" icon={Landmark} />
          </div>
          <div className="reveal" style={{ transitionDelay: ".15s" }}>
            <SectionLabel>A local advisor you can trust</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-5 leading-tight">Financial advice should feel like a conversation, not a sales pitch.</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Money is personal. Behind every pension and portfolio there's a family, a business, a retirement dream. That's why every relationship starts with listening — understanding what you actually want from life, before any talk of products.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              As a fully independent advisor, I answer to you and no one else. No tied products, no commissions steering my advice — just transparent fees and recommendations made entirely in your interest.
            </p>
            <Button onClick={() => setPage("About")}>More about Jonathan</Button>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-sage-soft py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 reveal">
            <SectionLabel>What I can help with</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 leading-tight">Advice for every stage of life</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.slice(0, 3).map((s, idx) => (
              <div key={s.title} className="reveal card-lift bg-amber-50 rounded-2xl p-8 border border-emerald-900/5" style={{ transitionDelay: `${idx * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-sage-deep flex items-center justify-center mb-5">
                  <s.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-bold text-emerald-950 text-lg mb-3">{s.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Button onClick={() => setPage("Services")}>See all services</Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-amber-50 py-24 px-6">
        <div className="reveal"><TestimonialCarousel /></div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-900 py-20 px-6 relative overflow-hidden">
        <div className="blob-1 absolute -top-20 right-10 w-72 h-72 rounded-full bg-emerald-700/40 blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4">Ready to take the first step?</h2>
          <p className="text-emerald-100/85 mb-8 text-lg">The first conversation is free, friendly and entirely without obligation.</p>
          <Button variant="light" onClick={() => setPage("Contact")}>Book your free discovery call</Button>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  About page                                                         */
/* ------------------------------------------------------------------ */
const AboutPage = ({ setPage }) => {
  const ref = useReveal();
  const values = [
    { icon: HeartHandshake, title: "Honesty first", desc: "If advice isn't right for you, I'll tell you — even when that means less work for me." },
    { icon: Shield, title: "Truly independent", desc: "Whole-of-market access with no ties to banks, insurers or fund houses." },
    { icon: Users, title: "Relationships, not transactions", desc: "Most of my clients have been with me for over a decade. Many came by personal recommendation." },
    { icon: CheckCircle2, title: "Plain English, always", desc: "If you ever leave a meeting confused, I haven't done my job." },
  ];
  return (
    <div ref={ref}>
      <PageHero label="About" title="Meet Jonathan Hayton" sub="Two decades of helping Worcestershire families make confident financial decisions." />
      <section className="bg-amber-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-14 items-start">
          <div className="md:col-span-2 reveal">
            <div className="relative">
              <div className="absolute -inset-3 bg-sage-deep rounded-3xl -rotate-2" />
              <Placeholder label="Jonathan in his Worcester office" icon={Users} ratio="aspect-[4/5]" rounded="rounded-3xl" />
            </div>
            <div className="mt-8 bg-sage rounded-2xl p-6 border border-emerald-900/5">
              <h3 className="font-bold text-emerald-950 mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-700" /> Qualifications</h3>
              <ul className="text-stone-600 text-sm space-y-2">
                <li>• Chartered Financial Planner (CII)</li>
                <li>• Diploma in Regulated Financial Planning</li>
                <li>• Certificate in Mortgage Advice (CeMAP)</li>
                <li>• Later Life Lending accreditation</li>
              </ul>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="reveal">
              <SectionLabel>My story</SectionLabel>
              <h2 className="text-3xl font-bold text-emerald-950 mb-6 leading-tight">Born and raised in Worcestershire, serving the community I call home.</h2>
              <div className="text-stone-600 leading-relaxed space-y-4">
                <p>I began my career in financial services over twenty years ago, working for one of the UK's largest advice firms. I learned a great deal — but I also saw how easily good advice can be compromised when targets and tied products get in the way.</p>
                <p>So I set up my own independent practice here in Worcester, built on a simple idea: treat every client's money as carefully as you'd treat your own family's.</p>
                <p>Today I advise more than 350 households across Worcestershire and beyond — from young families taking out their first protection policy, to business owners planning an exit, to retirees making their pension last a lifetime.</p>
                <p>When I'm not at my desk, you'll find me in the gym, going for a run, or spending time with my family.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              {values.map((v, idx) => (
                <div key={v.title} className="reveal card-lift bg-sage rounded-2xl p-6 border border-emerald-900/5" style={{ transitionDelay: `${idx * 0.08}s` }}>
                  <v.icon className="w-6 h-6 text-emerald-700 mb-3" />
                  <h3 className="font-bold text-emerald-950 mb-2">{v.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-sage-soft py-20 px-6">
        <div className="max-w-3xl mx-auto text-center reveal">
          <h2 className="text-3xl font-bold text-emerald-950 mb-4">Let's have a conversation</h2>
          <p className="text-stone-600 mb-8">No pressure, no obligation — just a chance to see whether we're a good fit.</p>
          <Button onClick={() => setPage("Contact")}>Get in touch</Button>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Services page                                                      */
/* ------------------------------------------------------------------ */
const ServicesPage = ({ setPage }) => {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <PageHero label="Services" title="Advice for every stage of life" sub="Independent, whole-of-market advice — tailored to you, explained in plain English, with fees agreed up front." />
      <section className="bg-amber-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, idx) => (
            <div key={s.title} className="reveal card-lift bg-sage rounded-2xl p-8 border border-emerald-900/5" style={{ transitionDelay: `${(idx % 3) * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-sage-deep flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-bold text-emerald-950 text-lg mb-3">{s.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-sage-soft py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <SectionLabel>Fees & transparency</SectionLabel>
            <h2 className="text-3xl font-bold text-emerald-950 mb-5 leading-tight">No hidden charges. No surprises. Ever.</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Every engagement starts with a free discovery call. If we decide to work together, you'll receive a written fee agreement before any chargeable work begins — typically a fixed fee for financial planning, or a transparent percentage for ongoing investment management.
            </p>
            <ul className="space-y-3 mb-8">
              {["Free, no-obligation initial consultation", "All fees agreed in writing before work begins", "No commission-driven product recommendations", "Cancel ongoing services at any time"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => setPage("Contact")}>Request a fee guide</Button>
          </div>
          <div className="reveal" style={{ transitionDelay: ".15s" }}>
            <Placeholder label="Planning meeting" icon={FileText} />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  How I Work page                                                    */
/* ------------------------------------------------------------------ */
const ProcessPage = ({ setPage }) => {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <PageHero label="How I Work" title="A simple, four-step process" sub="From first hello to lifelong partnership — here's exactly what working together looks like." />
      <section className="bg-amber-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {STEPS.map((s, idx) => (
            <div key={s.title} className="reveal flex gap-6 md:gap-10 pb-14 last:pb-0 relative" style={{ transitionDelay: `${idx * 0.1}s` }}>
              {idx < STEPS.length - 1 && <div className="absolute left-7 top-16 bottom-0 w-px bg-emerald-200" />}
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-50 flex items-center justify-center shadow-lg shadow-emerald-900/20">
                  <s.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="pt-1">
                <p className="text-emerald-600 font-bold text-sm mb-1">Step {idx + 1}</p>
                <h3 className="text-xl font-bold text-emerald-950 mb-2">{s.title}</h3>
                <p className="text-stone-600 leading-relaxed max-w-xl">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-emerald-900 py-20 px-6 relative overflow-hidden">
        <div className="blob-2 absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-emerald-700/40 blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative reveal">
          <h2 className="text-3xl font-bold text-amber-50 mb-4">Step one costs nothing</h2>
          <p className="text-emerald-100/85 mb-8 text-lg">Book a free discovery call and find out what good advice could do for you.</p>
          <Button variant="light" onClick={() => setPage("Contact")}>Book your call</Button>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  FAQ page                                                           */
/* ------------------------------------------------------------------ */
const FaqItem = ({ q, a, isOpen, onToggle }) => (
  <div className="bg-sage rounded-2xl border border-emerald-900/5 overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 p-6 text-left">
      <span className="font-bold text-emerald-950">{q}</span>
      <ChevronDown className={`w-5 h-5 text-emerald-700 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
    </button>
    <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
      <div className="overflow-hidden">
        <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
      </div>
    </div>
  </div>
);

const FaqPage = ({ setPage }) => {
  const ref = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div ref={ref}>
      <PageHero label="FAQ" title="Questions, answered honestly" sub="The things people most often ask before picking up the phone." />
      <section className="bg-amber-50 py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((f, idx) => (
            <div key={f.q} className="reveal" style={{ transitionDelay: `${idx * 0.06}s` }}>
              <FaqItem q={f.q} a={f.a} isOpen={openIdx === idx} onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)} />
            </div>
          ))}
          <div className="reveal text-center pt-10">
            <p className="text-stone-600 mb-6">Still have a question? I'd be glad to answer it.</p>
            <Button onClick={() => setPage("Contact")}>Ask Jonathan</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Contact page                                                       */
/* ------------------------------------------------------------------ */
const ContactPage = () => {
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "Retirement & pensions", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (e.target.botcheck.checked) return; // honeypot — silently drop bots
    setSending(true);
    setError(false);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "96ad84a7-0a64-4754-a458-b579e1cb7b77",
          subject: `Website enquiry: ${form.topic} — ${form.name}`,
          from_name: "Jonathan Hayton website",
          name: form.name,
          email: form.email,
          phone: form.phone || "Not provided",
          topic: form.topic,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(true);
    } catch {
      setError(true);
    }
    setSending(false);
  };
  const inputCls = "w-full bg-amber-50 border border-emerald-900/10 rounded-xl px-4 py-3 text-emerald-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";
  return (
    <div ref={ref}>
      <PageHero label="Contact" title="Let's start the conversation" sub="Call, email or send a message — I personally reply to every enquiry, usually within one working day." />
      <section className="bg-amber-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-6">
            {[
              { icon: Phone, title: "Phone", lines: ["01905 000 000", "Mon–Fri, 9am–5:30pm"] },
              { icon: Mail, title: "Email", lines: ["jonathan@haytonfinancial.co.uk", "Replies within one working day"] },
              { icon: MapPin, title: "Office", lines: ["12 Foregate Street, Worcester WR1 1AA", "Home visits available across Worcestershire"] },
            ].map(({ icon: Icon, title, lines }, idx) => (
              <div key={title} className="reveal card-lift bg-sage rounded-2xl p-6 border border-emerald-900/5 flex gap-4" style={{ transitionDelay: `${idx * 0.08}s` }}>
                <div className="w-12 h-12 rounded-xl bg-sage-deep flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-emerald-950">{title}</h3>
                  {lines.map((l) => (
                    <p key={l} className="text-stone-600 text-sm break-words">
                      {l.includes("@")
                        ? <a href={`mailto:${l}`} className="underline decoration-emerald-300 underline-offset-2 hover:text-emerald-700 transition-colors">{l}</a>
                        : l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div className="reveal" style={{ transitionDelay: ".25s" }}>
              <Placeholder label="Map — Foregate Street, Worcester" icon={MapPin} ratio="aspect-[4/3]" />
            </div>
          </div>
          <div className="md:col-span-3 reveal" style={{ transitionDelay: ".1s" }}>
            <div className="bg-sage rounded-3xl p-8 md:p-10 border border-emerald-900/5 shadow-xl shadow-emerald-900/5">
              {sent ? (
                <div className="anim-fadeUp text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-sage-deep flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-950 mb-3">Thank you, {form.name.split(" ")[0] || "there"}!</h3>
                  <p className="text-stone-600 max-w-sm mx-auto">Your message has been received. Jonathan will be in touch within one working day.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <h3 className="text-xl font-bold text-emerald-950 mb-1">Book your free discovery call</h3>
                  <p className="text-stone-500 text-sm !mt-1 mb-4">No obligation, no pressure — just a friendly chat.</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <input required className={inputCls} placeholder="Your name" value={form.name} onChange={update("name")} />
                    <input required type="email" className={inputCls} placeholder="Email address" value={form.email} onChange={update("email")} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <input className={inputCls} placeholder="Phone (optional)" value={form.phone} onChange={update("phone")} />
                    <select className={inputCls} value={form.topic} onChange={update("topic")}>
                      {["Retirement & pensions", "Investments", "Inheritance planning", "Protection & insurance", "Mortgages", "Something else"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <textarea required rows={5} className={inputCls} placeholder="Tell me a little about your situation…" value={form.message} onChange={update("message")} />
                  <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
                  {error && (
                    <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      Sorry, something went wrong sending your message. Please try again, or email <a href="mailto:jonathan@haytonfinancial.co.uk" className="underline">jonathan@haytonfinancial.co.uk</a> directly.
                    </p>
                  )}
                  <Button className="w-full justify-center" disabled={sending}>
                    {sending ? "Sending…" : "Send message"}
                  </Button>
                  <p className="text-stone-400 text-xs text-center">Your details are kept private and never shared with third parties.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
const Footer = ({ setPage }) => (
  <footer className="bg-emerald-950 text-emerald-200 px-6 pt-16 pb-8">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-emerald-800/50">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-emerald-900 flex items-center justify-center font-bold">JH</div>
            <div>
              <p className="font-bold text-amber-50">Jonathan Hayton</p>
              <p className="text-xs text-emerald-400">Independent Financial Advisor</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-emerald-300/80">
            Clear, honest, independent financial advice for families and business owners across Worcestershire.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-amber-50 mb-4 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n}>
                <button onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "instant" }); }} className="hover:text-amber-50 transition-colors">{n}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-amber-50 mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-emerald-300/80">
            <li className="flex gap-2 items-start"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> 01905 000 000</li>
            <li className="flex gap-2 items-start"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> <a href="mailto:jonathan@haytonfinancial.co.uk" className="min-w-0 break-words hover:text-amber-50 transition-colors">jonathan@haytonfinancial.co.uk</a></li>
            <li className="flex gap-2 items-start"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 12 Foregate Street, Worcester WR1 1AA</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 text-xs text-emerald-400/70 leading-relaxed space-y-3">
        <p>Hayton Financial Planning Ltd is authorised and regulated by the Financial Conduct Authority (FCA No. 000000). Registered in England & Wales No. 00000000. Registered office: 12 Foregate Street, Worcester WR1 1AA.</p>
        <p>The value of investments can go down as well as up and you may get back less than you invested. Past performance is not a guide to future performance. The Financial Conduct Authority does not regulate tax or estate planning.</p>
        <p>© {new Date().getFullYear()} Jonathan Hayton Financial Planning. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  const [page, setPage] = useState("Home");
  const pages = {
    Home: <HomePage setPage={setPage} />,
    About: <AboutPage setPage={setPage} />,
    Services: <ServicesPage setPage={setPage} />,
    "How I Work": <ProcessPage setPage={setPage} />,
    FAQ: <FaqPage setPage={setPage} />,
    Contact: <ContactPage />,
  };
  return (
    <div className="font-sans antialiased bg-amber-50 min-h-screen">
      <GlobalStyles />
      <Nav page={page} setPage={setPage} />
      <main key={page} className="anim-fadeIn">{pages[page]}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
// Jonathan Hayton Financial Planning — single-file React site
