import { C } from "../constants/brand";
import { s } from "../styles/shared";

const PAGES = {
  about: {
    title: "About Skeddo",
    content: () => (
      <>
        <Section title="Our Mission">
          <p>Skeddo was built by parents, for parents. We know the chaos of summer planning — juggling camp registrations, waitlists, schedules, and budgets across dozens of browser tabs and spreadsheets.</p>
          <p>We built Skeddo to put everything in one place so you can spend less time planning and more time enjoying the summer with your kids.</p>
        </Section>
        <Section title="Who We Are">
          <p>Skeddo is made by <strong>Mended with Gold Inc.</strong>, a small company based in Vancouver, BC. We're two co-founders with a simple belief: parents deserve better tools.</p>
          <p>We're not backed by venture capital or big tech. We're just parents who got tired of the spreadsheet life and decided to build something better.</p>
        </Section>
        <Section title="What Makes Us Different">
          <BulletList items={[
            "Real, verified program data from providers across Vancouver",
            "Built for parents — not schools, not providers, not advertisers",
            "Your data stays yours. We don't sell it, share it, or use it for ads",
            "Free to use. No hidden costs to get started",
          ]} />
        </Section>
      </>
    ),
  },
  how: {
    title: "How It Works",
    content: () => (
      <>
        <Section title="1. Add Your Kids">
          <p>Start by adding your children with their names and ages. This helps Skeddo show you age-appropriate programs and keep everything organized per kid.</p>
        </Section>
        <Section title="2. Discover Programs">
          <p>Browse thousands of real summer camps, classes, and activities from providers across Vancouver. Filter by age, category, neighbourhood, schedule, and more.</p>
        </Section>
        <Section title="3. Track Everything">
          <p>Save programs you're interested in and track their status — Exploring, Waitlisted, or Enrolled. Skeddo keeps your whole summer plan in one view.</p>
        </Section>
        <Section title="4. Stay on Budget">
          <p>Set a budget goal and watch your spending across all kids and programs. Skeddo tracks costs automatically so there are no surprises.</p>
        </Section>
        <Section title="5. Never Miss a Date">
          <p>Skeddo alerts you when programs are starting soon, so you're always prepared. View your family's schedule on the built-in weekly calendar.</p>
        </Section>
      </>
    ),
  },
  faq: {
    title: "Help & FAQ",
    content: () => (
      <>
        <FAQ q="Is Skeddo free?" a="Yes! Skeddo is free to use. We may introduce optional premium features in the future, but the core planning tools will always be free." />
        <FAQ q="How do I add a program to my list?" a="Go to the Discover tab, find a program you like, and tap it. From the detail view, you can save it to your list and set its status (Exploring, Waitlist, or Enrolled)." />
        <FAQ q="Can I use Skeddo for multiple kids?" a="Absolutely. Add as many kids as you need from the Home tab. You can assign programs to specific kids and filter views per child." />
        <FAQ q="Where does the program data come from?" a="We source program information directly from provider websites and registration systems across Vancouver. We verify details regularly, but always confirm with the provider before registering." />
        <FAQ q="Can I install Skeddo on my phone?" a="Yes! Skeddo is a web app that works like a native app. On your phone, tap 'Add to Home Screen' from your browser menu to install it." />
        <FAQ q="Is my data safe?" a="Your data is stored securely with Supabase (built on PostgreSQL with row-level security). We never sell or share your personal information." />
        <FAQ q="How do I delete my account?" a="Contact us at skeddo.planner@gmail.com and we'll take care of it. We'll delete all your data within 48 hours." />
        <FAQ q="I found incorrect program information. What should I do?" a="Please let us know! Email skeddo.planner@gmail.com with the program name and what needs updating. We appreciate the help keeping our data accurate." />
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    content: () => (
      <>
        <p style={{ ...bodyStyle, marginBottom: 16, fontStyle: "italic", color: C.muted }}>Last updated: March 2026</p>
        <Section title="What We Collect">
          <BulletList items={[
            "Account info: your email, display name, and postal code",
            "Your kids' names and ages (to personalize your experience)",
            "Programs you save, track, and organize",
            "Basic usage data via Google Analytics (page views, not personal data)",
          ]} />
        </Section>
        <Section title="What We Don't Do">
          <BulletList items={[
            "We never sell your data to anyone",
            "We never share your personal info with third parties for marketing",
            "We don't use your data to serve ads",
            "We don't track you across other websites",
          ]} />
        </Section>
        <Section title="How We Use Your Data">
          <p>Your data is used solely to power your Skeddo experience — showing relevant programs, tracking your budget, and keeping your family's schedule organized.</p>
        </Section>
        <Section title="Data Storage">
          <p>Your data is stored securely using Supabase, which runs on PostgreSQL with row-level security. Your data is encrypted in transit and at rest. Our servers are hosted in North America.</p>
        </Section>
        <Section title="Your Rights">
          <p>You can request a copy of your data or ask us to delete your account at any time by emailing skeddo.planner@gmail.com. We'll respond within 48 hours.</p>
        </Section>
        <Section title="Cookies">
          <p>We use minimal cookies for authentication (keeping you signed in) and basic analytics. We don't use tracking cookies or advertising cookies.</p>
        </Section>
        <Section title="Contact">
          <p>Questions about privacy? Email us at <strong>skeddo.planner@gmail.com</strong>.</p>
        </Section>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    content: () => (
      <>
        <p style={{ ...bodyStyle, marginBottom: 16, fontStyle: "italic", color: C.muted }}>Last updated: March 2026</p>
        <Section title="Agreement">
          <p>By using Skeddo, you agree to these terms. Skeddo is operated by Mended with Gold Inc., registered in British Columbia, Canada.</p>
        </Section>
        <Section title="Your Account">
          <p>You're responsible for keeping your login credentials safe. You must be 18 or older to create an account. One account per person, please.</p>
        </Section>
        <Section title="What Skeddo Provides">
          <p>Skeddo is a planning tool. We display program information sourced from third-party providers. While we work hard to keep this information accurate, we can't guarantee it. Always verify details directly with the program provider before registering or paying.</p>
        </Section>
        <Section title="Your Content">
          <p>The data you enter (kids, programs, notes) belongs to you. We don't claim any ownership over your content. You can request deletion at any time.</p>
        </Section>
        <Section title="Acceptable Use">
          <p>Don't use Skeddo for anything illegal, harmful, or to misrepresent yourself. Don't attempt to access other users' data or disrupt the service.</p>
        </Section>
        <Section title="Limitation of Liability">
          <p>Skeddo is provided "as is." We're not liable for any losses arising from your use of the app, including reliance on program information displayed. Our total liability is limited to the amount you've paid us (which is currently $0).</p>
        </Section>
        <Section title="Changes">
          <p>We may update these terms from time to time. Continued use of Skeddo after changes means you accept the new terms.</p>
        </Section>
        <Section title="Governing Law">
          <p>These terms are governed by the laws of British Columbia, Canada.</p>
        </Section>
        <Section title="Contact">
          <p>Questions? Email <strong>skeddo.planner@gmail.com</strong>.</p>
        </Section>
      </>
    ),
  },
  contact: {
    title: "Contact Us",
    content: () => (
      <>
        <Section title="Get in Touch">
          <p>We'd love to hear from you — whether it's a bug report, a feature idea, a data correction, or just to say hi.</p>
        </Section>
        <Section title="Email">
          <p><strong>skeddo.planner@gmail.com</strong></p>
          <p>We aim to respond within 24 hours on weekdays.</p>
        </Section>
        <Section title="Follow Us">
          <p>Find us on Instagram at <strong>@skeddo.app</strong> for tips, camp recommendations, and updates.</p>
        </Section>
        <Section title="Report a Problem">
          <p>Found incorrect program info? A bug in the app? Let us know and we'll fix it fast. Include as much detail as you can — screenshots help!</p>
        </Section>
        <Section title="Business Inquiries">
          <p>If you're a program provider and want to update your listing or partner with Skeddo, reach out at skeddo.planner@gmail.com.</p>
        </Section>
      </>
    ),
  },
};

const bodyStyle = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 14,
  color: C.ink,
  lineHeight: 1.7,
  margin: "0 0 12px",
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: 16,
        fontWeight: 700,
        color: C.ink,
        marginBottom: 8,
      }}>
        {title}
      </h3>
      <div style={bodyStyle}>{children}</div>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ ...bodyStyle, paddingLeft: 20, margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  );
}

function FAQ({ q, a }) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 10,
    }}>
      <div style={{
        fontFamily: "'Barlow', sans-serif",
        fontSize: 14,
        fontWeight: 700,
        color: C.ink,
        marginBottom: 6,
      }}>
        {q}
      </div>
      <div style={bodyStyle}>{a}</div>
    </div>
  );
}

export default function InfoPage({ pageId, onBack }) {
  const page = PAGES[pageId];
  if (!page) return null;

  return (
    <div style={{ ...s.app, paddingBottom: 0 }}>
      {/* Header bar */}
      <div style={{
        background: C.white,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            color: C.ink,
            padding: "4px 8px",
            lineHeight: 1,
          }}
          aria-label="Go back"
        >
          &larr;
        </button>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: C.ink,
          margin: 0,
        }}>
          {page.title}
        </h1>
      </div>
      {/* Content */}
      <div style={{ padding: "20px 20px 40px" }}>
        {page.content()}
      </div>
    </div>
  );
}
