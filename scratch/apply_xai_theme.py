import re

# 1. Update css/style.css with x.ai styling and live coding card CSS
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update font import to include JetBrains Mono
old_font = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700&display=swap');"
new_font = "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700&display=swap');"
css = css.replace(old_font, new_font)

# Update :root
css = re.sub(r'--dark-bg:\s*#[0-9a-fA-F]+;', '--dark-bg: #000000;', css)
css = re.sub(r'--dark-bg-alt:\s*#[0-9a-fA-F]+;', '--dark-bg-alt: #050507;', css)
css = re.sub(r'--glass-bg:\s*[^;]+;', '--glass-bg: #090a0d;', css)
css = re.sub(r'--glass-border:\s*[^;]+;', '--glass-border: rgba(255, 255, 255, 0.08);', css)
css = re.sub(r'--glass-border-hover:\s*[^;]+;', '--glass-border-hover: rgba(255, 255, 255, 0.2);', css)
css = re.sub(r'--text-muted:\s*#[0-9a-fA-F]+;', '--text-muted: #8e959e;', css)

# Section subtitle xAI luxury monospace tag
old_sec_subtitle = """.section-subtitle {
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--primary);
    margin-bottom: 12px;
    display: block;
}"""

new_sec_subtitle = """.section-subtitle {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #B7CBD8;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.09);
    padding: 5px 16px;
    border-radius: 9999px;
    margin-bottom: 15px;
    display: inline-block;
}"""
css = css.replace(old_sec_subtitle, new_sec_subtitle)

# Luxury Buttons
btn_replacement = """/* Luxury xAI Pill Buttons */
.btn-gradient {
    background: #ffffff !important;
    color: #000000 !important;
    font-weight: 600 !important;
    font-size: 14.5px !important;
    letter-spacing: -0.01em;
    border: none !important;
    border-radius: 9999px !important;
    padding: 13px 32px !important;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.15) !important;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.btn-gradient:hover {
    background: #ffffff !important;
    color: #000000 !important;
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 0 35px rgba(255, 255, 255, 0.35) !important;
}

.btn-outline-glow {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    color: #f4f4f5 !important;
    font-weight: 500 !important;
    font-size: 14.5px !important;
    border-radius: 9999px !important;
    padding: 12px 30px !important;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.btn-outline-glow:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.45) !important;
    color: #ffffff !important;
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.15) !important;
}

.consultation-btn {
    border-radius: 9999px !important;
    background: #ffffff !important;
    color: #000000 !important;
    font-weight: 600 !important;
    padding: 9px 22px !important;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.consultation-btn:hover {
    background: #ffffff !important;
    color: #000000 !important;
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.3) !important;
}
"""

# Replace button declarations in css
old_btn_block = re.search(r'/\* Custom Gradient Button \*/[\s\S]*?\.btn-outline-glow:hover\s*\{[^}]*\}', css)
if old_btn_block:
    css = css[:old_btn_block.start()] + btn_replacement + css[old_btn_block.end():]

# Luxury xAI Terminal Card CSS
xai_card_css = """
/* =========================================
   xAI LIVE CODING CARD & TERMINAL ENGINE
========================================= */
.xai-terminal-window {
    background: #0c0d10;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 16px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    overflow: hidden;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;
    max-width: 490px;
    position: relative;
    z-index: 10;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.xai-terminal-window:hover {
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.95), 0 0 30px rgba(183, 203, 216, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.xai-terminal-header {
    background: #090a0d;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.xai-dots {
    display: flex;
    align-items: center;
    gap: 7px;
}

.xai-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    display: inline-block;
}

.dot-red { background: #ff5f56; box-shadow: 0 0 6px rgba(255, 95, 86, 0.4); }
.dot-yellow { background: #ffbd2e; box-shadow: 0 0 6px rgba(255, 189, 46, 0.4); }
.dot-green { background: #27c93f; box-shadow: 0 0 6px rgba(39, 201, 63, 0.4); }

.xai-tab {
    font-size: 12px;
    color: #8b949e;
    font-weight: 500;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
}

.xai-progress-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
}

.xai-progress-bar {
    width: 55px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.xai-progress-fill {
    height: 100%;
    width: 13.35%;
    background: #ffffff;
    border-radius: 3px;
    transition: width 0.6s ease;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}

.xai-progress-text {
    font-size: 11px;
    color: #8b949e;
    font-weight: 600;
}

.xai-terminal-body {
    padding: 16px 20px 14px 20px;
    color: #e6edf3;
    font-size: 12.5px;
    min-height: 250px;
}

.xai-task-line {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    font-size: 12.5px;
    transition: opacity 0.3s ease;
}

.xai-pipe {
    color: #3fb950;
    font-weight: 700;
}

.xai-task-name {
    color: #c9d1d9;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.xai-badge {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
}

.badge-running {
    color: #B7CBD8;
    animation: xaiPulse 1.4s ease-in-out infinite;
}

.badge-done {
    color: #3fb950;
}

@keyframes xaiPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
}

.xai-thought-line {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0 12px 0;
    color: #8b949e;
    font-size: 12.5px;
}

.xai-diamond {
    color: #a371f7;
    font-size: 10px;
}

.xai-edit-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 13px;
}

.xai-edit-label {
    color: #ffffff;
    font-weight: 700;
}

.xai-file-path {
    color: #8b949e;
}

/* Code Editor Lines */
.xai-code-editor {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
}

.xai-code-line {
    display: flex;
    align-items: center;
    padding: 2px 6px;
    line-height: 1.55;
    font-size: 12.5px;
    transition: background-color 0.2s ease;
    border-radius: 4px;
    margin-bottom: 1px;
}

.xai-line-num {
    width: 28px;
    color: #484f58;
    text-align: right;
    margin-right: 14px;
    user-select: none;
    flex-shrink: 0;
}

.xai-line-content {
    flex: 1;
    color: #e6edf3;
    white-space: pre;
    font-family: inherit;
}

/* Diff highlights matching screenshot */
.xai-diff-green {
    background: rgba(46, 160, 67, 0.16);
    border-left: 2px solid #3fb950;
}
.xai-diff-green .xai-line-num {
    color: #3fb950;
}

.xai-diff-red {
    background: rgba(248, 81, 73, 0.18);
    border-left: 2px solid #f85149;
}
.xai-diff-red .xai-line-num {
    color: #f85149;
}

/* Syntax token colors */
.syn-kw { color: #ff7b72; font-weight: 600; }
.syn-fn { color: #d2a8ff; }
.syn-str { color: #a5d6ff; }
.syn-var { color: #79c0ff; }
.syn-comment { color: #8b949e; font-style: italic; }

/* Terminal Footer Prompt */
.xai-terminal-footer {
    background: #090a0d;
    padding: 12px 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: #c9d1d9;
}

.xai-prompt-arrow {
    color: #79c0ff;
    font-weight: 700;
}

.xai-prompt-input {
    color: #e6edf3;
    font-family: inherit;
}

.xai-cursor {
    display: inline-block;
    width: 7px;
    height: 14px;
    background: #79c0ff;
    margin-left: 2px;
    animation: xaiBlink 1s infinite;
}

@keyframes xaiBlink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
}
"""

if '.xai-terminal-window' not in css:
    css = css + '\n' + xai_card_css

with open('css/style.css', 'wb') as f:
    f.write(css.replace('\r\n', '\n').encode('utf-8'))

print("Updated css/style.css with xAI styling and live terminal CSS.")
