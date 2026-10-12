/**
 * GlobalX xAI-Style Autonomous Live Coding Animation Engine
 * Automatically executes code line-by-line like a video playback.
 * The terminal card autonomously types code, updates progress & tasks,
 * and only the internal code container auto-scrolls down smoothly.
 * Does NOT depend on or modify page scroll.
 */

(function () {
    'use strict';

    // Initial lines rendered at start of each execution loop
    const INITIAL_LINES = [
        { num: 40, type: 'normal', html: '<span class="syn-comment">// GlobalX Enterprise Core v4.2 - Distributed Session Engine</span>' },
        { num: 41, type: 'normal', html: '<span class="syn-kw">import</span> { <span class="syn-var">tenantContext</span>, <span class="syn-fn">verifyToken</span> } <span class="syn-kw">from</span> <span class="syn-str">"@globalx/core-auth"</span>;' },
        { num: 42, type: 'normal', html: '<span class="syn-kw">const</span> session = <span class="syn-kw">await</span> <span class="syn-fn">getGlobalXSession</span>(req);' },
        { num: 43, type: 'green', html: '+ <span class="syn-kw">if</span> (!session?.tenantId) <span class="syn-kw">return</span> res.<span class="syn-fn">status</span>(401).<span class="syn-fn">json</span>({ error: <span class="syn-str">"Unauthorized"</span> });' }
    ];

    const INITIAL_TASKS = [
        { name: 'GlobalX multi-tenant routing engine', status: 'running' },
        { name: 'Enterprise session token verification', status: 'running' }
    ];

    // Progressive actions executed chronologically like video frames
    const ACTIONS = [
        {
            delay: 850,
            pct: 19.80,
            thought: 'Thought for 2.2s',
            prompt: 'Evaluating distributed token-bucket rate limiter...',
            newLine: { num: 44, type: 'green', html: '+ <span class="syn-kw">const</span> rateLimit = <span class="syn-kw">await</span> <span class="syn-fn">checkGlobalXRateLimit</span>(req.ip, session.tenantId);' }
        },
        {
            delay: 750,
            pct: 26.40,
            thought: 'Thought for 2.7s',
            newLine: { num: 45, type: 'green', html: '+ <span class="syn-kw">if</span> (!rateLimit.allowed) <span class="syn-kw">throw</span> <span class="syn-kw">new</span> <span class="syn-fn">QuotaExceededError</span>(<span class="syn-str">"GlobalX SLA quota exceeded"</span>);' }
        },
        {
            delay: 800,
            pct: 32.70,
            thought: 'Thought for 3.1s',
            prompt: 'Removing deprecated legacy session handler...',
            newLine: { num: 46, type: 'red', html: '- <span class="syn-kw">return</span> <span class="syn-fn">legacyHandler</span>();' },
            tasks: [
                { name: 'GlobalX multi-tenant routing engine', status: 'done' },
                { name: 'Enterprise session token verification', status: 'running' },
                { name: 'Distributed token-bucket rate limiter', status: 'running' }
            ]
        },
        {
            delay: 700,
            pct: 39.50,
            thought: 'Thought for 3.5s',
            prompt: 'Resolving validated tenant security context...',
            newLine: { num: 47, type: 'green', html: '+ <span class="syn-kw">const</span> userContext = <span class="syn-kw">await</span> <span class="syn-fn">resolveTenantContext</span>(session);' }
        },
        {
            delay: 800,
            pct: 46.20,
            thought: 'Thought for 4.0s',
            newLine: { num: 48, type: 'green', html: '+ <span class="syn-kw">const</span> auditPayload = <span class="syn-fn">signEnterpriseAudit</span>({ userContext, timestamp: Date.<span class="syn-fn">now</span>() });' },
            tasks: [
                { name: 'GlobalX multi-tenant routing engine', status: 'done' },
                { name: 'Enterprise session token verification', status: 'done' },
                { name: 'Distributed token-bucket rate limiter', status: 'running' },
                { name: 'Zero-trust schema sanitizer & encryption', status: 'running' }
            ]
        },
        {
            delay: 850,
            pct: 53.00,
            thought: 'Thought for 4.7s',
            prompt: 'Enforcing strict zero-trust validation schema...',
            newLine: { num: 49, type: 'normal', html: '<span class="syn-kw">const</span> schema = GlobalXSchema.<span class="syn-fn">strictObject</span>({' }
        },
        {
            delay: 650,
            pct: 59.80,
            thought: 'Thought for 5.1s',
            newLine: { num: 50, type: 'green', html: '+   clusterRegion: z.<span class="syn-fn">enum</span>([<span class="syn-str">"ap-south-1"</span>, <span class="syn-str">"us-east-1"</span>, <span class="syn-str">"eu-west-1"</span>]),' }
        },
        {
            delay: 750,
            pct: 66.50,
            thought: 'Thought for 5.6s',
            prompt: 'Injecting distributed Redis cluster cache layer...',
            newLine: { num: 51, type: 'green', html: '+   payload: z.<span class="syn-fn">record</span>(z.<span class="syn-fn">unknown</span>()).<span class="syn-fn">refine</span>(auditSignature)' },
            tasks: [
                { name: 'Distributed token-bucket rate limiter', status: 'done' },
                { name: 'Zero-trust schema sanitizer & encryption', status: 'done' },
                { name: 'PostgreSQL read-replica connection pool', status: 'running' },
                { name: 'Redis L2 cluster cache synchronization', status: 'running' }
            ]
        },
        {
            delay: 700,
            pct: 73.20,
            thought: 'Thought for 6.0s',
            newLine: { num: 52, type: 'green', html: '+ <span class="syn-kw">const</span> cacheKey = <span class="syn-str">`tenant:${session.tenantId}:config`</span>;' }
        },
        {
            delay: 750,
            pct: 79.80,
            thought: 'Thought for 6.4s',
            prompt: 'Synchronizing Redis L2 cluster cache with database...',
            newLine: { num: 53, type: 'green', html: '+ <span class="syn-kw">let</span> config = <span class="syn-kw">await</span> redisCluster.<span class="syn-fn">get</span>(cacheKey);' }
        },
        {
            delay: 800,
            pct: 85.50,
            thought: 'Thought for 6.9s',
            newLine: { num: 54, type: 'green', html: '+ <span class="syn-kw">if</span> (!config) config = <span class="syn-kw">await</span> pgPool.replica.<span class="syn-fn">queryTenantConfig</span>(session.tenantId);' },
            tasks: [
                { name: 'Zero-trust schema sanitizer & encryption', status: 'done' },
                { name: 'PostgreSQL read-replica connection pool', status: 'done' },
                { name: 'Redis L2 cluster cache synchronization', status: 'done' },
                { name: 'OpenTelemetry distributed trace spans', status: 'running' },
                { name: 'Automated failover circuit breaker', status: 'running' }
            ]
        },
        {
            delay: 750,
            pct: 91.20,
            thought: 'Thought for 7.3s',
            prompt: 'Emitting OpenTelemetry distributed trace spans...',
            newLine: { num: 55, type: 'green', html: '+ <span class="syn-kw">const</span> span = tracer.<span class="syn-fn">startSpan</span>(<span class="syn-str">"GlobalX.ExecuteWorkflow"</span>);' }
        },
        {
            delay: 800,
            pct: 95.80,
            thought: 'Thought for 7.7s',
            prompt: 'Dispatching workflow event to cluster execution mesh...',
            newLine: { num: 56, type: 'green', html: '+ <span class="syn-kw">await</span> workflowEngine.<span class="syn-fn">dispatch</span>({ payload: validatedPayload, config });' },
            tasks: [
                { name: 'PostgreSQL read-replica connection pool', status: 'done' },
                { name: 'Redis L2 cluster cache synchronization', status: 'done' },
                { name: 'OpenTelemetry distributed trace spans', status: 'done' },
                { name: 'Automated failover circuit breaker', status: 'done' },
                { name: 'Turnkey zero-downtime cluster deployment', status: 'completed' }
            ]
        },
        {
            delay: 850,
            pct: 98.40,
            thought: 'Thought for 8.0s',
            prompt: 'Locking enterprise cluster configuration...',
            newLine: { num: 57, type: 'green', html: '+ <span class="syn-kw">export const</span> GlobalXCore = Object.<span class="syn-fn">freeze</span>({ status: <span class="syn-str">"ONLINE"</span>, uptime: <span class="syn-str">"99.99%"</span> });' }
        },
        {
            delay: 900,
            pct: 100.00,
            thought: 'Completed in 8.2s',
            prompt: 'Build compiled cleanly. Production cluster live: 0 errors.',
            newLine: { num: 58, type: 'normal', html: 'console.<span class="syn-fn">log</span>(<span class="syn-str">"GlobalX Enterprise Engine deployed successfully."</span>);' }
        }
    ];

    // DOM Elements Cache
    let dom = {
        card: null,
        projectPath: null,
        progressFill: null,
        progressText: null,
        tasksContainer: null,
        thoughtText: null,
        filePath: null,
        codeEditor: null,
        promptText: null
    };

    let currentActionIndex = 0;
    let timerId = null;
    let isPaused = false;

    function initDOM() {
        dom.card = document.getElementById('xaiTerminal');
        if (!dom.card) return false;

        dom.projectPath = document.getElementById('xaiProjectPath');
        dom.progressFill = document.getElementById('xaiProgressFill');
        dom.progressText = document.getElementById('xaiProgressText');
        dom.tasksContainer = document.getElementById('xaiTasksContainer');
        dom.thoughtText = document.getElementById('xaiThoughtText');
        dom.filePath = document.getElementById('xaiFilePath');
        dom.codeEditor = document.getElementById('xaiCodeEditor');
        dom.promptText = document.getElementById('xaiPromptText');

        return true;
    }

    function renderTasks(tasks) {
        if (!dom.tasksContainer) return;
        const displayTasks = tasks.slice(-2);
        dom.tasksContainer.innerHTML = displayTasks.map(t => {
            let badgeClass = 'badge-running';
            if (t.status === 'done') badgeClass = 'badge-done';
            else if (t.status === 'completed') badgeClass = 'badge-completed';

            return `<div class="xai-task-line">
                <span class="xai-pipe">|</span>
                <span class="xai-task-name">${t.name}</span>
                <span class="xai-badge ${badgeClass}">[${t.status}]</span>
            </div>`;
        }).join('');
    }

    function renderInitialState() {
        if (dom.progressText) dom.progressText.textContent = '13.35%';
        if (dom.progressFill) dom.progressFill.style.width = '13.35%';
        if (dom.thoughtText) dom.thoughtText.textContent = 'Thought for 1.8s';
        if (dom.projectPath) dom.projectPath.textContent = 'globalx/enterprise-core';
        if (dom.filePath) dom.filePath.textContent = 'src/globalx/enterprise/authMiddleware.ts';
        if (dom.promptText) dom.promptText.textContent = 'Initializing multi-tenant routing and session guard...';

        renderTasks(INITIAL_TASKS);

        if (dom.codeEditor) {
            dom.codeEditor.innerHTML = INITIAL_LINES.map(line => {
                let diffClass = '';
                if (line.type === 'green') diffClass = 'xai-diff-green';
                else if (line.type === 'red') diffClass = 'xai-diff-red';

                return `<div class="xai-code-line ${diffClass}">
                    <span class="xai-line-num">${line.num}</span>
                    <span class="xai-line-content">${line.html}</span>
                </div>`;
            }).join('');

            // Reset scroll to top
            dom.codeEditor.scrollTop = 0;
        }

        currentActionIndex = 0;
    }

    function appendCodeLine(line) {
        if (!dom.codeEditor) return;

        let diffClass = '';
        if (line.type === 'green') diffClass = 'xai-diff-green';
        else if (line.type === 'red') diffClass = 'xai-diff-red';

        const lineEl = document.createElement('div');
        lineEl.className = `xai-code-line ${diffClass} new-line`;
        lineEl.innerHTML = `
            <span class="xai-line-num">${line.num}</span>
            <span class="xai-line-content">${line.html}</span>
        `;

        dom.codeEditor.appendChild(lineEl);

        // Smoothly auto-scroll only the internal code container
        dom.codeEditor.scrollTo({
            top: dom.codeEditor.scrollHeight,
            behavior: 'smooth'
        });
    }

    function runNextAction() {
        if (isPaused) {
            // Check again in 300ms if paused
            timerId = setTimeout(runNextAction, 300);
            return;
        }

        if (currentActionIndex >= ACTIONS.length) {
            // Execution reached 100%. Hold for 3.8s before restarting the loop
            timerId = setTimeout(() => {
                if (!isPaused) {
                    renderInitialState();
                    scheduleNext(1200);
                } else {
                    timerId = setTimeout(runNextAction, 300);
                }
            }, 3800);
            return;
        }

        const action = ACTIONS[currentActionIndex];

        // 1. Update progress percentage & bar
        if (action.pct !== undefined) {
            const pctStr = action.pct.toFixed(2) + '%';
            if (dom.progressText) dom.progressText.textContent = pctStr;
            if (dom.progressFill) dom.progressFill.style.width = pctStr;
        }

        // 2. Update thought if provided
        if (action.thought && dom.thoughtText) {
            dom.thoughtText.textContent = action.thought;
        }

        // 3. Update prompt if provided
        if (action.prompt && dom.promptText) {
            dom.promptText.textContent = action.prompt;
        }

        // 4. Update tasks if provided
        if (action.tasks) {
            renderTasks(action.tasks);
        }

        // 5. Append new code line & smoothly scroll editor
        if (action.newLine) {
            appendCodeLine(action.newLine);
        }

        currentActionIndex++;
        const nextDelay = action.delay || 750;
        scheduleNext(nextDelay);
    }

    function scheduleNext(delay) {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(runNextAction, delay);
    }

    function setupHoverPause() {
        if (!dom.card) return;

        // Hover over terminal card pauses the live auto-typing so user can inspect or copy code
        dom.card.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        dom.card.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    }

    function init() {
        if (!initDOM()) return;

        setupHoverPause();
        renderInitialState();

        // Start autonomous live coding after a brief initial delay
        scheduleNext(1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
