import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update .navbar and .navbar.sticky-top definitions
old_navbar = r'\.navbar\s*\{[\s\S]*?right:\s*0;\s*\}'
new_navbar = """.navbar,
.navbar.sticky-top {
    background: rgba(5, 5, 5, 0.85) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-bottom: 1px solid var(--border-subtle) !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    min-height: 58px;
    transition: background 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease !important;
    z-index: 99999 !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
}"""
css = re.sub(old_navbar, new_navbar, css)

# 2. Update .navbar.sticky-top scrolled styling
old_sticky = r'\.navbar\.sticky-top\s*\{[\s\S]*?box-shadow:[^;]+;\s*\}'
new_sticky = """.navbar.sticky-top,
.navbar.scrolled {
    background: rgba(5, 5, 5, 0.96) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.14) !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9) !important;
}"""
css = re.sub(old_sticky, new_sticky, css)

# 3. Update Consultation Popup (Desktop)
old_popup = r'\.consultation-popup\s*\{[\s\S]*?display:\s*none;\s*\}'
new_popup = """.consultation-popup {
    position: fixed;
    right: 26px;
    bottom: 85px;
    width: 330px;
    max-width: 90vw;
    background: #09090C !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    border-radius: var(--radius-md) !important;
    padding: 20px 22px !important;
    z-index: 99998 !important;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
    display: none;
    box-sizing: border-box !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
}

.consultation-popup h5 {
    color: #FFFFFF !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    margin-bottom: 6px !important;
    letter-spacing: -0.01em !important;
}

.consultation-popup p {
    color: var(--text-secondary) !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
    margin-bottom: 16px !important;
}

.popup-actions {
    display: flex !important;
    gap: 8px !important;
    align-items: center !important;
}

.popup-actions .btn {
    height: 38px !important;
    font-size: 13px !important;
    font-weight: 550 !important;
    border-radius: var(--radius-sm) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 14px !important;
    text-decoration: none !important;
}"""
css = re.sub(old_popup, new_popup, css)

# 4. Clean mobile media query section for navbar and popup
mobile_fixes = """
/* ==============================================================================
   MOBILE & TABLET FIXES (STICKY NAVBAR & CONSULTATION POPUP FIT)
   ============================================================================== */
@media (max-width: 991.98px) {
    .navbar,
    .navbar.sticky-top {
        padding: 10px 14px !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 99999 !important;
    }

    .navbar-collapse {
        background: #08080A !important;
        border: 1px solid var(--border-subtle) !important;
        border-radius: var(--radius-md) !important;
        margin-top: 10px !important;
        padding: 6px 0 12px 0 !important;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.98), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        max-height: calc(100vh - 75px) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
}

@media (max-width: 767.98px) {
    /* Consultation Popup mobile fit - 100% screen friendly without cutoff */
    .consultation-popup {
        left: 14px !important;
        right: 14px !important;
        bottom: 85px !important;
        width: auto !important;
        max-width: calc(100vw - 28px) !important;
        padding: 16px 18px !important;
        border-radius: var(--radius-md) !important;
        box-sizing: border-box !important;
    }

    .consultation-popup h5 {
        font-size: 15px !important;
        margin-bottom: 6px !important;
    }

    .consultation-popup p {
        font-size: 12.5px !important;
        margin-bottom: 14px !important;
        line-height: 1.45 !important;
    }

    .popup-actions {
        flex-direction: row !important;
        gap: 8px !important;
        width: 100% !important;
    }

    .popup-actions .btn {
        flex: 1 1 50% !important;
        height: 38px !important;
        font-size: 12.5px !important;
        padding: 0 8px !important;
        white-space: nowrap !important;
    }
}
"""

css += mobile_fixes

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Successfully updated style.css with sticky navbar & consultation popup fixes.")
