import os
import glob
import json
import re
from xml.etree import ElementTree as ET

WORKSPACE = r"f:\GlobalX Company\globalx-main"

html_files = sorted(glob.glob(os.path.join(WORKSPACE, "*.html")))

print(f"Total HTML files found: {len(html_files)}")

results = []
titles = {}
descriptions = {}
canonicals = {}

for filepath in html_files:
    fname = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Extract title
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else "MISSING"

    # Extract canonical
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content, re.IGNORECASE)
    if not canonical_match:
        canonical_match = re.search(r'<link\s+href="([^"]+)"\s+rel="canonical"', content, re.IGNORECASE)
    canonical = canonical_match.group(1).strip() if canonical_match else "MISSING"

    # Extract meta description
    desc_match = re.search(r'<meta\s+(?:name="description"\s+content="([^"]*)"|content="([^"]*)"\s+name="description")', content, re.IGNORECASE)
    desc = (desc_match.group(1) or desc_match.group(2)).strip() if desc_match else "MISSING"

    # Extract robots
    robots_match = re.search(r'<meta\s+(?:name="robots"\s+content="([^"]*)"|content="([^"]*)"\s+name="robots")', content, re.IGNORECASE)
    robots = (robots_match.group(1) or robots_match.group(2)).strip() if robots_match else "DEFAULT (index, follow)"

    # Extract schema scripts
    schemas = re.findall(r'<script\s+type="application/ld\+json">(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
    schema_types = []
    schema_valid = True
    for s in schemas:
        try:
            parsed = json.loads(s.strip())
            if isinstance(parsed, dict) and "@type" in parsed:
                schema_types.append(parsed["@type"])
            elif isinstance(parsed, dict) and "@graph" in parsed:
                schema_types.append("Graph")
        except Exception as e:
            schema_valid = False
            schema_types.append(f"ERR: {e}")

    # Check for stale domain references
    stale_vercel = len(re.findall(r'globalx\.vercel\.app', content))

    titles[fname] = title
    descriptions[fname] = desc
    canonicals[fname] = canonical

    results.append({
        "file": fname,
        "title": title,
        "desc_len": len(desc),
        "desc": desc[:60] + "..." if len(desc) > 60 else desc,
        "canonical": canonical,
        "robots": robots,
        "schemas": schema_types,
        "schema_valid": schema_valid,
        "stale_domain_count": stale_vercel
    })

print("\n=== AUDIT RESULTS TABLE ===")
for r in results:
    print(f"File: {r['file']}")
    print(f"  Title: {r['title']}")
    print(f"  Canonical: {r['canonical']}")
    print(f"  Desc ({r['desc_len']} chars): {r['desc']}")
    print(f"  Robots: {r['robots']}")
    print(f"  Schemas: {r['schemas']} (Valid JSON: {r['schema_valid']})")
    print(f"  Stale 'globalx.vercel.app' references: {r['stale_domain_count']}")
    print("-" * 50)

# Check duplicate titles
title_counts = {}
for f, t in titles.items():
    if t != "MISSING":
        title_counts[t] = title_counts.get(t, 0) + 1
duplicates = {t: c for t, c in title_counts.items() if c > 1}
print("\n=== DUPLICATE TITLES CHECK ===")
if duplicates:
    print(f"WARNING: Found duplicate titles: {duplicates}")
else:
    print("PASS: All page titles are completely unique!")

# Check sitemap.xml
print("\n=== SITEMAP.XML CHECK ===")
sitemap_path = os.path.join(WORKSPACE, "sitemap.xml")
if os.path.exists(sitemap_path):
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    urls = [elem.text for elem in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    print(f"Found {len(urls)} URLs in sitemap.xml:")
    for u in urls:
        print(f"  - {u}")
else:
    print("ERROR: sitemap.xml not found!")

# Check robots.txt
print("\n=== ROBOTS.TXT CHECK ===")
robots_path = os.path.join(WORKSPACE, "robots.txt")
if os.path.exists(robots_path):
    with open(robots_path, 'r') as f:
        print(f.read())
else:
    print("ERROR: robots.txt not found!")
