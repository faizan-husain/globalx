import os
import re

WORKSPACE = r"f:\GlobalX Company\globalx-main"

files = [
    "index.html",
    "about.html",
    "service.html",
    "portfolio.html",
    "contact.html",
    "technologies.html",
    "pricing.html",
    "student-projects.html",
    "testimonials.html",
    "blog.html",
    "careers.html",
    "privacy-policy.html",
    "terms-conditions.html",
    "disclaimer.html"
]

NEW_OG_IMG = "https://globalxsoftware.vercel.app/img/preview.webp"

for fname in files:
    fpath = os.path.join(WORKSPACE, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace og:image
    content = re.sub(
        r'<meta\s+property=["\']og:image["\']\s+content=["\'][^"\']+["\']>',
        f'<meta property="og:image" content="{NEW_OG_IMG}">\n    <meta property="og:image:secure_url" content="{NEW_OG_IMG}">\n    <meta property="og:image:type" content="image/webp">\n    <meta property="og:image:width" content="1062">\n    <meta property="og:image:height" content="752">',
        content
    )

    # Clean any duplicate og:image:width / height if they already existed
    # Replace existing width/height if duplicated right after
    content = re.sub(
        r'(<meta property="og:image:height" content="752">\n)\s*<meta property="og:image:width" content="[^"]+">\n\s*<meta property="og:image:height" content="[^"]+">',
        r'\1',
        content
    )

    # 2. Add <link rel="image_src" ...> right before </head> or after og:image if not present
    if 'rel="image_src"' not in content:
        content = content.replace(
            f'<meta property="og:image:height" content="752">',
            f'<meta property="og:image:height" content="752">\n    <link rel="image_src" href="{NEW_OG_IMG}">'
        )

    # 3. Replace twitter:image
    content = re.sub(
        r'<meta\s+name=["\']twitter:image["\']\s+content=["\'][^"\']+["\']>',
        f'<meta name="twitter:image" content="{NEW_OG_IMG}">',
        content
    )

    # 4. In schema (e.g. index.html)
    content = content.replace(
        '"image": "https://globalxsoftware.vercel.app/img/logo-trans.png"',
        f'"image": "{NEW_OG_IMG}"'
    )

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Updated {fname}")

print("All files updated successfully.")
