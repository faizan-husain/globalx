extra_css = """
/* ==============================================================================
   21. SECONDARY LUXURY COMPONENTS (BLOG, CAREERS, 404, TELEMETRY LABELS)
   ============================================================================== */

/* Capability Tag Technical Index */
.capability-tag {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    text-transform: uppercase;
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    transition: color 0.2s ease;
}

.glass-card:hover .capability-tag {
    color: var(--accent-cyan);
}

/* Client Logos & Vendor Carousel */
.client-logo-item {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.45;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.client-logo-item:hover {
    opacity: 0.95;
    transform: translateY(-1px);
}

.client-logo-text {
    font-family: var(--font-mono);
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.14em;
    color: var(--text-secondary);
}

/* Blog Component */
.blog-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    overflow: hidden;
    height: 100%;
    transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
}

.blog-card:hover {
    border-color: var(--border-hover);
    background: var(--bg-elevated);
    transform: translateY(-2px);
}

.blog-img-placeholder {
    height: 200px;
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-subtle);
}

.blog-meta {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--text-muted);
    margin-bottom: 12px;
    display: flex;
    gap: 14px;
    letter-spacing: 0.04em;
}

/* Careers Job Cards */
.job-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-subtle);
    border-left: 3px solid var(--accent-cyan);
    border-radius: var(--radius-sm);
    padding: 24px;
    margin-bottom: 18px;
    transition: all 0.25s ease;
}

.job-card:hover {
    border-color: var(--border-hover);
    border-left-color: var(--accent-cyan);
    background: var(--bg-elevated);
    transform: translateY(-1px);
}

.job-card.job-design {
    border-left-color: #A1A1AA;
}

/* 404 Error Page */
.error-container {
    min-height: 75vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    background: var(--bg-main);
}

.error-code {
    font-family: var(--font-mono);
    font-size: clamp(5rem, 14vw, 10rem);
    font-weight: 500;
    line-height: 1;
    color: #FFFFFF;
    letter-spacing: -0.05em;
    margin-bottom: 14px;
}

/* Alerts & Notifications */
.alert-premium {
    background: var(--bg-secondary);
    border: 1px solid var(--border-subtle);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    font-size: 13.5px;
    padding: 14px 18px;
}

.alert-premium-success {
    border-left: 3px solid #10B981;
}

.alert-premium-error {
    border-left: 3px solid #EF4444;
}

/* Meta tags & Metadata elements */
.meta-dot {
    color: var(--text-faint);
}

.meta-tag, .meta-tech {
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 11px;
}
"""

with open('css/style.css', 'a', encoding='utf-8') as f:
    f.write(extra_css)

print("Appended secondary component styles to css/style.css")
