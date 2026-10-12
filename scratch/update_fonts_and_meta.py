import glob
import re

html_files = glob.glob('*.html')

new_font_block = """    <!-- Google Web Fonts (Inter & Geist Mono) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">"""

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match any existing google web fonts link or font block
    font_regex = r'<!--\s*Google Web Fonts[\s\S]*?-->[\s\S]*?<link[^>]*fonts\.googleapis\.com[^>]*rel=["\']stylesheet["\']>'
    
    if re.search(font_regex, content):
        content = re.sub(font_regex, new_font_block, content)
    elif 'fonts.googleapis.com' in content:
        # direct link without header comment
        direct_link_regex = r'<link[^>]*preconnect[^>]*fonts\.gstatic\.com[^>]*>\s*<link[^>]*fonts\.googleapis\.com[^>]*rel=["\']stylesheet["\']>'
        content = re.sub(direct_link_regex, new_font_block, content)
    else:
        # insert before </head> or before icon fonts
        if '<!-- Icon Font Stylesheet -->' in content:
            content = content.replace('<!-- Icon Font Stylesheet -->', new_font_block + '\n\n    <!-- Icon Font Stylesheet -->')
        elif '</head>' in content:
            content = content.replace('</head>', new_font_block + '\n</head>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated fonts in {file_path}")

print("All HTML files updated with Inter & Geist Mono.")
