import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { C, CATEGORIES } from "../constants/brand";
import useIsDesktop from "../hooks/useIsDesktop";
import usePageMeta from "../hooks/usePageMeta";

/**
 * Public directory pages for SEO.
 * These pages expose program data publicly so Google can crawl it.
 *
 * Routes:
 *   /camps                       — Main directory (browse by category, area, provider)
 *   /camps/category/:slug        — Category page
 *   /camps/area/:slug            — Area (city) page
 *   /camps/provider/:slug        — Provider page
 */

// Lazy-load the directory index (split from main bundle)
let _dirData = null;
function useDirectoryData() {
  const [data, setData] = useState(_dirData);
  useEffect(() => {
    if (_dirData) return;
    import("../data/directory-index.json").then((m) => {
      _dirData = m.default;
      setData(m.default);
    });
  }, []);
  return data;
}

// Lazy-load all programs from the slim Vercel Blob (same source as the in-app Discover tab)
const PROGRAMS_BLOB_URL = import.meta.env.VITE_PROGRAMS_URL || null;
let _cachedAllPrograms = null;
function useAllPrograms() {
  const [programs, setPrograms] = useState(_cachedAllPrograms || []);
  const [loading, setLoading] = useState(!_cachedAllPrograms);
  useEffect(() => {
    if (_cachedAllPrograms) return;
    if (!PROGRAMS_BLOB_URL) { setLoading(false); return; }
    fetch(PROGRAMS_BLOB_URL)
      .then((r) => r.json())
      .then((data) => { _cachedAllPrograms = data; setPrograms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return { programs, loading };
}

const PAGE_SIZE = 30;

// ── Shared styles ──
const font = "'Barlow', sans-serif";
const headFont = "'Poppins', sans-serif";

const pageWrap = (isDesktop) => ({
  background: C.cream,
  minHeight: "100dvh",
  fontFamily: font,
});

const container = (isDesktop) => ({
  maxWidth: 1100,
  margin: "0 auto",
  padding: isDesktop ? "0 48px 60px" : "0 20px 60px",
});

const heroStyle = (isDesktop) => ({
  background: "linear-gradient(135deg, #1B2432 0%, #2D9F6F 100%)",
  padding: isDesktop ? "48px 48px 40px" : "32px 20px 28px",
  color: "#fff",
});

const heroTitle = (isDesktop) => ({
  fontFamily: headFont,
  fontSize: isDesktop ? 36 : 26,
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: 10,
  color: "#fff",
});

const heroSub = {
  fontSize: 16,
  lineHeight: 1.6,
  opacity: 0.9,
  maxWidth: 640,
  marginBottom: 0,
};

const sectionTitle = {
  fontFamily: headFont,
  fontSize: 22,
  fontWeight: 700,
  color: C.ink,
  marginBottom: 16,
  marginTop: 36,
};

const cardGrid = (isDesktop) => ({
  display: "grid",
  gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
  gap: 12,
});

const card = {
  background: C.white,
  borderRadius: 12,
  padding: "16px 18px",
  boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
  textDecoration: "none",
  color: C.ink,
  transition: "box-shadow 0.15s",
  display: "block",
};

const cardTitle = {
  fontFamily: font,
  fontSize: 15,
  fontWeight: 700,
  color: C.ink,
  marginBottom: 4,
  lineHeight: 1.3,
};

const cardMeta = {
  fontSize: 13,
  color: "#4A6FA5",
  lineHeight: 1.5,
};

const pillStyle = {
  display: "inline-block",
  background: "rgba(45,159,111,0.1)",
  color: C.seaGreen,
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 20,
  padding: "3px 10px",
  marginRight: 6,
  marginBottom: 6,
};

const ctaBox = (isDesktop) => ({
  background: "linear-gradient(135deg, #1B2432 0%, #2D9F6F 100%)",
  borderRadius: 16,
  padding: isDesktop ? "36px 40px" : "28px 20px",
  textAlign: "center",
  marginTop: 40,
});

const ctaTitle = {
  fontFamily: headFont,
  fontSize: 22,
  fontWeight: 700,
  color: "#fff",
  marginBottom: 10,
};

const ctaText = {
  fontSize: 15,
  color: "rgba(255,255,255,0.85)",
  lineHeight: 1.6,
  marginBottom: 20,
  maxWidth: 500,
  margin: "0 auto 20px",
};

const ctaBtn = {
  display: "inline-block",
  fontFamily: font,
  fontSize: 16,
  fontWeight: 700,
  color: C.ink,
  background: "#fff",
  borderRadius: 10,
  padding: "14px 32px",
  textDecoration: "none",
  cursor: "pointer",
};

const breadcrumb = {
  fontSize: 13,
  color: "rgba(255,255,255,0.7)",
  marginBottom: 12,
};

const breadcrumbLink = {
  color: "rgba(255,255,255,0.7)",
  textDecoration: "none",
};

// ── Shared Components ──

function SiteHeader({ isDesktop, onNavigate }) {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: C.white,
      borderBottom: "0.5px solid rgba(27,36,50,0.08)",
      padding: isDesktop ? "0 48px" : "0 16px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img
          src="/skeddo-logo-dark.png"
          alt="Skeddo"
          style={{ height: 36, width: "auto", borderRadius: 8 }}
        />
      </Link>
      <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link to="/camps" style={{
          fontFamily: font,
          fontSize: 14,
          fontWeight: 600,
          color: C.ink,
          textDecoration: "none",
          padding: "8px 12px",
        }}>
          Browse Camps
        </Link>
        <Link to="/blog" style={{
          fontFamily: font,
          fontSize: 14,
          fontWeight: 600,
          color: C.ink,
          textDecoration: "none",
          padding: "8px 12px",
        }}>
          Guides
        </Link>
        <a
          href="/signin"
          onClick={(e) => { e.preventDefault(); onNavigate("signin"); }}
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 600,
            color: C.seaGreen,
            background: "transparent",
            border: `1.5px solid ${C.seaGreen}`,
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Log In
        </a>
        <a
          href="/signup"
          onClick={(e) => { e.preventDefault(); onNavigate("signup"); }}
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: C.seaGreen,
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Get Started Free
        </a>
      </nav>
    </header>
  );
}

function SiteFooter({ isDesktop }) {
  return (
    <footer style={{
      textAlign: "center",
      fontSize: 12,
      color: "#4A6FA5",
      padding: isDesktop ? "32px 48px" : "24px 20px",
      borderTop: `1px solid ${C.border}`,
      marginTop: 40,
    }}>
      <nav style={{ display: "flex", justifyContent: "center", gap: isDesktop ? 24 : 16, marginBottom: 10, flexWrap: "wrap" }}>
        <Link to="/camps" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>Browse Camps</Link>
        <Link to="/blog" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>Guides</Link>
        <Link to="/about" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>About</Link>
        <Link to="/privacy" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>Privacy & Terms</Link>
        <Link to="/help" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>Help & Contact</Link>
      </nav>
      <p>Made by Mended with Gold Inc. · Vancouver, BC</p>
    </footer>
  );
}

function CTASection({ isDesktop }) {
  return (
    <div style={ctaBox(isDesktop)}>
      <h2 style={ctaTitle}>Ready to plan your kids' summer?</h2>
      <p style={ctaText}>
        Sign up for free to save this to your planner, compare costs, and coordinate with other families.
      </p>
      <Link to="/signup" style={ctaBtn}>Get Started — It's Free</Link>
    </div>
  );
}

function ProgramTable({ programs, isDesktop, showProvider = true, onSelectProgram }) {
  if (!programs || programs.length === 0) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: font,
        fontSize: 14,
      }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}`, textAlign: "left" }}>
            <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Program</th>
            {showProvider && <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Provider</th>}
            <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Ages</th>
            <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Price</th>
            {isDesktop && <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Schedule</th>}
            {isDesktop && <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Area</th>}
          </tr>
        </thead>
        <tbody>
          {programs.map((p, i) => (
            <tr
              key={i}
              style={{ borderBottom: `1px solid ${C.border}`, cursor: onSelectProgram ? "pointer" : "default" }}
              onClick={() => onSelectProgram?.(p)}
              onMouseEnter={(e) => { if (onSelectProgram) e.currentTarget.style.background = "#F8F9FA"; }}
              onMouseLeave={(e) => { if (onSelectProgram) e.currentTarget.style.background = ""; }}
            >
              <td style={{ padding: "10px 12px", color: C.ink, fontWeight: 600 }}>{p.name}</td>
              {showProvider && <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>{p.provider}</td>}
              <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                {p.ageMin != null ? `${p.ageMin}\u2013${p.ageMax}` : "\u2014"}
              </td>
              <td style={{ padding: "10px 12px", color: C.ink }}>
                {p.cost != null ? `$${p.cost}` : "See provider"}
              </td>
              {isDesktop && (
                <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                  {p.dayLength || "\u2014"}
                </td>
              )}
              {isDesktop && (
                <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                  {p.neighbourhood || p.city || "\u2014"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsRow({ items, isDesktop }) {
  return (
    <div style={{
      display: "flex",
      gap: isDesktop ? 32 : 16,
      flexWrap: "wrap",
      marginTop: 16,
    }}>
      {items.map(([label, value], i) => (
        <div key={i}>
          <div style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 800, color: "#fff" }}>{value}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Page: Main Directory (/camps) ──

function DirectoryHome({ data, isDesktop, onNavigate }) {
  const { programs: allPrograms, loading: programsLoading } = useAllPrograms();
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Search & filter state
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const resultsRef = useRef(null);

  // Extract unique areas from programs for the filter dropdown
  const areaOptions = useMemo(() => {
    const cities = new Set();
    allPrograms.forEach((p) => { if (p.city) cities.add(p.city); });
    return [...cities].sort();
  }, [allPrograms]);

  // Category options from CATEGORIES constant
  const catOptions = useMemo(() => {
    return CATEGORIES.filter((c) => c !== "All");
  }, []);

  // Filter programs
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const age = ageFilter ? parseInt(ageFilter) : null;
    return allPrograms.filter((p) => {
      // Only show programs with open-ish statuses
      const status = (p.enrollmentStatus || "").toLowerCase();
      if (status === "completed" || status === "cancelled") return false;
      // Search
      if (q && !p.name?.toLowerCase().includes(q) && !p.provider?.toLowerCase().includes(q)
        && !p.neighbourhood?.toLowerCase().includes(q) && !p.activityType?.toLowerCase().includes(q)) return false;
      // Category
      if (selectedCat && p.category !== selectedCat) return false;
      // Age
      if (age !== null) {
        if (p.ageMin != null && p.ageMax != null && (age < p.ageMin || age > p.ageMax)) return false;
      }
      // Area
      if (areaFilter && p.city !== areaFilter) return false;
      return true;
    });
  }, [allPrograms, search, selectedCat, ageFilter, areaFilter]);

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search, selectedCat, ageFilter, areaFilter]);

  const visiblePrograms = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Merge similar categories for browse-by section
  const topCategories = useMemo(() => {
    if (!data) return [];
    const merged = {};
    for (const c of data.categories) {
      const key = c.slug;
      if (!merged[key]) merged[key] = { ...c, providers: [...c.providers] };
      else {
        merged[key].programCount += c.programCount;
        for (const p of c.providers) if (!merged[key].providers.includes(p)) merged[key].providers.push(p);
      }
    }
    return Object.values(merged)
      .filter(c => c.programCount >= 10)
      .sort((a, b) => b.programCount - a.programCount)
      .slice(0, 12);
  }, [data]);

  usePageMeta({
    title: "Browse Kids Camps & Programs in Vancouver | Skeddo",
    description: `Browse ${data?.totalPrograms?.toLocaleString() || "6,700"}+ kids camps, classes, and summer programs across Vancouver and the Lower Mainland. Filter by age, category, and neighbourhood.`,
    canonical: "https://skeddo.ca/camps",
  });

  // JSON-LD structured data for SEO
  useEffect(() => {
    if (!data) return;
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Kids Camps & Programs in Vancouver",
        description: `Browse ${data.totalPrograms}+ kids activities across ${data.totalAreas} areas from ${data.totalProviders}+ providers.`,
        numberOfItems: data.totalPrograms,
        itemListElement: topCategories.slice(0, 8).map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${c.name} Programs`,
          url: `https://skeddo.ca/camps/category/${c.slug}`,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Skeddo",
        url: "https://skeddo.ca",
        description: "Kids' camps and activities planner for Vancouver and the Lower Mainland.",
        publisher: { "@type": "Organization", name: "Mended with Gold Inc." },
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Skeddo",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        description: "Free family planner for kids' camps and activities in Vancouver and the Lower Mainland. Browse programs, track registrations, and manage your budget.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
        author: { "@type": "Organization", name: "Mended with Gold Inc.", url: "https://skeddo.ca" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Skeddo?",
            acceptedAnswer: { "@type": "Answer", text: "Skeddo is a free family planner that helps parents in Vancouver and the Lower Mainland browse kids' camps and activities, track registrations and waitlists, and manage their budget across all their children." },
          },
          {
            "@type": "Question",
            name: "How much does Skeddo cost?",
            acceptedAnswer: { "@type": "Answer", text: "Skeddo is completely free for families. There are no hidden fees or premium tiers." },
          },
          {
            "@type": "Question",
            name: "What areas does Skeddo cover?",
            acceptedAnswer: { "@type": "Answer", text: "Skeddo covers kids' activities and summer programs from 150+ providers across Vancouver, Burnaby, North Vancouver, West Vancouver, Richmond, New Westminster, Coquitlam, and the rest of the Lower Mainland." },
          },
          {
            "@type": "Question",
            name: "How many programs are listed on Skeddo?",
            acceptedAnswer: { "@type": "Answer", text: `Skeddo lists over ${data.totalPrograms.toLocaleString()} kids' programs including summer camps, sports, arts, STEM, and multi-activity camps from ${data.totalProviders}+ local providers.` },
          },
        ],
      },
    ];
    const scripts = schemas.map((s, i) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(s);
      script.id = `directory-jsonld-${i}`;
      document.head.appendChild(script);
      return script;
    });
    return () => { scripts.forEach(s => s.remove()); };
  }, [data, topCategories]);

  const hasActiveFilters = search || selectedCat || ageFilter || areaFilter;

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  const selectStyle = {
    fontFamily: font, fontSize: 14, padding: "10px 12px",
    borderRadius: 10, border: `1.5px solid ${C.border}`,
    background: C.white, color: C.ink, outline: "none",
    minWidth: 0, flex: "1 1 120px", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%234A6FA5' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
    paddingRight: 28,
  };

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      {/* Hero with search */}
      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={heroTitle(isDesktop)}>
            Browse {data.totalPrograms.toLocaleString()}+ Kids Camps &amp; Programs
          </h1>
          <p style={heroSub}>
            Find summer camps, classes, and activities for kids across Vancouver and the Lower Mainland.
          </p>

          {/* Search bar in hero */}
          <div style={{
            marginTop: 20,
            display: "flex",
            gap: 8,
            maxWidth: 600,
          }}>
            <input
              type="text"
              placeholder="Search camps, providers, activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                fontFamily: font, fontSize: 15, padding: "12px 16px",
                borderRadius: 10, border: "none",
                outline: "none", background: "rgba(255,255,255,0.95)",
                color: C.ink,
              }}
            />
          </div>
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Filter bar */}
        <div ref={resultsRef} style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          marginTop: 20, marginBottom: 16, alignItems: "center",
        }}>
          <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} style={selectStyle}>
            <option value="">All Categories</option>
            {catOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} style={selectStyle}>
            <option value="">Any Age</option>
            {[3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((a) => (
              <option key={a} value={a}>{a} years old</option>
            ))}
          </select>
          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} style={selectStyle}>
            <option value="">All Areas</option>
            {areaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearch(""); setSelectedCat(""); setAgeFilter(""); setAreaFilter(""); }}
              style={{
                fontFamily: font, fontSize: 13, fontWeight: 600,
                color: "#E74C3C", background: "none", border: "none",
                cursor: "pointer", padding: "8px 4px",
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ fontSize: 14, color: "#4A6FA5", fontWeight: 600, marginBottom: 12 }}>
          {programsLoading ? "Loading programs..." : `${filtered.length.toLocaleString()} programs found`}
        </div>

        {/* Program cards */}
        {!programsLoading && visiblePrograms.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : "1fr",
            gap: 12,
          }}>
            {visiblePrograms.map((p, i) => (
              <div
                key={p.id || i}
                onClick={() => setSelectedProgram(p)}
                style={{
                  background: C.white, borderRadius: 14, padding: "16px 18px",
                  boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s, transform 0.15s",
                  display: "flex", flexDirection: "column", gap: 6,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(27,36,50,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,36,50,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Category pill */}
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "#4A6FA5",
                  textTransform: "uppercase", letterSpacing: 0.8,
                }}>
                  {p.category}
                </div>
                {/* Name */}
                <div style={{ fontFamily: headFont, fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>
                  {p.name}
                </div>
                {/* Provider */}
                <div style={{ fontSize: 13, color: "#4A6FA5" }}>{p.provider}</div>
                {/* Details row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, color: C.ink, marginTop: 2 }}>
                  {p.cost != null && (
                    <span style={{ fontWeight: 700, color: C.seaGreen }}>${Number(p.cost).toLocaleString()}</span>
                  )}
                  {p.ageMin != null && (
                    <span>Ages {p.ageMin}\u2013{p.ageMax}</span>
                  )}
                  {(p.neighbourhood || p.city) && (
                    <span style={{ color: "#4A6FA5" }}>{p.neighbourhood || p.city}</span>
                  )}
                </div>
                {/* Schedule info */}
                {(p.dayLength || p.days) && (
                  <div style={{ fontSize: 12, color: "#4A6FA5" }}>
                    {p.dayLength}{p.days ? ` · ${p.days}` : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              style={{
                fontFamily: font, fontSize: 15, fontWeight: 700,
                color: C.seaGreen, background: C.white,
                border: `1.5px solid ${C.seaGreen}`, borderRadius: 10,
                padding: "12px 32px", cursor: "pointer",
              }}
            >
              Load More ({(filtered.length - visibleCount).toLocaleString()} remaining)
            </button>
          </div>
        )}

        {/* No results */}
        {!programsLoading && filtered.length === 0 && hasActiveFilters && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#4A6FA5" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>&#x1F50D;</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No programs match your filters</div>
            <div style={{ fontSize: 14, marginBottom: 16 }}>Try broadening your search or clearing some filters.</div>
            <button
              onClick={() => { setSearch(""); setSelectedCat(""); setAgeFilter(""); setAreaFilter(""); }}
              style={{
                fontFamily: font, fontSize: 14, fontWeight: 700,
                color: C.seaGreen, background: "none",
                border: `1.5px solid ${C.seaGreen}`, borderRadius: 8,
                padding: "8px 20px", cursor: "pointer",
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Browse by category — shown below results */}
        <h2 style={{ ...sectionTitle, marginTop: 40 }}>Browse by Category</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {topCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => { setSelectedCat(c.name); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: font, fontSize: 13, fontWeight: 600,
                color: selectedCat === c.name ? "#fff" : C.ink,
                background: selectedCat === c.name ? C.seaGreen : C.white,
                border: `1px solid ${selectedCat === c.name ? C.seaGreen : C.border}`,
                borderRadius: 20, padding: "8px 16px", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {c.name} ({c.programCount.toLocaleString()})
            </button>
          ))}
        </div>

        {/* Browse by area */}
        <h2 style={sectionTitle}>Browse by Area</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {(data?.areas || []).filter(a => a.programCount >= 20).slice(0, 15).map((a) => (
            <button
              key={a.slug}
              onClick={() => { setAreaFilter(a.name); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: font, fontSize: 13, fontWeight: 600,
                color: areaFilter === a.name ? "#fff" : C.ink,
                background: areaFilter === a.name ? C.seaGreen : C.white,
                border: `1px solid ${areaFilter === a.name ? C.seaGreen : C.border}`,
                borderRadius: 20, padding: "8px 16px", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {a.name} ({a.programCount.toLocaleString()})
            </button>
          ))}
        </div>

        {/* CTA — sign up to save */}
        <div style={{
          background: `linear-gradient(135deg, ${C.seaGreen}12, #4A6FA512)`,
          border: `1.5px solid ${C.seaGreen}25`,
          borderRadius: 16, padding: "24px 20px", textAlign: "center",
          marginTop: 32, marginBottom: 24,
        }}>
          <h3 style={{ fontFamily: headFont, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
            Found something you like?
          </h3>
          <p style={{ fontSize: 15, color: "#4A6FA5", lineHeight: 1.6, marginBottom: 16, maxWidth: 480, margin: "0 auto 16px" }}>
            Create a free account to save programs, track registrations, and manage your family's schedule and budget.
          </p>
          <button
            onClick={() => onNavigate("signup")}
            style={{
              fontFamily: font, fontSize: 15, fontWeight: 700,
              color: "#fff", background: C.seaGreen,
              border: "none", borderRadius: 10,
              padding: "12px 32px", cursor: "pointer",
            }}
          >
            Get Started Free
          </button>
        </div>

        {/* Planning Guides */}
        <div style={{
          background: "#fff", borderRadius: 16,
          padding: isDesktop ? "28px 32px" : "20px 20px",
          marginBottom: 32, boxShadow: "0 2px 8px rgba(27,36,50,0.06)",
        }}>
          <h2 style={{ fontFamily: headFont, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 16 }}>
            Planning Resources for Parents
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: 10 }}>
            {[
              { to: "/blog/best-summer-camps-vancouver-2026", icon: "\u2B50", label: "Best Summer Camps 2026" },
              { to: "/blog/vancouver-camp-costs-2026", icon: "\uD83D\uDCB0", label: "Camp Costs: What to Expect" },
              { to: "/blog/free-low-cost-camps-vancouver", icon: "\uD83C\uDF1F", label: "Free & Low-Cost Camps" },
              { to: "/blog/how-to-choose-summer-camp", icon: "\uD83E\uDDE9", label: "How to Choose a Camp" },
            ].map(({ to, icon, label }) => (
              <Link key={to} to={to} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 10,
                background: `${C.seaGreen}08`, textDecoration: "none",
                border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Program detail modal */}
      {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── Page: Category Detail (/camps/category/:slug) ──

function CategoryPage({ data, slug, isDesktop, onNavigate }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const category = useMemo(() => {
    if (!data) return null;
    return data.categories.find((c) => c.slug === slug);
  }, [data, slug]);

  usePageMeta({
    title: category ? `${category.name} Camps & Programs for Kids in Vancouver | Skeddo` : undefined,
    description: category ? `Browse ${category.programCount.toLocaleString()} ${category.name.toLowerCase()} programs for kids across the Lower Mainland from ${category.providers.length} providers.` : undefined,
    canonical: category ? `https://skeddo.ca/camps/category/${slug}` : undefined,
  });

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!category) return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={breadcrumb}>
            <Link to="/camps" style={breadcrumbLink}>Camps</Link>
            {" / "}
            <span style={{ color: "#fff" }}>{category.name}</span>
          </div>
          <h1 style={heroTitle(isDesktop)}>
            {category.name} Camps &amp; Programs for Kids
          </h1>
          <p style={heroSub}>
            Browse {category.programCount.toLocaleString()} {category.name.toLowerCase()} programs for kids
            across {category.cities.length} areas in the Lower Mainland,
            from {category.providers.length} local providers.
          </p>
          <StatsRow items={[
            ["Programs", category.programCount.toLocaleString()],
            ["Providers", `${category.providers.length}`],
            ["Areas", `${category.cities.length}`],
          ]} isDesktop={isDesktop} />
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Activity types */}
        {category.activityTypes.length > 0 && (
          <>
            <h2 style={sectionTitle}>Activity Types</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {category.activityTypes.slice(0, 20).map((t) => (
                <span key={t} style={pillStyle}>{t}</span>
              ))}
            </div>
          </>
        )}

        {/* Quick facts */}
        <h2 style={sectionTitle}>Quick Facts</h2>
        <div style={{ ...cardGrid(isDesktop), gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)" }}>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Age Range</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {category.ageMin != null ? `${category.ageMin}–${category.ageMax}` : "Various"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Price Range</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {category.costMin != null ? `$${category.costMin}–$${category.costMax}` : "Varies"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Providers</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{category.providers.length}</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Programs</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{category.programCount.toLocaleString()}</div>
          </div>
        </div>

        {/* Sample programs */}
        <h2 style={sectionTitle}>Sample Programs</h2>
        <ProgramTable programs={category.samplePrograms} isDesktop={isDesktop} showProvider={true} onSelectProgram={setSelectedProgram} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {category.samplePrograms.length} of {category.programCount.toLocaleString()} programs.
          Sign up to browse and filter all programs.
        </p>
        {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

        {/* Providers in this category */}
        <h2 style={sectionTitle}>Providers Offering {category.name}</h2>
        <div style={cardGrid(isDesktop)}>
          {(() => {
            const catProviders = data.providers
              .filter(p => p.categories.includes(category.name))
              .slice(0, 12);
            return catProviders.map((p) => (
              <Link key={p.slug} to={`/camps/provider/${p.slug}`} style={card}>
                <div style={cardTitle}>{p.name}</div>
                <div style={cardMeta}>{p.programCount} programs</div>
              </Link>
            ));
          })()}
        </div>

        {/* Areas with this category */}
        <h2 style={sectionTitle}>Areas with {category.name} Programs</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {category.cities.map((city) => {
            const area = data.areas.find(a => a.name === city);
            return area ? (
              <Link key={city} to={`/camps/area/${area.slug}`} style={{ ...pillStyle, textDecoration: "none" }}>
                {city}
              </Link>
            ) : (
              <span key={city} style={pillStyle}>{city}</span>
            );
          })}
        </div>

        <CTASection isDesktop={isDesktop} />
      </div>

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── Page: Area Detail (/camps/area/:slug) ──

function AreaPage({ data, slug, isDesktop, onNavigate }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const area = useMemo(() => {
    if (!data) return null;
    return data.areas.find((a) => a.slug === slug);
  }, [data, slug]);

  usePageMeta({
    title: area ? `Kids Camps & Programs in ${area.name} | Skeddo` : undefined,
    description: area ? `Browse ${area.programCount.toLocaleString()} kids programs in ${area.name}. Find camps, classes, and activities from ${area.providers.length} local providers.` : undefined,
    canonical: area ? `https://skeddo.ca/camps/area/${slug}` : undefined,
  });

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!area) return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={breadcrumb}>
            <Link to="/camps" style={breadcrumbLink}>Camps</Link>
            {" / "}
            <span style={{ color: "#fff" }}>{area.name}</span>
          </div>
          <h1 style={heroTitle(isDesktop)}>
            Kids Camps &amp; Programs in {area.name}
          </h1>
          <p style={heroSub}>
            Browse {area.programCount.toLocaleString()} camps and activities for kids
            in {area.name} from {area.providers.length} local providers.
          </p>
          <StatsRow items={[
            ["Programs", area.programCount.toLocaleString()],
            ["Providers", `${area.providers.length}`],
            ["Neighbourhoods", `${area.neighbourhoods.length}`],
          ]} isDesktop={isDesktop} />
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Neighbourhoods */}
        {area.neighbourhoods.length > 0 && (
          <>
            <h2 style={sectionTitle}>Neighbourhoods in {area.name}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {area.neighbourhoods.sort().map((n) => (
                <span key={n} style={pillStyle}>{n}</span>
              ))}
            </div>
          </>
        )}

        {/* Categories in this area */}
        <h2 style={sectionTitle}>Categories in {area.name}</h2>
        <div style={cardGrid(isDesktop)}>
          {area.categories.slice(0, 12).map((cat) => {
            const catObj = data.categories.find(c => c.name === cat);
            return catObj ? (
              <Link key={cat} to={`/camps/category/${catObj.slug}`} style={card}>
                <div style={cardTitle}>{cat}</div>
                <div style={cardMeta}>{catObj.programCount.toLocaleString()} programs total</div>
              </Link>
            ) : (
              <div key={cat} style={card}>
                <div style={cardTitle}>{cat}</div>
              </div>
            );
          })}
        </div>

        {/* Sample programs */}
        <h2 style={sectionTitle}>Sample Programs in {area.name}</h2>
        <ProgramTable programs={area.samplePrograms} isDesktop={isDesktop} showProvider={true} onSelectProgram={setSelectedProgram} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {area.samplePrograms.length} of {area.programCount.toLocaleString()} programs.
          Sign up to browse and filter all programs.
        </p>
        {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

        {/* Providers */}
        <h2 style={sectionTitle}>Providers in {area.name}</h2>
        <div style={cardGrid(isDesktop)}>
          {(() => {
            const areaProviders = data.providers
              .filter(p => p.cities.includes(area.name))
              .slice(0, 18);
            return areaProviders.map((p) => (
              <Link key={p.slug} to={`/camps/provider/${p.slug}`} style={card}>
                <div style={cardTitle}>{p.name}</div>
                <div style={cardMeta}>
                  {p.programCount} programs · {p.categories.slice(0, 2).join(", ")}
                </div>
              </Link>
            ));
          })()}
        </div>

        <CTASection isDesktop={isDesktop} />
      </div>

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── Page: Provider Detail (/camps/provider/:slug) ──

function ProviderPage({ data, slug, isDesktop, onNavigate }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const provider = useMemo(() => {
    if (!data) return null;
    return data.providers.find((p) => p.slug === slug);
  }, [data, slug]);

  const cityStr = provider?.cities?.length > 0 ? ` in ${provider.cities[0]}` : "";
  usePageMeta({
    title: provider ? `${provider.name} -- Kids Camps & Programs${cityStr} | Skeddo` : undefined,
    description: provider ? `Browse ${provider.programCount.toLocaleString()} kids programs from ${provider.name}${cityStr}. See schedules, prices, and ages.` : undefined,
    canonical: provider ? `https://skeddo.ca/camps/provider/${slug}` : undefined,
  });

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!provider) return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={breadcrumb}>
            <Link to="/camps" style={breadcrumbLink}>Camps</Link>
            {" / "}
            <span style={{ color: "#fff" }}>{provider.name}</span>
          </div>
          <h1 style={heroTitle(isDesktop)}>{provider.name}</h1>
          <p style={heroSub}>
            {provider.programCount.toLocaleString()} kids camps and programs
            {provider.cities.length > 0 ? ` in ${provider.cities.join(", ")}` : ""}.
            {provider.categories.length > 0 ? ` Categories: ${provider.categories.slice(0, 4).join(", ")}.` : ""}
          </p>
          <StatsRow items={[
            ["Programs", provider.programCount.toLocaleString()],
            ["Categories", `${provider.categories.length}`],
            ...(provider.cities.length > 0 ? [["Locations", `${provider.cities.length}`]] : []),
          ]} isDesktop={isDesktop} />
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Quick facts */}
        <h2 style={sectionTitle}>At a Glance</h2>
        <div style={{ ...cardGrid(isDesktop), gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)" }}>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Ages</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.ageMin != null ? `${provider.ageMin}–${provider.ageMax}` : "Various"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Price Range</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.costMin != null ? `$${provider.costMin}–$${provider.costMax}` : "Varies"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Locations</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.cities.length > 0 ? provider.cities.join(", ") : "Various"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Neighbourhoods</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.neighbourhoods.length || "—"}
            </div>
          </div>
        </div>

        {/* Categories */}
        <h2 style={sectionTitle}>Program Categories</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {provider.categories.map((cat) => {
            const catObj = data.categories.find(c => c.name === cat);
            return catObj ? (
              <Link key={cat} to={`/camps/category/${catObj.slug}`} style={{ ...pillStyle, textDecoration: "none" }}>
                {cat}
              </Link>
            ) : (
              <span key={cat} style={pillStyle}>{cat}</span>
            );
          })}
        </div>

        {/* Neighbourhoods */}
        {provider.neighbourhoods.length > 0 && (
          <>
            <h2 style={sectionTitle}>Neighbourhoods</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {provider.neighbourhoods.sort().map((n) => (
                <span key={n} style={pillStyle}>{n}</span>
              ))}
            </div>
          </>
        )}

        {/* Sample programs */}
        <h2 style={sectionTitle}>Sample Programs</h2>
        <ProgramTable programs={provider.samplePrograms} isDesktop={isDesktop} showProvider={false} onSelectProgram={setSelectedProgram} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {provider.samplePrograms.length} of {provider.programCount.toLocaleString()} programs.
          Sign up to browse and filter all {provider.name} programs.
        </p>
        {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

        {/* Areas */}
        {provider.cities.length > 0 && (
          <>
            <h2 style={sectionTitle}>Available In</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {provider.cities.map((city) => {
                const area = data.areas.find(a => a.name === city);
                return area ? (
                  <Link key={city} to={`/camps/area/${area.slug}`} style={{ ...pillStyle, textDecoration: "none" }}>
                    {city}
                  </Link>
                ) : (
                  <span key={city} style={pillStyle}>{city}</span>
                );
              })}
            </div>
          </>
        )}

        <CTASection isDesktop={isDesktop} />
      </div>

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── 404 ──

function NotFound({ isDesktop, onNavigate }) {
  useEffect(() => {
    document.title = "Page Not Found | Skeddo";
  }, []);

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />
      <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
        <h1 style={{ fontFamily: headFont, fontSize: 28, color: C.ink, marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: 16, color: "#4A6FA5", lineHeight: 1.6, marginBottom: 24 }}>
          We couldn't find that page. Try browsing our camp directory instead.
        </p>
        <Link to="/camps" style={{
          display: "inline-block",
          fontFamily: font,
          fontSize: 16,
          fontWeight: 700,
          color: "#fff",
          background: C.seaGreen,
          borderRadius: 10,
          padding: "14px 32px",
          textDecoration: "none",
        }}>
          Browse Camps
        </Link>
      </div>
      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

/** Read-only program detail for unauthenticated users */
function PublicProgramDetail({ program, onClose, onNavigate }) {
  const p = program;
  const fmtDollars = (v) => v != null ? `$${Number(v).toLocaleString()}` : null;

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(27,36,50,0.4)", zIndex: 200,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "fadeBg 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0",
        padding: "24px 20px 32px", width: "100%", maxWidth: 600,
        maxHeight: "88vh", overflowY: "auto",
        animation: "slideIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1)",
        position: "relative",
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: 16, right: 16, background: "none",
          border: "none", fontSize: 22, color: "#4A6FA5", cursor: "pointer",
          padding: 8, minWidth: 40, minHeight: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 8, lineHeight: 1, zIndex: 1,
        }}>&times;</button>

        {/* Category */}
        <div style={{
          fontFamily: font, fontSize: 11, fontWeight: 700,
          color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2,
        }}>
          {p.category}
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: headFont, fontSize: 22, color: C.ink,
          lineHeight: 1.2, marginBottom: 4, paddingRight: 40,
        }}>
          {p.name}
        </h3>

        {/* Provider */}
        <div style={{ fontFamily: font, fontSize: 14, color: "#4A6FA5", marginBottom: 16 }}>
          {p.provider}
        </div>

        {/* Description */}
        {p.description && (
          <p style={{ fontFamily: font, fontSize: 14, color: C.ink, lineHeight: 1.7, marginBottom: 16 }}>
            {p.description}
          </p>
        )}

        {/* Details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {fmtDollars(p.cost) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Price</div>
              <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: C.ink, marginTop: 2 }}>{fmtDollars(p.cost)}</div>
              {p.costNote && <div style={{ fontSize: 12, color: "#4A6FA5" }}>{p.costNote}</div>}
            </div>
          )}
          {(p.ageMin != null || p.ageMax != null) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Ages</div>
              <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: C.ink, marginTop: 2 }}>{p.ageMin}\u2013{p.ageMax} years</div>
            </div>
          )}
          {p.days && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Days</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>{p.days}</div>
            </div>
          )}
          {(p.startTime || p.endTime) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Time</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>{p.startTime}\u2013{p.endTime}</div>
            </div>
          )}
          {p.startDate && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Dates</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>
                {p.startDate}{p.endDate ? ` \u2013 ${p.endDate}` : ""}
              </div>
            </div>
          )}
          {(p.neighbourhood || p.city) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Area</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>
                {p.neighbourhood || p.city}
              </div>
            </div>
          )}
        </div>

        {/* Registration link */}
        {p.registrationUrl && (
          <a
            href={p.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", textAlign: "center",
              fontFamily: font, fontSize: 15, fontWeight: 700,
              color: "#fff", background: C.seaGreen, border: "none",
              borderRadius: 10, padding: "14px 16px",
              textDecoration: "none", marginBottom: 10,
            }}
          >
            View Registration Page
          </a>
        )}

        {/* Sign up CTA */}
        <div style={{
          background: `${C.seaGreen}08`, borderRadius: 12,
          padding: "14px 16px", textAlign: "center",
          border: `1px solid ${C.seaGreen}20`,
        }}>
          <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 6 }}>
            Save this to your planner
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: "#4A6FA5", marginBottom: 10 }}>
            Track registrations, compare costs, and coordinate with your family.
          </div>
          <button
            onClick={() => { onClose(); onNavigate("signup"); }}
            style={{
              fontFamily: font, fontSize: 14, fontWeight: 700,
              color: C.seaGreen, background: "none",
              border: `1.5px solid ${C.seaGreen}`, borderRadius: 8,
              padding: "8px 20px", cursor: "pointer",
            }}
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Router Component ──

export default function DirectoryPage({ onNavigate }) {
  const data = useDirectoryData();
  const isDesktop = useIsDesktop();
  const params = useParams();

  // Determine which sub-page based on URL params
  const { type, slug } = params;

  if (!type) {
    return <DirectoryHome data={data} isDesktop={isDesktop} onNavigate={onNavigate} />;
  }

  switch (type) {
    case "category":
      return <CategoryPage data={data} slug={slug} isDesktop={isDesktop} onNavigate={onNavigate} />;
    case "area":
      return <AreaPage data={data} slug={slug} isDesktop={isDesktop} onNavigate={onNavigate} />;
    case "provider":
      return <ProviderPage data={data} slug={slug} isDesktop={isDesktop} onNavigate={onNavigate} />;
    default:
      return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;
  }
}
