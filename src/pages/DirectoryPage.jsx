import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { C } from "../constants/brand";
import useIsDesktop from "../hooks/useIsDesktop";

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

function ProgramTable({ programs, isDesktop, showProvider = true }) {
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
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: "10px 12px", color: C.ink, fontWeight: 600 }}>{p.name}</td>
              {showProvider && <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>{p.provider}</td>}
              <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                {p.ageMin != null ? `${p.ageMin}–${p.ageMax}` : "—"}
              </td>
              <td style={{ padding: "10px 12px", color: C.ink }}>
                {p.cost != null ? `$${p.cost}` : "See provider"}
              </td>
              {isDesktop && (
                <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                  {p.dayLength || "—"}
                </td>
              )}
              {isDesktop && (
                <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                  {p.neighbourhood || p.city || "—"}
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
  // Merge similar categories for display
  const topCategories = useMemo(() => {
    if (!data) return [];
    const merged = {};
    for (const c of data.categories) {
      // Normalize category names for display grouping
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

  const topAreas = useMemo(() => {
    if (!data) return [];
    return data.areas.filter(a => a.programCount >= 20).slice(0, 12);
  }, [data]);

  const topProviders = useMemo(() => {
    if (!data) return [];
    return data.providers.filter(p => p.programCount >= 10).slice(0, 18);
  }, [data]);

  useEffect(() => {
    document.title = "Browse Kids Camps & Programs in Vancouver | Skeddo";
  }, []);

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      {/* Hero */}
      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={heroTitle(isDesktop)}>
            Browse {data.totalPrograms.toLocaleString()}+ Kids Camps &amp; Programs
          </h1>
          <p style={heroSub}>
            Find summer camps, classes, and activities for kids across Vancouver and the Lower Mainland.
            Filter by age, category, neighbourhood, and price — all from {data.totalProviders}+ local providers.
          </p>
          <StatsRow items={[
            ["Programs", `${data.totalPrograms.toLocaleString()}+`],
            ["Providers", `${data.totalProviders}+`],
            ["Areas", `${data.totalAreas}`],
          ]} isDesktop={isDesktop} />
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Categories */}
        <h2 style={sectionTitle}>Browse by Category</h2>
        <div style={cardGrid(isDesktop)}>
          {topCategories.map((c) => (
            <Link key={c.slug} to={`/camps/category/${c.slug}`} style={card}>
              <div style={cardTitle}>{c.name}</div>
              <div style={cardMeta}>
                {c.programCount.toLocaleString()} programs · {c.providers.length} providers
              </div>
            </Link>
          ))}
        </div>

        {/* Areas */}
        <h2 style={sectionTitle}>Browse by Area</h2>
        <div style={cardGrid(isDesktop)}>
          {topAreas.map((a) => (
            <Link key={a.slug} to={`/camps/area/${a.slug}`} style={card}>
              <div style={cardTitle}>{a.name}</div>
              <div style={cardMeta}>
                {a.programCount.toLocaleString()} programs · {a.providers.length} providers
              </div>
              {a.neighbourhoods.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {a.neighbourhoods.slice(0, 4).map((n) => (
                    <span key={n} style={pillStyle}>{n}</span>
                  ))}
                  {a.neighbourhoods.length > 4 && (
                    <span style={{ ...pillStyle, background: "rgba(27,36,50,0.06)", color: C.ink }}>
                      +{a.neighbourhoods.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Providers */}
        <h2 style={sectionTitle}>Popular Providers</h2>
        <div style={cardGrid(isDesktop)}>
          {topProviders.map((p) => (
            <Link key={p.slug} to={`/camps/provider/${p.slug}`} style={card}>
              <div style={cardTitle}>{p.name}</div>
              <div style={cardMeta}>
                {p.programCount.toLocaleString()} programs
                {p.cities.length > 0 && ` · ${p.cities.slice(0, 2).join(", ")}`}
              </div>
              <div style={{ marginTop: 4 }}>
                {p.categories.slice(0, 3).map((cat) => (
                  <span key={cat} style={pillStyle}>{cat}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* SEO content */}
        <div style={{ marginTop: 40, background: C.white, borderRadius: 14, padding: isDesktop ? "28px 32px" : "20px", boxShadow: "0 2px 8px rgba(27,36,50,0.07)" }}>
          <h2 style={{ ...sectionTitle, marginTop: 0 }}>About the Skeddo Camp Directory</h2>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.7, marginBottom: 12 }}>
            Skeddo is the most comprehensive directory of kids camps and programs in Vancouver and the Lower Mainland.
            We list activities from {data.totalProviders}+ providers including community centres, private camps, arts organizations, and sports clubs.
          </p>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.7, marginBottom: 12 }}>
            Whether you're looking for summer camps, spring break programs, after-school activities, or weekend classes,
            Skeddo makes it easy to find the right fit for your family. Filter by your child's age, your neighbourhood,
            activity type, budget, and schedule.
          </p>
          <p style={{ fontSize: 15, color: "#4A6FA5", lineHeight: 1.7 }}>
            All program data is sourced directly from provider websites and verified regularly. Skeddo is free for families.
          </p>
        </div>

        <CTASection isDesktop={isDesktop} />
      </div>

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── Page: Category Detail (/camps/category/:slug) ──

function CategoryPage({ data, slug, isDesktop, onNavigate }) {
  const category = useMemo(() => {
    if (!data) return null;
    return data.categories.find((c) => c.slug === slug);
  }, [data, slug]);

  useEffect(() => {
    if (category) {
      document.title = `${category.name} Camps & Programs for Kids in Vancouver | Skeddo`;
    }
  }, [category]);

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
        <ProgramTable programs={category.samplePrograms} isDesktop={isDesktop} showProvider={true} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {category.samplePrograms.length} of {category.programCount.toLocaleString()} programs.
          Sign up to browse and filter all programs.
        </p>

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
  const area = useMemo(() => {
    if (!data) return null;
    return data.areas.find((a) => a.slug === slug);
  }, [data, slug]);

  useEffect(() => {
    if (area) {
      document.title = `Kids Camps & Programs in ${area.name} | Skeddo`;
    }
  }, [area]);

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
        <ProgramTable programs={area.samplePrograms} isDesktop={isDesktop} showProvider={true} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {area.samplePrograms.length} of {area.programCount.toLocaleString()} programs.
          Sign up to browse and filter all programs.
        </p>

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
  const provider = useMemo(() => {
    if (!data) return null;
    return data.providers.find((p) => p.slug === slug);
  }, [data, slug]);

  useEffect(() => {
    if (provider) {
      const cityStr = provider.cities.length > 0 ? ` in ${provider.cities[0]}` : "";
      document.title = `${provider.name} — Kids Camps & Programs${cityStr} | Skeddo`;
    }
  }, [provider]);

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
        <ProgramTable programs={provider.samplePrograms} isDesktop={isDesktop} showProvider={false} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {provider.samplePrograms.length} of {provider.programCount.toLocaleString()} programs.
          Sign up to browse and filter all {provider.name} programs.
        </p>

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
