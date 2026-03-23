import { useState, useEffect } from "react";
import { trackEvent } from "../utils/analytics";

const F = {
  display: "'Poppins', sans-serif",
  body: "'Barlow', sans-serif",
};

/**
 * Reusable promotional banner with gradient background and dismiss button.
 * Types: upgrade-budget, upgrade-kids, upgrade-sharing, tip-wishlist, tip-calendar, tip-search
 */
export default function PromoBanner({ type, onDismiss }) {
  const config = BANNERS[type];

  useEffect(() => {
    if (config && type.startsWith("upgrade")) {
      trackEvent("upgrade_prompt_shown", { banner_type: type });
    }
  }, [type]);

  if (!config) return null;

  return (
    <div style={{
      background: config.bg,
      borderRadius: 16,
      padding: "22px 20px",
      position: "relative",
      overflow: "hidden",
      marginBottom: 16,
    }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -40, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -20, left: 30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute", top: 6, right: 6, zIndex: 2,
            background: "rgba(255,255,255,0.15)", border: "none",
            width: 44, height: 44, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: config.darkText ? "rgba(27,36,50,0.4)" : "rgba(255,255,255,0.5)",
            fontSize: 16, lineHeight: 1,
          }}
        >
          {"\u00D7"}
        </button>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {config.label && (
          <p style={{
            fontFamily: F.body, fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.12em",
            color: config.darkText ? "rgba(27,36,50,0.35)" : "rgba(255,255,255,0.4)",
            margin: "0 0 8px",
          }}>
            {config.label}
          </p>
        )}
        <p style={{
          fontFamily: F.display, fontSize: 20, fontWeight: 700,
          color: config.darkText ? "#1B2432" : "#fff",
          margin: 0, lineHeight: 1.3,
        }}>
          {config.title}
        </p>
        <p style={{
          fontFamily: F.body, fontSize: 14,
          color: config.darkText ? "rgba(27,36,50,0.6)" : "rgba(255,255,255,0.7)",
          margin: "10px 0 0", lineHeight: 1.6,
        }}>
          {config.body}
        </p>
      </div>
    </div>
  );
}

const BANNERS = {
  "upgrade-budget": {
    bg: "linear-gradient(135deg, #2D9F6F 0%, #1E7A52 100%)",
    title: "Wondering where the money's going?",
    body: "Skeddo tracks spending across all your kids' programs \u2014 see totals per kid, per program, and for the whole season. No surprises.",
    darkText: false,
  },
  "upgrade-kids": {
    bg: "linear-gradient(135deg, #F4A261 0%, #E8893A 100%)",
    title: "Got more than one kid?",
    body: "Add all your kids and track every program in one place.",
    label: null,
    darkText: true,
  },
  "upgrade-sharing": {
    bg: "linear-gradient(135deg, #E76F51 0%, #C85A3D 100%)",
    title: "Coordinating with your endless group chats?",
    body: "Share programs with friends, coordinate circles, and share schedule management with a co-parent or caregiver.",
    darkText: false,
  },
  "upgrade-discover": {
    bg: "linear-gradient(135deg, #4A6FA5 0%, #3D5E90 100%)",
    title: "Simplify your search",
    body: "Filter by neighbourhood, provider, activity type, cost, and more to find the perfect fit.",
    darkText: false,
  },
  "upgrade-programs": {
    bg: "linear-gradient(135deg, #E76F51 0%, #C85A3D 100%)",
    title: "Save all the programs you need",
    body: "Track unlimited programs across all your kids and never lose sight of a registration deadline.",
    darkText: false,
  },
  "tip-wishlist": {
    bg: "linear-gradient(135deg, #4A6FA5 0%, #3D5E90 100%)",
    label: "Quick tip",
    title: "Build your wishlist",
    body: "Mark programs as \"Exploring\" to save the ones you're considering. Your shortlist, all in one place.",
    darkText: false,
  },
  "tip-calendar": {
    bg: "linear-gradient(135deg, #2D9F6F 0%, #23875A 100%)",
    label: "Quick tip",
    title: "Your calendar is looking good",
    body: "Tap any program to see details, edit your enrollment status, or check for time conflicts.",
    darkText: false,
  },
  "tip-search": {
    bg: "linear-gradient(135deg, #F4A261 0%, #E08838 100%)",
    label: "Did you know?",
    title: "Looking for programs nearby?",
    body: "Browse thousands of programs in your neighbourhood from the Discover tab.",
    darkText: true,
  },
};
