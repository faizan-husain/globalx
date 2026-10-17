import os
import glob
import re

WORKSPACE = r"f:\GlobalX Company\globalx-main"
html_files = sorted(glob.glob(os.path.join(WORKSPACE, "*.html")))

missing_alt = []
total_imgs = 0

for filepath in html_files:
    fname = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    imgs = re.findall(r'<img\s+[^>]*>', content, re.IGNORECASE)
    total_imgs += len(imgs)
    for tag in imgs:
        if not re.search(r'\balt=["\'][^"\']*["\']', tag, re.IGNORECASE):
            missing_alt.append((fname, tag))

print(f"Total img tags audited: {total_imgs}")
if missing_alt:
    print(f"Images missing alt attribute: {len(missing_alt)}")
    for f, t in missing_alt:
        print(f"  In {f}: {t}")
else:
    print("PASS: All <img> tags have alt attributes!")
