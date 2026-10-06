with open('src/renderer.js', 'r') as f:
    js = f.read()

# 1. Wrap event listener attachments in a function
js = js.replace("""// Track active pane via focus events on webviews
paneContainers.forEach((p, i) => {
    const wv = $(p.webviewId);
    if (!wv) return;
    wv.addEventListener('focus', () => { activePaneIndex = i; });
    // Webview clicks bubble through host; use mouseenter as a hint
    wv.addEventListener('mouseenter', () => { activePaneIndex = i; });
});""", "")

js = js.replace("""// ---------- Error / retry overlays ----------
paneContainers.forEach(({ webviewId, errorId }) => {
    const wv = $(webviewId);
    const overlay = $(errorId);
    if (!wv || !overlay) return;
    wv.addEventListener('did-fail-load', (e) => {
        // -3 is ERR_ABORTED (navigation aborted), often benign — ignore.
        if (e.errorCode === -3) return;
        overlay.classList.add('show');
        const body = overlay.querySelector('.err-body');
        if (body && e.errorDescription) {
            body.textContent = `${e.errorDescription}. Check your connection or try again.`;
        }
    });
    wv.addEventListener('did-finish-load', () => overlay.classList.remove('show'));
    wv.addEventListener('render-process-gone', (e) => {
        overlay.classList.add('show');
        const body = overlay.querySelector('.err-body');
        if (body) {
            body.textContent = `Webview crashed (${e.reason || 'unknown'}). Please reload.`;
        }
    });

    const retryBtn = overlay.querySelector('[data-retry]');
    if (retryBtn) retryBtn.addEventListener('click', () => wv.reload());
});""", "")

js = js.replace("""// ---------- Loading state ----------
paneContainers.forEach(({ webviewId }) => {
    const wv = $(webviewId);
    if (!wv) return;
    wv.addEventListener('did-start-loading', () => wv.classList.add('loading'));
    wv.addEventListener('did-stop-loading', () => wv.classList.remove('loading'));
});""", "")

attach_fn = """function attachWebviewListeners() {
    paneContainers.forEach((p, i) => {
        const wv = $(p.webviewId);
        if (!wv) return;
        
        wv.addEventListener('focus', () => { activePaneIndex = i; });
        wv.addEventListener('mouseenter', () => { activePaneIndex = i; });
        
        const overlay = $(p.errorId);
        if (overlay) {
            wv.addEventListener('did-fail-load', (e) => {
                if (e.errorCode === -3) return;
                overlay.classList.add('show');
                const body = overlay.querySelector('.err-body');
                if (body && e.errorDescription) body.textContent = `${e.errorDescription}. Check your connection or try again.`;
            });
            wv.addEventListener('did-finish-load', () => overlay.classList.remove('show'));
            wv.addEventListener('render-process-gone', (e) => {
                overlay.classList.add('show');
                const body = overlay.querySelector('.err-body');
                if (body) body.textContent = `Webview crashed (${e.reason || 'unknown'}). Please reload.`;
            });
            const retryBtn = overlay.querySelector('[data-retry]');
            if (retryBtn) retryBtn.addEventListener('click', () => wv.reload());
        }
        
        wv.addEventListener('did-start-loading', () => wv.classList.add('loading'));
        wv.addEventListener('did-stop-loading', () => wv.classList.remove('loading'));
    });
}
"""

js = js.replace("// ---------- URL Drop Capture ----------", attach_fn + "\n// ---------- URL Drop Capture ----------")

# 2. Add initWebviews call inside the main init block
init_block = """    try {
        const s = await window.api.settingsGetAll();"""
        
new_init = """    try {
        const s = await window.api.settingsGetAll();
        const activeProfile = s.activeProfile || 'default';
        const partition = activeProfile === 'default' ? 'persist:gemini-notebook' : `persist:gemini-notebook-${activeProfile}`;
        
        paneContainers.forEach(p => {
            const wv = document.createElement('webview');
            wv.id = p.webviewId;
            wv.setAttribute('src', 'https://notebook.google.com/');
            wv.setAttribute('partition', partition);
            wv.setAttribute('preload', './webview-preload.js');
            wv.setAttribute('allowpopups', 'true');
            p.container.insertBefore(wv, $(p.errorId));
        });
        
        attachWebviewListeners();
        
        $('profile-select').value = activeProfile;
        $('profile-select').addEventListener('change', (e) => {
            window.api.settingsSet('activeProfile', e.target.value);
            // Must reload the app to apply partition changes
            if (confirm("Profile changed. The app needs to reload. Continue?")) {
                window.api.windowAction('reload');
            }
        });
"""
js = js.replace(init_block, new_init)

with open('src/renderer.js', 'w') as f:
    f.write(js)
