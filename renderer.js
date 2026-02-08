function openLink(url) {
    if (window.api && window.api.openExternal) {
        window.api.openExternal(url);
    } 
}

// In this simple setup, we use the preload approach
// However, since we didn't expose shell directly in preload, let's fix that or use a safe method.
// Let's rely on the main process handling 'new-window' or specific ipc call.
// We exposed nothing for opening links in preload, so let's use a workaround:
// standard <a href> with target _blank usually triggers the main process handler.

document.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault();
        // Since we didn't expose a direct 'open' method, and we blocked nodeIntegration,
        // we can trigger a navigation that arguably gets caught by `will-navigate` or `new-window` handlers
        // But the best way is to add it to preload.
        // For now, let's assume the main process handler we wrote: `setWindowOpenHandler` catches window.open
        window.open(event.target.href, '_blank');
    }
});

// Auto-Launch Toggle Logic
const toggle = document.getElementById('autoLaunchToggle');

// Initialize state
if (window.api) {
    window.api.getAutoLaunch().then(enabled => {
        toggle.checked = enabled;
    });

    toggle.addEventListener('change', (e) => {
        window.api.setAutoLaunch(e.target.checked);
    });
}

// Listen for messages from the webview
const webview = document.getElementById('notebookView');
webview.addEventListener('ipc-message', (event) => {
    if (event.channel === 'notebook-event') {
        const { title, body } = event.args[0];
        if (window.api && window.api.showNotification) {
            window.api.showNotification(title, body);
        }
    }
});
