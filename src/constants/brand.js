/* ─── SKEDDO BRAND TOKENS ─── */

/* Fresh & Clean palette — March 2026 rebrand */
export const C = {
  seaGreen: "#2D9F6F",       // Jade Green (primary accent)
  blue: "#4A6FA5",            // Slate Blue (secondary)
  lilac: "#F4A261",           // Peach (soft accent)
  olive: "#E76F51",           // Terracotta (highlight/italic accent)
  ink: "#1B2432",             // Midnight (dark base)
  cream: "#F8F9FA",           // Cloud (light background)
  white: "#FFFFFF",
  muted: "#4A6FA5",           // Slate Blue (secondary text)
  border: "#E5E7EB",          // Light border
  dangerBg: "#FEF2F2",
  danger: "#EF4444",
};

export const STATUS_MAP = {
  Enrolled: { color: C.seaGreen, bg: "rgba(45,159,111,0.10)", icon: "\u2713" },
  Waitlist: { color: C.olive, bg: "rgba(231,111,81,0.10)", icon: "\u25F7" },
  Exploring: { color: C.blue, bg: "rgba(74,111,165,0.10)", icon: "\u25C7" },
};

export const CATEGORIES = [
  "Sports",
  "Arts",
  "STEM",
  "Music",
  "Outdoor",
  "Life Skills",
  "Academic",
  "Social",
  "Faith-Based",
  "Language",
  "Cultural",
  "Childcare",
];

export const CAT_EMOJI = {
  Sports: "\u26BD\uD83C\uDFC0",
  Arts: "\ud83c\udfa8",
  STEM: "\ud83d\udcbb",
  Music: "\ud83c\udfb5",
  Outdoor: "\ud83c\udf32",
  "Life Skills": "\ud83c\udf73",
  Academic: "\ud83d\udcda",
  Social: "\ud83e\uddf8",
  "Faith-Based": "\u26ea",
  Language: "\ud83d\udde3\ufe0f",
  Childcare: "\ud83d\udc76",
  Cultural: "\ud83c\udfad",
};

/* ─── Kid color palette — auto-assigned, user-editable ─── */
export const KID_COLORS = [
  { hex: "#2D9F6F", name: "Jade Green" },
  { hex: "#4A6FA5", name: "Slate Blue" },
  { hex: "#F4A261", name: "Peach" },
  { hex: "#E76F51", name: "Terracotta" },
  { hex: "#E06C50", name: "Coral" },
  { hex: "#5BB5A2", name: "Teal" },
  { hex: "#7B68AE", name: "Purple" },
  { hex: "#E8913A", name: "Orange" },
];

export const DAY_LENGTHS = ["Full Day", "Half Day", "Single Day"];

export const SEASON_TYPES = [
  "Summer Camp",
  "Spring Break",
  "Christmas Camp",
  "Pro-D Day",
  "After School",
  "Year-Round",
];

/* ─── Activity interests — curated from program activity types ─── */
export const ACTIVITY_INTERESTS = [
  "Adventure",
  "Art",
  "Baseball",
  "Basketball",
  "Ceramics",
  "Chess",
  "Circus Arts",
  "Climbing",
  "Coding & Robotics",
  "Cooking & Baking",
  "Cycling",
  "Dance",
  "Drawing & Painting",
  "Fashion Design",
  "Fencing",
  "Film Acting",
  "Gymnastics",
  "Hockey",
  "Horseback Riding",
  "Improv & Comedy",
  "Language",
  "Leadership",
  "Martial Arts",
  "Multi-Sport",
  "Music",
  "Musical Theatre",
  "Nature & Environment",
  "Outdoor Adventure",
  "Paddling & Sailing",
  "Photography",
  "Public Speaking",
  "Sailing",
  "Science & Discovery",
  "Skating",
  "Soccer",
  "Swimming",
  "Tennis",
  "Theatre & Drama",
  "Track & Field",
  "Video Game Design",
  "Visual Arts",
  "Volleyball",
  "Water Sports",
  "Writing",
];
