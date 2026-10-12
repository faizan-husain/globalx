import glob
import re

classes = set()
for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    for m in re.finditer(r'class=["\']([^"\']+)["\']', content):
        for c in m.group(1).split():
            classes.add(c)

print('Total unique classes in HTML files:', len(classes))
bs_prefixes = ('col-', 'fa', 'bi-', 'border-', 'bg-', 'text-', 'p-', 'm-', 'g-', 'd-', 'justify-', 'align-')
custom = sorted([c for c in classes if not any(c.startswith(p) for p in bs_prefixes)])
print('Custom classes found:')
for i in range(0, len(custom), 5):
    print(', '.join(custom[i:i+5]))
