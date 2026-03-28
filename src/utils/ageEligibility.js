/**
 * Age eligibility utilities for matching kids to programs.
 *
 * computeEligibility(birthMonth, birthYear, ageMin, ageMax, campStartDate)
 * → { ageYears, ageMonths, monthsUntilBirthday, eligibilityTier }
 *
 * getEligibilityLabel(childName, birthMonth, birthYear, ageMin, ageMax, startDate)
 * → human-readable string
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Compute age eligibility for a child relative to a program's age range
 * and start date.
 *
 * @param {number|null} birthMonth  1–12 (January = 1)
 * @param {number|null} birthYear   e.g. 2018
 * @param {number|null} ageMin      program minimum age (inclusive)
 * @param {number|null} ageMax      program maximum age (inclusive)
 * @param {string|Date} campStartDate  ISO date string or Date object
 * @returns {{ ageYears: number, ageMonths: number, monthsUntilBirthday: number, eligibilityTier: string|null }}
 */
export function computeEligibility(birthMonth, birthYear, ageMin, ageMax, campStartDate) {
  // If child has no birth info or program has no age range → null (show all)
  if (!birthMonth || !birthYear) return { ageYears: null, ageMonths: null, monthsUntilBirthday: null, eligibilityTier: null };
  if (ageMin == null && ageMax == null) return { ageYears: null, ageMonths: null, monthsUntilBirthday: null, eligibilityTier: null };

  // Parse the camp start date
  const start = campStartDate instanceof Date ? campStartDate : new Date(campStartDate + "T00:00:00");
  if (isNaN(start.getTime())) return { ageYears: null, ageMonths: null, monthsUntilBirthday: null, eligibilityTier: null };

  const startYear = start.getFullYear();
  const startMonth = start.getMonth() + 1; // 1-based

  // Calculate age at camp start
  let ageYears = startYear - birthYear;
  if (startMonth < birthMonth) ageYears -= 1;

  // Calculate remaining months
  let ageMonths = startMonth - birthMonth;
  if (ageMonths < 0) ageMonths += 12;

  // Months until next birthday from the camp start date
  let monthsUntilBirthday = (birthMonth - startMonth) % 12;
  if (monthsUntilBirthday <= 0) monthsUntilBirthday += 12;

  // Determine eligibility tier
  const effectiveMin = ageMin != null ? Number(ageMin) : -Infinity;
  const effectiveMax = ageMax != null ? Number(ageMax) : Infinity;

  let eligibilityTier;
  let borderlineReason = null; // "too-young" or "too-old"

  if (ageYears >= effectiveMin && ageYears <= effectiveMax) {
    eligibilityTier = "eligible";
  } else if (ageYears === effectiveMin - 1 && monthsUntilBirthday <= 6) {
    // Too young by ≤ 6 months — borderline (they'll qualify soon)
    eligibilityTier = "borderline";
    borderlineReason = "too-young";
  } else if (ageYears === effectiveMax + 1 && ageMonths <= 6) {
    // Just aged out within 6 months — borderline
    eligibilityTier = "borderline";
    borderlineReason = "too-old";
  } else {
    eligibilityTier = "ineligible";
  }

  return { ageYears, ageMonths, monthsUntilBirthday, eligibilityTier, borderlineReason };
}

/**
 * Return a human-readable eligibility label.
 *
 * @param {string} childName
 * @param {number|null} birthMonth  1–12
 * @param {number|null} birthYear
 * @param {number|null} ageMin
 * @param {number|null} ageMax
 * @param {string|Date} startDate
 * @returns {string}
 */
export function getEligibilityLabel(childName, birthMonth, birthYear, ageMin, ageMax, startDate) {
  const result = computeEligibility(birthMonth, birthYear, ageMin, ageMax, startDate);

  if (result.eligibilityTier === null) {
    return "Age range not specified";
  }

  const name = childName || "This child";

  if (result.eligibilityTier === "eligible") {
    return `${name} is ${result.ageYears}`;
  }

  if (result.eligibilityTier === "borderline") {
    const birthdayMonthName = MONTH_NAMES[(birthMonth - 1)] || "";
    if (result.borderlineReason === "too-old") {
      return `${name} is ${result.ageYears} (turned ${result.ageYears} in ${birthdayMonthName}) — check age policy with provider`;
    }
    const nextAge = result.ageYears + 1;
    return `${name} turns ${nextAge} in ${birthdayMonthName} — check age policy with provider`;
  }

  // ineligible — shouldn't normally be shown, but just in case
  return `${name} is ${result.ageYears} — outside age range`;
}
