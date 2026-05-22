function openLink(url) {
    if (window.api && window.api.openExternal) window.api.openExternal(url);
}

const $ = (id) => document.getElementById(id);

// ---------- Window controls ----------
$('min-btn').addEventListener('click', () => window.api && window.api.windowAction('minimize'));
$('max-btn').addEventListener('click', () => window.api && window.api.windowAction('maximize'));
$('close-btn').addEventListener('click', () => window.api && window.api.windowAction('close'));

// ---------- Opacity ----------
const opacitySlider = $('opacity-slider');
if (window.api) {
    window.api.getOpacity().then(v => { if (typeof v === 'number') opacitySlider.value = v; });
    opacitySlider.addEventListener('input', (e) => window.api.setOpacity(parseFloat(e.target.value)));
}

// ---------- Pane manager (1 / 2 / 3 panes) ----------
const paneContainers = [
    { container: $('view1-container'), webviewId: 'notebookView1', errorId: 'err1' },
    { container: $('view2-container'), webviewId: 'notebookView2', errorId: 'err2' },
    { container: $('view3-container'), webviewId: 'notebookView3', errorId: 'err3' },
];
let paneCount = 1;
let activePaneIndex = 0;

const paneToggle = $('pane-toggle');

function applyPaneCount(n) {
    paneCount = Math.max(1, Math.min(3, n));
    paneContainers.forEach((p, i) => {
        if (i < paneCount) p.container.classList.remove('hidden');
        else p.container.classList.add('hidden');
    });
    paneToggle.textContent = `Panes: ${paneCount}`;
    if (activePaneIndex >= paneCount) activePaneIndex = 0;
}

paneToggle.addEventListener('click', () => {
    const next = paneCount === 3 ? 1 : paneCount + 1;
    applyPaneCount(next);
    if (window.api) window.api.settingsSet('paneCount', next);
});

// Track active pane via focus events on webviews
paneContainers.forEach((p, i) => {
    const wv = $(p.webviewId);
    if (!wv) return;
    wv.addEventListener('focus', () => { activePaneIndex = i; });
    // Webview clicks bubble through host; use mouseenter as a hint
    wv.addEventListener('mouseenter', () => { activePaneIndex = i; });
});

function getActiveWebview() {
    const idx = activePaneIndex < paneCount ? activePaneIndex : 0;
    return $(paneContainers[idx].webviewId);
}

// ---------- Error / retry overlays ----------
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
});

document.querySelectorAll('[data-retry]').forEach(btn => {
    btn.addEventListener('click', () => {
        const wv = $(btn.getAttribute('data-retry'));
        if (wv && wv.reload) wv.reload();
    });
});
document.querySelectorAll('[data-open-browser]').forEach(btn => {
    btn.addEventListener('click', () => openLink('https://notebooklm.google.com/'));
});

// ---------- Always-on-top ----------
const pinToggle = $('pin-toggle');
if (window.api) {
    window.api.getAlwaysOnTop().then(on => updatePinUI(!!on));
    pinToggle.addEventListener('click', async () => {
        const cur = pinToggle.classList.contains('active');
        const next = await window.api.setAlwaysOnTop(!cur);
        updatePinUI(!!next);
    });
}
function updatePinUI(on) {
    pinToggle.classList.toggle('active', on);
    pinToggle.textContent = on ? '📌 Pinned' : '📌 Pin';
}

// ---------- Theme ----------
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    $('theme-toggle').textContent = theme === 'dark' ? '☀' : '🌙';
}
if (window.api) {
    window.api.onTheme(applyTheme);
}
$('theme-toggle').addEventListener('click', async () => {
    if (!window.api) return;
    const all = await window.api.settingsGetAll();
    // Cycle system -> light -> dark -> system
    const next = all.theme === 'system' ? 'light' : all.theme === 'light' ? 'dark' : 'system';
    await window.api.setTheme(next);
    if (next !== 'system') applyTheme(next);
});

// ---------- Auto-launch ----------
const autoLaunchToggle = $('autoLaunchToggle');
if (window.api) {
    window.api.getAutoLaunch().then(enabled => { autoLaunchToggle.checked = enabled; });
    autoLaunchToggle.addEventListener('change', (e) => window.api.setAutoLaunch(e.target.checked));
}

// ---------- Webview IPC (notebook events) ----------
function setupWebviewEvents(webviewId) {
    const webview = $(webviewId);
    if (!webview) return;
    webview.addEventListener('ipc-message', (event) => {
        if (event.channel === 'notebook-event') {
            const { title, body } = event.args[0];
            if (window.api && window.api.showNotification) window.api.showNotification(title, body);
        } else if (event.channel === 'notes-extracted') {
            handleNotesExtracted(event.args[0]);
        }
    });
}
paneContainers.forEach(p => setupWebviewEvents(p.webviewId));

// ---------- Quick-Clip ----------
if (window.api) {
    window.api.onQuickClip((text) => {
        const wv = getActiveWebview();
        try { wv.send('quick-clip-paste', text); }
        catch (e) { console.error("Could not send to webview", e); }
    });
}

// ---------- Drag & drop ----------
document.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });

document.addEventListener('drop', (e) => {
    e.preventDefault(); e.stopPropagation();
    const dt = e.dataTransfer;
    if (!dt) return;

    // URL drop: text/uri-list
    const uri = dt.getData('text/uri-list') || dt.getData('text/plain');
    if (uri && /^https?:\/\//i.test(uri.trim())) {
        const wv = getActiveWebview();
        try { wv.send('url-drop', uri.trim()); } catch (err) { console.error(err); }
        return;
    }

    if (dt.files && dt.files.length > 0) {
        const filePaths = Array.from(dt.files).map(f => f.path);
        const wv = getActiveWebview();
        try { wv.send('file-drop', filePaths); } catch (err) { console.error(err); }
    }
});

// ---------- Export notes ----------
let pendingExport = false;
$('export-btn').addEventListener('click', () => {
    const wv = getActiveWebview();
    if (!wv) return;
    pendingExport = true;
    try { wv.send('extract-notes'); }
    catch (e) { pendingExport = false; console.error(e); }
});

async function handleNotesExtracted(payload) {
    if (!pendingExport) return;
    pendingExport = false;
    if (!payload || !payload.markdown) {
        if (window.api) window.api.showNotification('Export failed', 'Could not find notes — NotebookLM layout may have changed. Please file an issue.');
        return;
    }
    if (!window.api) return;
    const result = await window.api.saveNotesMarkdown({
        filename: (payload.title || 'notebooklm-notes') + '.md',
        content: payload.markdown,
    });
    if (result && result.ok) {
        window.api.showNotification('Notes exported', 'Saved to ' + result.filePath);
    }
}

// ---------- Settings modal ----------
const settingsModal = $('settings-modal');
const settingsBtn = $('settings-btn');
const settingsClose = $('settings-close');
const themeSelect = $('theme-select');
const hotkeyInput = $('hotkey-input');
const hotkeyStatus = $('hotkey-status');
const alwaysOnTopCb = $('always-on-top-cb');
const paneCountSelect = $('pane-count-select');

async function openSettings() {
    if (!window.api) return;
    const s = await window.api.settingsGetAll();
    themeSelect.value = s.theme || 'system';
    alwaysOnTopCb.checked = !!s.alwaysOnTop;
    paneCountSelect.value = String(s.paneCount || 1);
    hotkeyInput.value = s.quickClipAccelerator || '';
    hotkeyStatus.textContent = '';
    settingsModal.classList.add('show');
}
settingsBtn.addEventListener('click', openSettings);
settingsClose.addEventListener('click', () => settingsModal.classList.remove('show'));
settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.remove('show'); });
if (window.api && window.api.onOpenSettings) window.api.onOpenSettings(openSettings);

themeSelect.addEventListener('change', async (e) => {
    if (!window.api) return;
    await window.api.setTheme(e.target.value);
});

alwaysOnTopCb.addEventListener('change', async (e) => {
    if (!window.api) return;
    const next = await window.api.setAlwaysOnTop(e.target.checked);
    updatePinUI(!!next);
});

paneCountSelect.addEventListener('change', (e) => {
    if (!window.api) return;
    const n = parseInt(e.target.value, 10) || 1;
    window.api.settingsSet('paneCount', n);
    applyPaneCount(n);
});

// Hotkey capture
hotkeyInput.addEventListener('focus', () => {
    hotkeyInput.classList.add('recording');
    hotkeyStatus.textContent = 'Press the combo… (Esc to cancel)';
});
hotkeyInput.addEventListener('blur', () => hotkeyInput.classList.remove('recording'));
hotkeyInput.addEventListener('keydown', async (e) => {
    e.preventDefault();
    if (e.key === 'Escape') { hotkeyInput.blur(); hotkeyStatus.textContent = 'Cancelled'; return; }
    const parts = [];
    if (e.ctrlKey) parts.push('Control');
    if (e.metaKey) parts.push('Command');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    const key = e.key;
    if (!key || ['Control', 'Meta', 'Alt', 'Shift'].includes(key)) {
        hotkeyStatus.textContent = 'Add a non-modifier key';
        return;
    }
    const accel = [...parts, key.length === 1 ? key.toUpperCase() : key].join('+')
        .replace('Control', 'CommandOrControl')
        .replace('Command+Command', 'Command');
    if (!window.api) return;
    const result = await window.api.setHotkey(accel);
    if (result && result.ok) {
        hotkeyInput.value = accel;
        hotkeyStatus.textContent = 'Saved';
    } else {
        hotkeyStatus.textContent = `Couldn't bind ${accel} (conflict?). Reverted to ${result && result.current}.`;
        if (result && result.current) hotkeyInput.value = result.current;
    }
    hotkeyInput.blur();
});

// ---------- Init from settings ----------
(async function init() {
    if (!window.api) return;
    try {
        const s = await window.api.settingsGetAll();
        applyPaneCount(s.paneCount || 1);
        updatePinUI(!!s.alwaysOnTop);
        // Theme will be pushed via theme-changed event after did-finish-load
        applyTheme(s.theme === 'dark' ? 'dark' : 'light');
    } catch (e) { console.error('init settings', e); }
})();
