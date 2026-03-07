function openLink(url) {
    if (window.api && window.api.openExternal) {
        window.api.openExternal(url);
    } 
}

// Window controls
document.getElementById('min-btn').addEventListener('click', () => {
    if (window.api) window.api.windowAction('minimize');
});
document.getElementById('max-btn').addEventListener('click', () => {
    if (window.api) window.api.windowAction('maximize');
});
document.getElementById('close-btn').addEventListener('click', () => {
    if (window.api) window.api.windowAction('close');
});

// Opacity (Ghost Mode)
const opacitySlider = document.getElementById('opacity-slider');
if (window.api) {
    window.api.getOpacity().then(val => {
        opacitySlider.value = val;
    });
    opacitySlider.addEventListener('input', (e) => {
        window.api.setOpacity(parseFloat(e.target.value));
    });
}

// Split View Toggle
const splitToggle = document.getElementById('split-toggle');
const view2Container = document.getElementById('view2-container');
let isSplit = false;

splitToggle.addEventListener('click', () => {
    isSplit = !isSplit;
    if (isSplit) {
        view2Container.classList.remove('hidden');
        splitToggle.style.background = 'rgba(255, 255, 255, 0.5)';
    } else {
        view2Container.classList.add('hidden');
        splitToggle.style.background = 'rgba(255, 255, 255, 0.15)';
    }
});

// Auto-Launch Toggle Logic
const toggle = document.getElementById('autoLaunchToggle');
if (window.api) {
    window.api.getAutoLaunch().then(enabled => {
        toggle.checked = enabled;
    });
    toggle.addEventListener('change', (e) => {
        window.api.setAutoLaunch(e.target.checked);
    });
}

// Handle IPC messages from webviews
function setupWebviewEvents(webviewId) {
    const webview = document.getElementById(webviewId);
    webview.addEventListener('ipc-message', (event) => {
        if (event.channel === 'notebook-event') {
            const { title, body } = event.args[0];
            if (window.api && window.api.showNotification) {
                window.api.showNotification(title, body);
            }
        }
    });
}

setupWebviewEvents('notebookView1');
setupWebviewEvents('notebookView2');

// Global Quick-Clip listener
if (window.api) {
    window.api.onQuickClip((text) => {
        const webview = isSplit ? document.getElementById('notebookView1') : document.getElementById('notebookView1');
        try {
            webview.send('quick-clip-paste', text);
        } catch(e) {
            console.error("Could not send to webview", e);
        }
    });
}

// Global Drag and Drop over the whole window
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const filePaths = Array.from(e.dataTransfer.files).map(f => f.path);
        
        const webview = document.getElementById('notebookView1');
        webview.send('file-drop', filePaths);
    }
});
