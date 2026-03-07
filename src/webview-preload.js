const { ipcRenderer } = require('electron');

// specific keywords to trigger notification
const NOTIFICATION_TRIGGERS = [
    'Audio Overview generated',
    'Audio Overview ready',
    'Source added',
    'Note saved'
];

function checkForNotifications(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { 
                    const text = node.innerText || node.textContent;
                    if (!text) return;
                    
                    const isToast = node.getAttribute('role') === 'alert' || 
                                    node.className.includes('snackbar') || 
                                    node.className.includes('toast') ||
                                    (text.length < 100 && NOTIFICATION_TRIGGERS.some(t => text.includes(t)));

                    if (isToast) {
                        ipcRenderer.sendToHost('notebook-event', {
                            title: 'NotebookLM Update',
                            body: text.substring(0, 100)
                        });
                    }
                }
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(checkForNotifications);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Quick-Clip handler
ipcRenderer.on('quick-clip-paste', (event, text) => {
    // Attempt to locate input area
    const inputs = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
    for (let i = inputs.length - 1; i >= 0; i--) {
        const input = inputs[i];
        if (input.offsetParent !== null) { // if visible
            input.focus();
            
            if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
                input.value += text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (input.isContentEditable) {
                input.innerText += text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
            break;
        }
    }
});

// File drop pass-through placeholder
ipcRenderer.on('file-drop', (event, filePaths) => {
    // Constructing a file drop event programmatically to NotebookLM's dropzone without 
    // real Files is hard due to security boundaries. We log it for debugging here.
    // The native webview dropzone will handle drops natively properly.
    console.log("Intercepted file drop paths:", filePaths);
});
