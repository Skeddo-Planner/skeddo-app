import { Link } from "react-router-dom";

/**
 * Blog/Guides posts for Skeddo.
 * Each post is data-driven and renders as React components.
 */

export const BLOG_POSTS = [
  {
    slug: "first-time-camp-registration-guide",
    title: "First Time Registering for Summer Camp?",
    breadcrumb: "First-Time Registration Guide",
    subtitle: "We got you. A step-by-step guide for the parent who's never done this before.",
    excerpt: "A step-by-step guide for first-time camp parents — from checking registration dates to building your summer schedule.",
    seoTitle: "First Time Registering for Summer Camp? A Parent's Step-by-Step Guide",
    seoDescription: "New to summer camp registration? This step-by-step guide helps first-time parents navigate dates, budgets, logistics, and late registration — from a Vancouver parent who gets it.",
    icon: "\u{1F3D5}\uFE0F",
    readTime: "7 min read",
    date: "April 2026",
    dateISO: "2026-04-13",
    published: true,
    related: [],
    content: ({ InternalLink, CTABox, h2Style, h3Style, bodyStyle }) => (
      <>
        <p style={bodyStyle}>
          You open a camp registration page. There are seventeen tabs, a waitlist for something called "Multi-Sport AM Extended," and a checkout timer that's already counting down. You haven't even made coffee yet.
        </p>
        <p style={bodyStyle}>
          Sound familiar? You're not alone. Thousands of Vancouver parents go through this every spring, and the ones who look like they have it figured out? They were exactly where you are last year.
        </p>
        <p style={bodyStyle}>
          This guide is your cheat sheet. No fluff, no judgement — just the stuff we wish someone had told us before our first registration morning.
        </p>

        <h2 style={h2Style}>Step 1: Check Registration Dates Before Anything Else</h2>
        <p style={bodyStyle}>
          This is the single most important thing you can do.
        </p>
        <p style={bodyStyle}>
          Many popular camps — especially municipal ones through Vancouver, Burnaby, and North Vancouver recreation — open registration in March or April. And they fill up fast. We're talking minutes for some of the popular weeks.
        </p>
        <p style={bodyStyle}>
          <strong>What to do right now:</strong>
        </p>
        <ul style={{ ...bodyStyle, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Check your city's recreation registration dates (most open in waves)</li>
          <li style={{ marginBottom: 8 }}>Treat it like a concert ticket drop — set a reminder, have your account ready, know what you want</li>
          <li style={{ marginBottom: 8 }}>Private camps have more flexible timelines, but the best weeks still go early</li>
          <li style={{ marginBottom: 8 }}>If something is full, get on the waitlist immediately — spots open up more than you'd think</li>
        </ul>
        <p style={bodyStyle}>
          <InternalLink to="/camps">Browse camp registration dates on Skeddo</InternalLink>
        </p>

        <h2 style={h2Style}>Step 2: Start with Your Kid, Not the Catalogue</h2>
        <p style={bodyStyle}>
          Before you spiral into comparing 400 programs, take ten minutes to think about your actual child.
        </p>
        <ul style={{ ...bodyStyle, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}><strong>What lights them up right now?</strong> Not what you hope they'll like — what are they actually into this month?</li>
          <li style={{ marginBottom: 8 }}><strong>How do they handle new environments?</strong> A kid who thrives in groups might love a big multi-sport camp. A quieter kid might do better in a small art studio with ten kids.</li>
          <li style={{ marginBottom: 8 }}><strong>What does your kid need this summer?</strong> Structure? Freedom? A break from screens? Time with friends? The "best" camp is the one that fits your kid, not the one with the fanciest website.</li>
        </ul>

        <h2 style={h2Style}>Step 3: Map Out Your Whole Summer</h2>
        <p style={bodyStyle}>
          Camp registration is a lot easier when you know what you're working with.
        </p>
        <ul style={{ ...bodyStyle, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Block out vacation weeks, family visits, or anything already planned</li>
          <li style={{ marginBottom: 8 }}>Identify the must-have weeks (when you need childcare) vs. the nice-to-have weeks</li>
          <li style={{ marginBottom: 8 }}>Mix it up — a week of sports, a week of art, a week of outdoor camp keeps things fresh and prevents burnout</li>
          <li style={{ marginBottom: 8 }}>Leave at least one week with nothing planned. Kids need downtime too.</li>
        </ul>
        <p style={bodyStyle}>
          <InternalLink to="/camps">Use Skeddo's planner to map your summer</InternalLink>
        </p>

        <h2 style={h2Style}>Step 4: Figure Out Your Budget</h2>
        <p style={bodyStyle}>
          Real talk: summer camp is expensive. Here's what to expect in Metro Vancouver:
        </p>
        <ul style={{ ...bodyStyle, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Municipal recreation camps (community centres): $150–$350/week</li>
          <li style={{ marginBottom: 8 }}>Private day camps (sports, STEM, arts): $250–$500/week</li>
          <li style={{ marginBottom: 8 }}>Specialty/overnight camps: $400–$600+/week</li>
          <li style={{ marginBottom: 8 }}>A realistic budget for a full summer: $1,500–$3,500 per kid</li>
        </ul>
        <p style={bodyStyle}>
          <strong>Ways to bring that number down:</strong>
        </p>
        <ul style={{ ...bodyStyle, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Many cities offer fee subsidies for families who qualify — check your city's recreation website</li>
          <li style={{ marginBottom: 8 }}>Some camps offer sibling discounts, early bird pricing, or multi-week deals</li>
          <li style={{ marginBottom: 8 }}>Half-day camps are significantly cheaper and still give kids a great experience</li>
          <li style={{ marginBottom: 8 }}>Mix paid camps with free options — parks, library programs, community events</li>
        </ul>

        <h2 style={h2Style}>Step 5: Get the Logistics Sorted Early</h2>
        <p style={bodyStyle}>
          Once you've got the big picture, check these logistics before you hit "register":
        </p>
        <ul style={{ ...bodyStyle, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}><strong>Location:</strong> Can you realistically do drop-off and pickup every day? Factor in traffic and your work schedule.</li>
          <li style={{ marginBottom: 8 }}><strong>Hours:</strong> Does the camp offer extended care (before/after)? Most run 9–3 or 9–4, which doesn't always cover a full work day.</li>
          <li style={{ marginBottom: 8 }}><strong>Dates:</strong> Double-check that the camp weeks align with your school's summer break. Some camps start before school ends.</li>
          <li style={{ marginBottom: 8 }}><strong>Siblings:</strong> Can they attend the same camp at the same time? Some providers make this easy; others don't.</li>
        </ul>

        <h2 style={h2Style}>Already April? Here's Your Late-Registration Game Plan</h2>
        <p style={bodyStyle}>
          If you're reading this and the "good" camps are already full — don't panic. There are still great options:
        </p>
        <ul style={{ ...bodyStyle, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}><strong>Lean on the village.</strong> Ask other parents what worked for them. Word-of-mouth recommendations are gold.</li>
          <li style={{ marginBottom: 8 }}><strong>Vacation days are magic.</strong> If you can take even a few days off to be with your kids, that takes pressure off the schedule.</li>
          <li style={{ marginBottom: 8 }}><strong>Waitlists move.</strong> Get on every waitlist you can. Families cancel, kids get sick, plans change. We've seen spots open up as late as the week before.</li>
          <li style={{ marginBottom: 8 }}><strong>Look at lesser-known providers.</strong> The big-name camps fill first, but smaller operations often have availability and offer a more personal experience.</li>
        </ul>
        <p style={bodyStyle}>
          <InternalLink to="/camps">Search for camps with open spots on Skeddo</InternalLink>
        </p>

        <h2 style={h2Style}>You've Got This</h2>
        <p style={bodyStyle}>
          Camp registration feels like a big deal because it is one. You're investing time, money, and trust into someone else looking after your kid for a week. That deserves thoughtfulness.
        </p>
        <p style={bodyStyle}>
          But here's the thing: there's no perfect answer. The camp your kid ends up loving might not be the one with the best reviews or the longest waitlist. Sometimes it's the random Wednesday pottery camp that becomes the highlight of their summer.
        </p>
        <p style={bodyStyle}>
          Start early, be flexible, and trust your gut. You know your kid better than any algorithm.
        </p>
        <p style={bodyStyle}>
          And if you want a tool that makes the searching and comparing part easier — that's exactly what we built Skeddo to do.
        </p>

        <CTABox />
      </>
    ),
  },
];

export function getBlogPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}
