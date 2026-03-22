#!/usr/bin/env python3
"""
Skeddo: Import 802 CSV programs + comprehensive database audit & cleanup.
"""

import csv
import json
import re
import sys
from collections import Counter
from copy import deepcopy

CSV_PATH = "/Users/nicolemont/Library/CloudStorage/GoogleDrive-skeddo.planner@gmail.com/My Drive/skeddodirectoryclean-alldistricts.csv"
JSON_PATH = "/Users/nicolemont/Documents/Skeddo/skeddo-app/src/data/programs.json"

VALID_CATEGORIES = [
    "Sports", "Arts", "STEM", "Music", "Outdoor", "Life Skills",
    "Academic", "Social", "Faith-Based", "Language", "Cultural",
    "General", "Multi-Activity", "Performing Arts"
]

VALID_ENROLLMENT = [
    "Open", "Coming Soon", "Likely Coming Soon", "Opening Soon",
    "Full/Waitlist", "Waitlist", "Closed", "Cancelled"
]

# ─── HELPERS ───

def parse_cost(val):
    """Convert cost string to number or None."""
    if val is None or val == "":
        return None
    if isinstance(val, (int, float)):
        return round(float(val), 2) if float(val) > 0 else None
    s = str(val).strip().replace("$", "").replace(",", "").strip()
    if s.lower() in ("tbd", "free", "n/a", "na", "", "varies", "unknown"):
        return 0 if s.lower() == "free" else None
    try:
        return round(float(s), 2)
    except ValueError:
        return None

def parse_age(val):
    """Convert age string to int or None."""
    if val is None or val == "":
        return None
    if isinstance(val, (int, float)):
        return int(val)
    s = str(val).strip()
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return None

def parse_coord(val):
    """Convert lat/lng string to float or None."""
    if val is None or val == "":
        return None
    try:
        return round(float(val), 6)
    except (ValueError, TypeError):
        return None

def normalize_date(val):
    """Ensure date is YYYY-MM-DD or empty string."""
    if not val or not isinstance(val, str):
        return ""
    val = val.strip()
    # Already YYYY-MM-DD
    if re.match(r'^\d{4}-\d{2}-\d{2}$', val):
        return val
    # MM/DD/YYYY
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', val)
    if m:
        return f"{m.group(3)}-{m.group(1).zfill(2)}-{m.group(2).zfill(2)}"
    return ""

def calc_day_length(start_time, end_time, schedule_type=None):
    """Calculate Full Day vs Half Day from times."""
    if start_time and end_time:
        try:
            def parse_time(t):
                t = t.strip().upper()
                m = re.match(r'(\d{1,2}):(\d{2})\s*(AM|PM)?', t)
                if not m:
                    return None
                h, mn = int(m.group(1)), int(m.group(2))
                ampm = m.group(3)
                if ampm == "PM" and h < 12:
                    h += 12
                if ampm == "AM" and h == 12:
                    h = 0
                return h * 60 + mn
            s = parse_time(start_time)
            e = parse_time(end_time)
            if s is not None and e is not None:
                duration = (e - s) / 60.0
                return "Full Day" if duration >= 6 else "Half Day"
        except:
            pass
    # Fallback to scheduleType
    if schedule_type:
        st = str(schedule_type).strip().lower()
        if "full" in st:
            return "Full Day"
        if "half" in st:
            return "Half Day"
    return None

def build_times(start_time, end_time):
    """Build times string like '9:00 AM - 4:00 PM'."""
    if start_time and end_time:
        return f"{start_time.strip()} - {end_time.strip()}"
    return ""

def parse_tags(val):
    """Convert comma-separated tags string to list."""
    if not val:
        return []
    if isinstance(val, list):
        return val
    return [t.strip() for t in str(val).split(",") if t.strip()]

def is_valid_url(url):
    """Check if URL is valid (starts with http/https, not localhost)."""
    if not url or not isinstance(url, str):
        return False
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        return False
    if "localhost" in url or "127.0.0.1" in url:
        return False
    # Must have a domain after protocol
    after_proto = url.split("://", 1)[1] if "://" in url else ""
    if not after_proto or len(after_proto) < 4:
        return False
    return True

def normalize_name(name):
    """Normalize name for comparison (lowercase, strip, collapse whitespace)."""
    if not name:
        return ""
    return re.sub(r'\s+', ' ', str(name).lower().strip())

def names_are_near_duplicates(a, b):
    """Check if two names are near-duplicates.

    IMPORTANT: Programs with different age ranges, levels, or locations in
    parentheses are DIFFERENT programs (different sessions), not duplicates.
    Only flag as near-dupes if the parenthetical content is truly cosmetic
    (e.g. punctuation-only differences).
    """
    # If names are identical, they're exact dupes (handled elsewhere)
    if a == b:
        return False

    # Extract parenthetical content
    a_parens = re.findall(r'\(([^)]*)\)', a)
    b_parens = re.findall(r'\(([^)]*)\)', b)
    a_clean = re.sub(r'\s*\([^)]*\)\s*', ' ', a).strip()
    b_clean = re.sub(r'\s*\([^)]*\)\s*', ' ', b).strip()

    # Base names must match
    if a_clean != b_clean:
        return False

    # If both have parenthetical content, check if it's meaningfully different
    if a_parens and b_parens:
        # Different ages, levels, locations = NOT duplicates
        a_paren_text = ' '.join(a_parens).lower()
        b_paren_text = ' '.join(b_parens).lower()
        # If parentheticals contain age ranges, levels, AM/PM, locations = different programs
        age_pattern = r'age|level|grade|\d+-\d+|am|pm|beginner|intermediate|advanced'
        if re.search(age_pattern, a_paren_text) or re.search(age_pattern, b_paren_text):
            return False
        # If parentheticals are just formatting differences
        if a_paren_text == b_paren_text:
            return True  # Same parens, cosmetic dupe
        return False  # Different parens, probably different programs

    # One has parens, other doesn't - only if parens are very short/cosmetic
    if a_parens or b_parens:
        paren_text = ' '.join(a_parens or b_parens).lower()
        # If parens contain meaningful info, not a dupe
        if len(paren_text) > 3 or re.search(r'\d', paren_text):
            return False
        return True

    return False

def program_completeness_score(p):
    """Score how complete a program record is."""
    score = 0
    for key in ['name', 'provider', 'category', 'cost', 'startDate', 'endDate',
                'startTime', 'endTime', 'description', 'registrationUrl',
                'ageMin', 'ageMax', 'neighbourhood', 'address', 'lat', 'lng']:
        v = p.get(key) or p.get('location')
        if v is not None and v != "" and v != 0:
            score += 1
    return score


# ═══════════════════════════════════════════════════════
# TASK 1: IMPORT CSV PROGRAMS
# ═══════════════════════════════════════════════════════

print("=" * 60)
print("TASK 1: IMPORTING CSV PROGRAMS")
print("=" * 60)

# Read CSV
with open(CSV_PATH, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    csv_rows = list(reader)
print(f"CSV rows read: {len(csv_rows)}")

# Read existing programs
with open(JSON_PATH, encoding='utf-8') as f:
    programs = json.load(f)
original_count = len(programs)
print(f"Existing programs: {original_count}")

# Build dedup keys from existing
existing_keys = {}
for i, p in enumerate(programs):
    key = (normalize_name(p.get('name', '')), normalize_name(p.get('provider', '')))
    existing_keys[key] = i

# Map CSV to program format
new_programs = []
skipped_dupes = 0
for row in csv_rows:
    name = (row.get('Program Name') or '').strip()
    provider = (row.get('Provider') or '').strip()

    # Dedup check
    key = (normalize_name(name), normalize_name(provider))
    if key in existing_keys:
        skipped_dupes += 1
        continue

    start_time = (row.get('Start Time') or '').strip()
    end_time = (row.get('End Time') or '').strip()
    schedule_type = (row.get('Schedule Type') or '').strip()

    program = {
        "id": row.get('ID', '').strip(),
        "name": name,
        "provider": provider,
        "category": row.get('Category', '').strip(),
        "campType": row.get('Camp Type', '').strip() or "Summer Camp",
        "scheduleType": schedule_type or None,
        "ageMin": parse_age(row.get('Age Min')),
        "ageMax": parse_age(row.get('Age Max')),
        "startDate": normalize_date(row.get('Start Date')),
        "endDate": normalize_date(row.get('End Date')),
        "days": (row.get('Days') or '').strip() or "Mon-Fri",
        "startTime": start_time or None,
        "endTime": end_time or None,
        "cost": parse_cost(row.get('Cost')),
        "indoorOutdoor": (row.get('Indoor/Outdoor') or '').strip() or None,
        "neighbourhood": (row.get('Neighbourhood') or '').strip() or None,
        "address": (row.get('Address') or '').strip() or None,
        "postalCode": (row.get('Postal Code') or '').strip() or None,
        "lat": parse_coord(row.get('Latitude')),
        "lng": parse_coord(row.get('Longitude')),
        "enrollmentStatus": (row.get('Enrollment Status') or '').strip() or "Coming Soon",
        "registrationUrl": (row.get('Registration URL') or '').strip() or None,
        "description": (row.get('Description') or '').strip() or None,
        "tags": parse_tags(row.get('Tags')),
        "source": (row.get('Source') or '').strip() or None,
        "season": "Summer 2026",
        "dayLength": calc_day_length(start_time, end_time, schedule_type),
    }

    # Build times field
    if start_time and end_time:
        program["times"] = build_times(start_time, end_time)

    new_programs.append(program)
    existing_keys[key] = len(programs) + len(new_programs) - 1

programs.extend(new_programs)
print(f"Programs added from CSV: {len(new_programs)}")
print(f"Skipped (duplicate name+provider): {skipped_dupes}")
print(f"Total after import: {len(programs)}")


# ═══════════════════════════════════════════════════════
# TASK 2: COMPREHENSIVE DATABASE AUDIT
# ═══════════════════════════════════════════════════════

print()
print("=" * 60)
print("TASK 2: COMPREHENSIVE DATABASE AUDIT")
print("=" * 60)

fixes = {
    "exact_dupes_removed": 0,
    "near_dupes_removed": 0,
    "cost_fixed": 0,
    "age_fixed": 0,
    "date_fixed": 0,
    "enrollment_fixed": 0,
    "url_fixed": 0,
    "url_removed": 0,
    "location_fixed": 0,
    "daylength_fixed": 0,
    "category_fixed": 0,
}

# ─── 2a. DEDUPLICATION ───
print("\n--- 2a. Deduplication ---")

# Exact duplicates: same name + provider + startDate (case-insensitive)
# Programs with different start dates are different sessions, NOT duplicates
seen = {}
to_remove = set()
for i, p in enumerate(programs):
    key = (
        normalize_name(p.get('name', '')),
        normalize_name(p.get('provider', '')),
        (p.get('startDate') or '').strip()
    )
    if key in seen:
        # Keep the one with more complete data
        existing_idx = seen[key]
        existing_score = program_completeness_score(programs[existing_idx])
        current_score = program_completeness_score(p)
        if current_score > existing_score:
            # Current is better, remove existing
            to_remove.add(existing_idx)
            seen[key] = i
        else:
            to_remove.add(i)
    else:
        seen[key] = i

exact_dupes = len(to_remove)
fixes["exact_dupes_removed"] = exact_dupes
print(f"Exact duplicates found: {exact_dupes}")

# Near duplicates: same provider, very similar names
# Group by provider
by_provider = {}
for i, p in enumerate(programs):
    if i in to_remove:
        continue
    prov = normalize_name(p.get('provider', ''))
    if prov not in by_provider:
        by_provider[prov] = []
    by_provider[prov].append(i)

near_dupe_details = []
for prov, indices in by_provider.items():
    if len(indices) < 2:
        continue
    names = [(i, normalize_name(programs[i].get('name', ''))) for i in indices]
    for a in range(len(names)):
        for b in range(a + 1, len(names)):
            idx_a, name_a = names[a]
            idx_b, name_b = names[b]
            if idx_a in to_remove or idx_b in to_remove:
                continue
            if name_a == name_b:
                continue  # Already caught by exact
            if names_are_near_duplicates(name_a, name_b):
                # Check if they have different dates (different sessions = keep both)
                pa = programs[idx_a]
                pb = programs[idx_b]
                if pa.get('startDate') and pb.get('startDate') and pa.get('startDate') != pb.get('startDate'):
                    continue  # Different sessions, keep both
                # Remove the less complete one
                score_a = program_completeness_score(pa)
                score_b = program_completeness_score(pb)
                if score_b > score_a:
                    to_remove.add(idx_a)
                    near_dupe_details.append((pa.get('name'), pb.get('name'), prov))
                else:
                    to_remove.add(idx_b)
                    near_dupe_details.append((pb.get('name'), pa.get('name'), prov))

near_dupes = len(near_dupe_details)
fixes["near_dupes_removed"] = near_dupes
print(f"Near duplicates found & removed: {near_dupes}")
if near_dupe_details:
    for removed, kept, prov in near_dupe_details[:15]:
        print(f"  Removed: \"{removed}\" (kept: \"{kept}\") [{prov}]")
    if len(near_dupe_details) > 15:
        print(f"  ... and {len(near_dupe_details) - 15} more")

# Remove duplicates
programs = [p for i, p in enumerate(programs) if i not in to_remove]
print(f"After dedup: {len(programs)} programs")

# ─── 2b. DATA CONSISTENCY ───
print("\n--- 2b. Data Consistency ---")

for p in programs:
    # Cost: ensure number
    original_cost = p.get('cost')
    if not isinstance(original_cost, (int, float)) or original_cost is None:
        new_cost = parse_cost(original_cost)
        if new_cost != original_cost:
            p['cost'] = new_cost
            fixes["cost_fixed"] += 1

    # Age: ensure int or None
    for field in ('ageMin', 'ageMax'):
        val = p.get(field)
        if val is not None and not isinstance(val, int):
            new_val = parse_age(val)
            if new_val != val:
                p[field] = new_val
                fixes["age_fixed"] += 1
        elif val == "" or val == 0:
            p[field] = None
            fixes["age_fixed"] += 1

    # Dates: ensure YYYY-MM-DD or empty
    for field in ('startDate', 'endDate'):
        val = p.get(field, '')
        if val and isinstance(val, str):
            normalized = normalize_date(val)
            if normalized != val:
                p[field] = normalized
                fixes["date_fixed"] += 1

    # Enrollment status: normalize
    es = p.get('enrollmentStatus', '')
    if es and es not in VALID_ENROLLMENT:
        es_lower = es.lower().strip()
        if 'open' in es_lower and 'soon' not in es_lower:
            p['enrollmentStatus'] = 'Open'
            fixes["enrollment_fixed"] += 1
        elif 'coming' in es_lower or 'opening soon' in es_lower:
            p['enrollmentStatus'] = 'Coming Soon'
            fixes["enrollment_fixed"] += 1
        elif 'full' in es_lower or 'waitlist' in es_lower:
            p['enrollmentStatus'] = 'Full/Waitlist'
            fixes["enrollment_fixed"] += 1
        elif 'closed' in es_lower:
            p['enrollmentStatus'] = 'Closed'
            fixes["enrollment_fixed"] += 1
        elif 'cancel' in es_lower:
            p['enrollmentStatus'] = 'Cancelled'
            fixes["enrollment_fixed"] += 1
        elif 'likely' in es_lower:
            p['enrollmentStatus'] = 'Likely Coming Soon'
            fixes["enrollment_fixed"] += 1
        else:
            p['enrollmentStatus'] = 'Coming Soon'
            fixes["enrollment_fixed"] += 1
    elif not es:
        p['enrollmentStatus'] = 'Coming Soon'
        fixes["enrollment_fixed"] += 1

    # Category: normalize
    cat = p.get('category', '')
    if cat and cat not in VALID_CATEGORIES:
        cat_lower = cat.lower().strip()
        matched = False
        for valid in VALID_CATEGORIES:
            if valid.lower() == cat_lower:
                p['category'] = valid
                fixes["category_fixed"] += 1
                matched = True
                break
        if not matched:
            if 'sport' in cat_lower:
                p['category'] = 'Sports'
            elif 'art' in cat_lower and 'perform' not in cat_lower:
                p['category'] = 'Arts'
            elif 'perform' in cat_lower:
                p['category'] = 'Performing Arts'
            elif 'stem' in cat_lower or 'science' in cat_lower or 'tech' in cat_lower:
                p['category'] = 'STEM'
            elif 'music' in cat_lower:
                p['category'] = 'Music'
            elif 'outdoor' in cat_lower:
                p['category'] = 'Outdoor'
            elif 'life' in cat_lower:
                p['category'] = 'Life Skills'
            elif 'academic' in cat_lower:
                p['category'] = 'Academic'
            elif 'faith' in cat_lower:
                p['category'] = 'Faith-Based'
            elif 'language' in cat_lower:
                p['category'] = 'Language'
            elif 'cultur' in cat_lower:
                p['category'] = 'Cultural'
            elif 'social' in cat_lower:
                p['category'] = 'Social'
            elif 'multi' in cat_lower:
                p['category'] = 'Multi-Activity'
            else:
                p['category'] = 'General'
            fixes["category_fixed"] += 1

print(f"Cost fields fixed: {fixes['cost_fixed']}")
print(f"Age fields fixed: {fixes['age_fixed']}")
print(f"Date fields fixed: {fixes['date_fixed']}")
print(f"Enrollment status fixed: {fixes['enrollment_fixed']}")
print(f"Category fixed: {fixes['category_fixed']}")

# ─── 2c. URL VALIDATION ───
print("\n--- 2c. URL Validation ---")

for p in programs:
    url = p.get('registrationUrl')
    if url:
        url = url.strip()
        if not is_valid_url(url):
            p['registrationUrl'] = None
            fixes["url_removed"] += 1
        elif url.startswith("http://"):
            # Upgrade to https where possible (leave as-is if specific http link)
            pass  # Keep http links as they may be intentional

print(f"Invalid URLs removed: {fixes['url_removed']}")

# ─── 2d. LOCATION CLEANUP ───
print("\n--- 2d. Location Cleanup ---")

# Standardize: use 'address' field consistently, rename 'location' to 'address' where needed
for p in programs:
    # If program has 'location' but no 'address', rename
    if 'location' in p and 'address' not in p:
        p['address'] = p.pop('location')
        fixes["location_fixed"] += 1
    elif 'location' in p and 'address' in p:
        # If both exist, prefer the more specific one
        loc = p.get('location', '')
        addr = p.get('address', '')
        if loc and not addr:
            p['address'] = loc
        del p['location']
        fixes["location_fixed"] += 1

    # Clean up vague addresses
    addr = p.get('address', '')
    if addr:
        # Remove trailing ", Canada" or " Canada"
        addr = re.sub(r',?\s*Canada\s*$', '', addr, flags=re.I).strip()
        p['address'] = addr

print(f"Location fields fixed: {fixes['location_fixed']}")

# ─── 2e. TAG DAYLENGTH ───
print("\n--- 2e. dayLength Tagging ---")

for p in programs:
    if not p.get('dayLength'):
        dl = calc_day_length(
            p.get('startTime', ''),
            p.get('endTime', ''),
            p.get('scheduleType', '')
        )
        if dl:
            p['dayLength'] = dl
            fixes["daylength_fixed"] += 1

print(f"dayLength fields added/fixed: {fixes['daylength_fixed']}")

# ─── ENSURE CONSISTENT FIELD ORDER & CLEAN NULLS ───

# Ensure tags is always a list
for p in programs:
    if not isinstance(p.get('tags'), list):
        p['tags'] = parse_tags(p.get('tags'))
    # Ensure season field exists
    if not p.get('season'):
        p['season'] = 'Summer 2026'

# ═══════════════════════════════════════════════════════
# TASK 2f: FINAL REPORT
# ═══════════════════════════════════════════════════════

print("\n" + "=" * 60)
print("FINAL REPORT")
print("=" * 60)

print(f"\nTotal programs BEFORE: {original_count}")
print(f"Programs added from CSV: {len(new_programs)}")
print(f"Exact duplicates removed: {fixes['exact_dupes_removed']}")
print(f"Near duplicates removed: {fixes['near_dupes_removed']}")
print(f"Total programs AFTER: {len(programs)}")

print(f"\nData issues fixed:")
print(f"  Cost fields: {fixes['cost_fixed']}")
print(f"  Age fields: {fixes['age_fixed']}")
print(f"  Date fields: {fixes['date_fixed']}")
print(f"  Enrollment status: {fixes['enrollment_fixed']}")
print(f"  Category: {fixes['category_fixed']}")
print(f"  Invalid URLs removed: {fixes['url_removed']}")
print(f"  Location fields: {fixes['location_fixed']}")
print(f"  dayLength tagged: {fixes['daylength_fixed']}")

# Programs by category
print("\nPrograms by category:")
cat_counts = Counter(p.get('category', 'Unknown') for p in programs)
for cat, count in cat_counts.most_common():
    print(f"  {count:>5} - {cat}")

# Programs by provider (top 20)
print("\nPrograms by provider (top 20):")
prov_counts = Counter(p.get('provider', 'Unknown') for p in programs)
for prov, count in prov_counts.most_common(20):
    print(f"  {count:>5} - {prov}")

# Enrollment status distribution
print("\nEnrollment status distribution:")
es_counts = Counter(p.get('enrollmentStatus', 'Unknown') for p in programs)
for es, count in es_counts.most_common():
    print(f"  {count:>5} - {es}")

# Programs with/without key fields
print("\nData completeness:")
for field in ['cost', 'ageMin', 'startDate', 'registrationUrl', 'address', 'dayLength', 'description']:
    has = sum(1 for p in programs if p.get(field))
    print(f"  {field}: {has}/{len(programs)} ({100*has//len(programs)}%)")

# ─── WRITE OUTPUT ───
print(f"\nWriting {len(programs)} programs to {JSON_PATH}...")
with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(programs, f, indent=2, ensure_ascii=False)
print("Done!")
