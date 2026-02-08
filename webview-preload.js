const { ipcRenderer } = require('electron');

// specific keywords to trigger notification
// "Audio Overview generated" is a key one. "Source added", etc.
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
                // Check if node is an element and has text content
                if (node.nodeType === 1) { 
                    const text = node.innerText || node.textContent;
                    if (!text) return;
                    
                    // Simple check: does the text contain any of our triggers?
                    // NotebookLM toasts are usually snackbars at bottom left/center
                    const isToast = node.getAttribute('role') === 'alert' || 
                                    node.className.includes('snackbar') || 
                                    node.className.includes('toast') ||
                                    // Material design structure often uses specific classes, but text is safer fallback
                                    (text.length < 100 && NOTIFICATION_TRIGGERS.some(t => text.includes(t)));

                    if (isToast) {
                         // Send to host
                        ipcRenderer.sendToHost('notebook-event', {
                            title: 'NotebookLM Update',
                            body: text.substring(0, 100) // limit length
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
