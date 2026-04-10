# Verification Log — Steamoji, Sunset CC, YMCA Fixes (2026-04-10)

**Date:** 2026-04-10
**Method:** Chrome browser verification on steamoji.com, mysunset.net, gv.ymca.ca
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Steamoji (26 entries)

### Browser Verification
Navigated to steamoji.com/camps/canada-bc-south-surrey. Verified:
- All 24 steamoji-ss-* camp names match listings on steamoji.com
- Dates and times confirmed (full-day 9 AM - 3 PM, half-day 9 AM - 12 PM)
- Ages confirmed (5+, 8+, 10+ per listing)
- Location: "South Surrey" is actually Unit #3, 1589 George Street, White Rock, BC V4B 0C7

### Issues Found
- **Prices not publicly visible**: Steamoji only shows pricing through their booking system, not on camp listing pages. 24 entries remain null-cost with costNote explaining this.
- **Vague address**: "South Surrey, BC" → corrected to actual street address
- **No URLs**: All 26 entries had no URL → fixed

### Fixes Applied
| Action | Count |
|--------|-------|
| URLs added (steamoji.com/camps/...) | 26 |
| Address corrected (White Rock) | 24 |
| CostNote updated (pricing behind registration) | 24 |

---

## Sunset Community Centre (28 null-cost entries)

### Browser Verification
Navigated to mysunset.net/summer-day-camps-2026/. Verified:
- Summer Escape Day Camp (6-12 yrs): 9 AM - 4 PM, July-August
- Youth Day Camp (12-16 yrs): 9:30 AM - 4 PM, July-August
- Creative Remix Summer Camp at Moberly (6-10 yrs): 9:30 AM - 4 PM

### Issues Found
- **Prices not on website**: Sunset CC's website doesn't list prices — registration is through CoV ActiveNet (opened Apr 8, 2026)
- **Missing URLs**: 19 entries had no URL
- **Generic entry**: sunset-cc-camp-1 was superseded by individual week entries

### Fixes Applied
| Action | Count |
|--------|-------|
| URLs added (mysunset.net/summer-day-camps-2026/) | 19 |
| CostNotes updated | 28 |
| Generic entry deactivated | 1 |

---

## YMCA (12 null-cost entries)

### Fixes Applied
- 8 Camp Elphinstone entries: URL → gv.ymca.ca/camp-elphinstone
- 4 Swim lesson entries: URL → gv.ymca.ca/swim-lessons

---

## Summary

| Action | Count |
|--------|-------|
| Steamoji URLs/addresses/costNotes | 26 |
| Sunset CC URLs/costNotes/deactivation | 29 |
| YMCA URLs/costNotes | 12 |
| **Total entries fixed** | **67** |
