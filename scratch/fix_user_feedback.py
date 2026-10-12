import glob
import re

# 1. Remove "ALL SYSTEMS OPERATIONAL · PUNE, IN" from all HTML files
beacon_pattern = r'\s*<div class="system-status-beacon[^"]*"[^>]*>[\s\S]*?</div>'

html_files = glob.glob('*.html')
for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'system-status-beacon' in content:
        content = re.sub(beacon_pattern, '', content)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Removed system-status-beacon from {fpath}")

# 2. Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace hero sizing with compact, balanced perfection
old_hero_rules = r'\.hero-wrapper\s*\{[\s\S]*?border-bottom:[^;]+;\s*\}'
new_hero_wrapper = """.hero-wrapper {
    position: relative;
    padding: 120px 0 65px 0;
    background: var(--bg-main);
    overflow: hidden;
    border-bottom: 1px solid var(--border-subtle);
}"""
css = re.sub(old_hero_rules, new_hero_wrapper, css)

old_hero_title = r'\.hero-title\s*\{[\s\S]*?max-width:\s*950px;\s*\}'
new_hero_title = """.hero-title {
    font-family: var(--font-heading) !important;
    font-size: clamp(2.2rem, 4vw, 3.6rem) !important;
    font-weight: 550 !important;
    line-height: 1.12 !important;
    letter-spacing: -0.03em !important;
    color: #FFFFFF !important;
    margin-bottom: 16px !important;
    max-width: 680px;
}"""
css = re.sub(old_hero_title, new_hero_title, css)

old_hero_sub = r'\.hero-sub\s*\{[\s\S]*?font-weight:\s*400;\s*\}'
new_hero_sub = """.hero-sub {
    font-family: var(--font-body);
    font-size: 15.5px;
    line-height: 1.62;
    color: var(--text-secondary);
    margin-bottom: 26px;
    max-width: 580px;
    font-weight: 400;
}"""
css = re.sub(old_hero_sub, new_hero_sub, css)

# Fix timeline alternating nodes
old_timeline_nodes = r'\.timeline-container\s*\{[\s\S]*?width:\s*50%;\s*\}'
new_timeline_nodes = """.timeline-container {
    padding: 12px 40px;
    position: relative;
    background-color: inherit;
    width: 50%;
    box-sizing: border-box;
}

.left-node {
    left: 0;
}

.right-node {
    left: 50%;
}"""
css = re.sub(old_timeline_nodes, new_timeline_nodes, css)

# Fix timeline dot positions
old_timeline_dots = r'\.timeline-container::after\s*\{[\s\S]*?\.timeline-container\.right-node::after\s*\{[^}]*\}'
new_timeline_dots = """.timeline-container::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: var(--bg-main);
    border: 2px solid var(--accent-cyan);
    top: 24px;
    border-radius: 50%;
    z-index: 10;
    transition: all 0.2s ease;
}

.timeline-container.left-node::after {
    right: -5px;
    left: auto;
}

.timeline-container.right-node::after {
    left: -5px;
    right: auto;
}"""
css = re.sub(old_timeline_dots, new_timeline_dots, css)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated css/style.css with compact hero and left/right alternating timeline.")
