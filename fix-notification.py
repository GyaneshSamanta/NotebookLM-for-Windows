with open('src/webview-preload.js', 'r') as f:
    content = f.read()

old_block = """function checkForNotifications(mutations) {
    for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        mutation.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            const text = node.innerText || node.textContent;
            if (!text) return;
            const isToast =
                node.getAttribute('role') === 'alert' ||
                (node.className && typeof node.className === 'string' &&
                    (node.className.includes('snackbar') || node.className.includes('toast'))) ||
                (text.length < 100 && NOTIFICATION_TRIGGERS.some(t => text.includes(t)));
            if (isToast) {
                ipcRenderer.sendToHost('notebook-event', {
                    title: 'Gemini Notebook Update',
                    body: text.substring(0, 100),
                });
            }
        });
    }
}"""

new_block = """const recentNotifications = new Set();
function checkForNotifications(mutations) {
    for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        mutation.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            
            // Narrow to likely toast containers (mat-snackbar, alert dialogues, etc.)
            const isToast = 
                node.getAttribute('role') === 'alert' ||
                node.tagName?.toLowerCase().includes('snackbar') ||
                node.tagName?.toLowerCase().includes('toast') ||
                (node.className && typeof node.className === 'string' &&
                    (node.className.includes('snackbar') || node.className.includes('toast')));
                    
            if (!isToast) return;
            
            const text = (node.innerText || node.textContent || '').trim();
            if (!text || text.length > 150) return;
            
            // Deduplicate to avoid notification spam
            if (recentNotifications.has(text)) return;
            recentNotifications.add(text);
            setTimeout(() => recentNotifications.delete(text), 10000);

            // Forward event
            ipcRenderer.sendToHost('notebook-event', {
                title: 'Gemini Notebook Update',
                body: text.substring(0, 100),
            });
        });
    }
}"""

content = content.replace(old_block, new_block)

with open('src/webview-preload.js', 'w') as f:
    f.write(content)
