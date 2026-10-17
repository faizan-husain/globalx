import glob
import re

for f in sorted(glob.glob("*.html")):
    with open(f, "r", encoding="utf-8") as fp:
        content = fp.read()
    og_img = re.findall(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', content)
    tw_img = re.findall(r'<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']', content)
    print(f"{f} -> OG: {og_img} | TW: {tw_img}")
