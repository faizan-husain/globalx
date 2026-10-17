import urllib.request
import urllib.error

pages = [
    "",
    "index.html",
    "service.html",
    "portfolio.html",
    "contact.html",
    "about.html",
    "technologies.html",
    "pricing.html",
    "student-projects.html",
    "testimonials.html",
    "blog.html",
    "careers.html",
    "privacy-policy.html",
    "terms-conditions.html",
    "disclaimer.html",
    "404.html",
    "robots.txt",
    "sitemap.xml"
]

base = "http://127.0.0.1:8000/"

print("=== LOCAL SERVER ROUTE VERIFICATION ===")
for p in pages:
    url = base + p
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 Googlebot/2.1'})
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            data = resp.read()
            print(f"[{status}] OK: {url} ({len(data)} bytes)")
    except urllib.error.HTTPError as e:
        print(f"[{e.code}] ERR: {url}")
    except Exception as e:
        print(f"[FAILED] {url}: {e}")
