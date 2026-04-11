import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import useIsDesktop from "../hooks/useIsDesktop";
import { BLOG_POSTS, getBlogPost } from "../data/blog-posts";

/* ── Shared styles ── */
const h1Style = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 32,
  fontWeight: 800,
  color: C.ink,
  lineHeight: 1.2,
  marginBottom: 8,
};

const h2Style = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 22,
  fontWeight: 700,
  color: C.ink,
  marginBottom: 12,
  marginTop: 32,
};

const h3Style = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 17,
  fontWeight: 700,
  color: C.ink,
  marginBottom: 8,
  marginTop: 24,
};

const bodyStyle = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 16,
  color: C.ink,
  lineHeight: 1.75,
  margin: "0 0 16px",
};

const subtitleStyle = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 18,
  color: C.muted,
  lineHeight: 1.6,
  marginBottom: 24,
};

/* ── Reusable components ── */
function SiteHeader({ onNavigate }) {
  const isDesktop = useIsDesktop();
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: C.white,
      borderBottom: `0.5px solid rgba(27,36,50,0.08)`,
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
          style={{ height: 34, width: "auto", borderRadius: 8 }}
        />
      </Link>
      <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link to="/camps" style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: C.ink,
          textDecoration: "none",
          padding: "8px 12px",
        }}>
          Browse Camps
        </Link>
        <Link to="/blog" style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: C.ink,
          textDecoration: "none",
          padding: "8px 12px",
        }}>
          Guides
        </Link>
        <a
          href="/signup"
          onClick={(e) => { e.preventDefault(); onNavigate("signup"); }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: C.seaGreen,
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
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

function CTABox() {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.seaGreen}12, ${C.blue}12)`,
      border: `1.5px solid ${C.seaGreen}30`,
      borderRadius: 16,
      padding: "28px 24px",
      textAlign: "center",
      margin: "40px 0",
    }}>
      <h3 style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: 20,
        fontWeight: 700,
        color: C.ink,
        marginBottom: 8,
      }}>
        Ready to Start Planning?
      </h3>
      <p style={{ ...bodyStyle, color: C.muted, marginBottom: 16 }}>
        Browse programs, compare costs, and build your family's schedule — all in one free app.
      </p>
      <Link
        to="/signup"
        style={{
          ...s.primaryBtn,
          display: "inline-block",
          padding: "12px 32px",
          fontSize: 15,
          borderRadius: 10,
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        Get Started Free
      </Link>
    </div>
  );
}

function InternalLink({ to, children }) {
  return (
    <Link to={to} style={{
      color: C.seaGreen,
      fontWeight: 600,
      textDecoration: "none",
    }}>
      {children}
    </Link>
  );
}

function Stat({ number, label }) {
  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      padding: "20px 16px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
      flex: "1 1 140px",
    }}>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: 28,
        fontWeight: 800,
        color: C.seaGreen,
        lineHeight: 1.1,
      }}>
        {number}
      </div>
      <div style={{
        fontFamily: "'Barlow', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        color: C.muted,
        marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  );
}

function BlogFooter() {
  return (
    <footer style={{
      textAlign: "center",
      fontSize: 12,
      color: C.muted,
      padding: "32px 24px",
      fontFamily: "'Barlow', sans-serif",
    }}>
      <nav style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 10, flexWrap: "wrap" }}>
        <Link to="/camps" style={{ color: C.muted, textDecoration: "none", fontWeight: 600 }}>Browse Camps</Link>
        <Link to="/blog" style={{ color: C.muted, textDecoration: "none", fontWeight: 600 }}>Guides</Link>
        <Link to="/about" style={{ color: C.muted, textDecoration: "none", fontWeight: 600 }}>About</Link>
        <Link to="/privacy" style={{ color: C.muted, textDecoration: "none", fontWeight: 600 }}>Privacy & Terms</Link>
        <Link to="/help" style={{ color: C.muted, textDecoration: "none", fontWeight: 600 }}>Help & Contact</Link>
      </nav>
      <p>Made by Mended with Gold Inc. · Vancouver, BC</p>
    </footer>
  );
}

/* ── Blog Index ── */
function BlogIndex({ onNavigate }) {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    document.title = "Vancouver Camp Guides & Tips for Parents | Skeddo";
  }, []);

  const publishedPosts = BLOG_POSTS.filter(p => p.published);

  return (
    <div style={{ background: C.cream, minHeight: "100dvh" }}>
      <SiteHeader onNavigate={onNavigate} />
      <main style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: isDesktop ? "48px 32px 60px" : "32px 20px 60px",
        fontFamily: "'Barlow', sans-serif",
      }}>
        <h1 style={{ ...h1Style, textAlign: "center", marginBottom: 12 }}>
          Guides for Vancouver Parents
        </h1>
        <p style={{ ...subtitleStyle, textAlign: "center", maxWidth: 560, margin: "0 auto 40px" }}>
          Planning tips, camp guides, and cost breakdowns to help you navigate kids' activities in Vancouver and the Lower Mainland.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap: 20,
        }}>
          {publishedPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "24px 20px",
                boxShadow: "0 2px 12px rgba(27,36,50,0.08)",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(27,36,50,0.14)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(27,36,50,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: 28 }}>{post.icon}</span>
              <h2 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.ink,
                lineHeight: 1.3,
                margin: 0,
              }}>
                {post.title}
              </h2>
              <p style={{
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {post.excerpt}
              </p>
              <div style={{
                display: "flex",
                gap: 12,
                fontSize: 12,
                color: C.muted,
                fontWeight: 600,
                marginTop: 4,
              }}>
                <span>{post.readTime}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}

/* ── Blog Post ── */
function BlogPost({ onNavigate }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [stats, setStats] = useState(null);

  const post = getBlogPost(slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.seoTitle} | Skeddo`;
    }
    window.scrollTo(0, 0);
  }, [post]);

  useEffect(() => {
    import("../data/blog-stats.json").then((m) => setStats(m.default));
  }, []);

  if (!post) {
    return (
      <div style={{ background: C.cream, minHeight: "100dvh" }}>
        <SiteHeader onNavigate={onNavigate} />
        <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "'Barlow', sans-serif" }}>
          <h1 style={h1Style}>Page Not Found</h1>
          <p style={bodyStyle}>This guide doesn't exist.</p>
          <Link to="/blog" style={{ color: C.seaGreen, fontWeight: 600 }}>Back to Guides</Link>
        </div>
      </div>
    );
  }

  const ctx = { stats, InternalLink, CTABox, Stat, h2Style, h3Style, bodyStyle };

  return (
    <div style={{ background: C.cream, minHeight: "100dvh" }}>
      <SiteHeader onNavigate={onNavigate} />

      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.seoTitle,
            description: post.seoDescription,
            datePublished: post.dateISO,
            dateModified: post.dateISO,
            author: {
              "@type": "Organization",
              name: "Skeddo",
              url: "https://skeddo.ca",
            },
            publisher: {
              "@type": "Organization",
              name: "Skeddo",
              logo: { "@type": "ImageObject", url: "https://skeddo.ca/skeddo-logo-dark.png" },
            },
            mainEntityOfPage: `https://skeddo.ca/blog/${post.slug}`,
          }),
        }}
      />

      <main style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: isDesktop ? "48px 32px 60px" : "24px 20px 60px",
        fontFamily: "'Barlow', sans-serif",
      }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: C.muted, marginBottom: 20, fontWeight: 500 }}>
          <Link to="/" style={{ color: C.muted, textDecoration: "none" }}>Home</Link>
          {" / "}
          <Link to="/blog" style={{ color: C.muted, textDecoration: "none" }}>Guides</Link>
          {" / "}
          <span style={{ color: C.ink }}>{post.breadcrumb || post.title}</span>
        </nav>

        <h1 style={{ ...h1Style, fontSize: isDesktop ? 36 : 28 }}>{post.title}</h1>
        <p style={subtitleStyle}>{post.subtitle}</p>

        <div style={{ display: "flex", gap: 16, fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 32 }}>
          <span>{post.readTime}</span>
          <span>·</span>
          <span>Updated {post.date}</span>
        </div>

        {/* Render post content */}
        <article>
          {post.content(ctx)}
        </article>

        <CTABox />

        {/* Related posts */}
        {post.related && post.related.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ ...h2Style, marginTop: 0 }}>Related Guides</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {post.related.map((relSlug) => {
                const rel = getBlogPost(relSlug);
                if (!rel) return null;
                return (
                  <Link
                    key={relSlug}
                    to={`/blog/${relSlug}`}
                    style={{
                      background: C.white,
                      borderRadius: 12,
                      padding: "16px 18px",
                      boxShadow: "0 2px 8px rgba(27,36,50,0.06)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{rel.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{rel.title}</div>
                      <div style={{ fontSize: 13, color: C.muted }}>{rel.readTime}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <BlogFooter />
    </div>
  );
}

/* ── Exported page — determines index vs post from URL ── */
export default function BlogPage({ onNavigate }) {
  const { slug } = useParams();

  if (slug) {
    return <BlogPost onNavigate={onNavigate} />;
  }
  return <BlogIndex onNavigate={onNavigate} />;
}
