import re
import glob

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update hero subtitle
old_hero_sub = r'<h5 class="text-primary text-uppercase mb-3 wow slideInDown"[^>]*>Transforming Ideas into Digital Reality</h5>'
new_hero_sub = '<div class="mb-3 wow slideInDown" data-wow-delay="0.1s"><span class="section-subtitle">Transforming Ideas into Digital Reality</span></div>'
html = re.sub(old_hero_sub, new_hero_sub, html)

# Capability tags mapping for Why Choose Us
caps = [
    ("Experienced Developers", "01 // ENGINEERING"),
    ("Affordable Pricing", "02 // ECONOMICS"),
    ("Modern Technologies", "03 // ECOSYSTEM"),
    ("On-Time Delivery", "04 // VELOCITY"),
    ("24×7 Support", "05 // RELIABILITY"),
    ("Secure Development", "06 // ZERO-TRUST"),
    ("Scalable Architecture", "07 // SCALABILITY"),
    ("SEO Friendly", "08 // DISCOVERY"),
    ("Responsive Design", "09 // RESPONSIVENESS"),
    ("Clean UI/UX", "10 // INTERFACES"),
    ("Client Satisfaction", "11 // RETENTION"),
    ("Free Consultation", "12 // ADVISORY"),
]

for title, tag in caps:
    pattern = rf'(<h4 class="text-white h5 mb-3">{re.escape(title)}</h4>)'
    replacement = rf'<span class="capability-tag">{tag}</span>\n                        \1'
    if tag not in html:
        html = re.sub(pattern, replacement, html)

# Services tags mapping
services = [
    ("Custom Software", "01 // ENTERPRISE CORE"),
    ("Web Development", "02 // CLIENT INTERFACES"),
    ("E-Commerce Platforms", "03 // COMMERCE PLATFORMS"),
]
for title, tag in services:
    pattern = rf'(<h4 class="text-white h5 mb-3">{re.escape(title)}</h4>)'
    replacement = rf'<span class="capability-tag">{tag}</span>\n                        \1'
    if tag not in html:
        html = re.sub(pattern, replacement, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html markup with technical labels and hero subtitle.")

# 2. Add System Status Beacon to Footer across all HTML files
beacon_html = '<div class="system-status-beacon mb-3"><span class="status-dot-pulse"></span> ALL SYSTEMS OPERATIONAL &middot; PUNE, IN</div>'

for fpath in glob.glob('*.html'):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'system-status-beacon' not in content:
        # Match after footer logo img
        content = re.sub(
            r'(<img[^>]*class="[^"]*footer-brand-logo[^"]*"[^>]*>\s*</div>)',
            rf'\1\n                    {beacon_html}',
            content
        )
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added system status beacon to {fpath}")

print("Completed markup enhancements.")
