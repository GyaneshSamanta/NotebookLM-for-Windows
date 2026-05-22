const { ipcRenderer } = require('electron');

const NOTIFICATION_TRIGGERS = [
    'Audio Overview generated',
    'Audio Overview ready',
    'Source added',
    'Note saved',
];

function checkForNotifications(mutations) {
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
                    title: 'NotebookLM Update',
                    body: text.substring(0, 100),
                });
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(checkForNotifications);
    observer.observe(document.body, { childList: true, subtree: true });
});

// ---------- Quick-Clip paste ----------
ipcRenderer.on('quick-clip-paste', (event, text) => {
    const inputs = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
    for (let i = inputs.length - 1; i >= 0; i--) {
        const input = inputs[i];
        if (input.offsetParent === null) continue;
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
});

// ---------- File drop logging (real upload remains an open issue) ----------
ipcRenderer.on('file-drop', (event, filePaths) => {
    console.log('Intercepted file drop paths:', filePaths);
});

// ---------- URL drop ----------
ipcRenderer.on('url-drop', (event, url) => {
    try {
        // Try to find a visible "Add source" / URL input. Fallback: copy to clipboard.
        const inputs = document.querySelectorAll('input[type="url"], input[type="text"], textarea');
        let matched = null;
        for (const input of inputs) {
            if (input.offsetParent === null) continue;
            const ph = (input.placeholder || '').toLowerCase();
            const aria = (input.getAttribute('aria-label') || '').toLowerCase();
            if (ph.includes('url') || ph.includes('link') || aria.includes('url') || aria.includes('link')) {
                matched = input; break;
            }
        }
        if (matched) {
            matched.focus();
            matched.value = url;
            matched.dispatchEvent(new Event('input', { bubbles: true }));
            return;
        }
        // Fallback: copy and notify
        navigator.clipboard.writeText(url).catch(() => {});
        ipcRenderer.sendToHost('notebook-event', {
            title: 'URL copied',
            body: 'Open Add Source and paste — NotebookLM URL field not detected automatically.',
        });
    } catch (e) {
        console.error('url-drop handler failed', e);
    }
});

// ---------- Notes extraction (Markdown export) ----------
ipcRenderer.on('extract-notes', () => {
    try {
        const payload = extractNotesAsMarkdown();
        ipcRenderer.sendToHost('notes-extracted', payload);
    } catch (e) {
        console.error('notes extraction failed', e);
        ipcRenderer.sendToHost('notes-extracted', { markdown: null, error: e.message });
    }
});

function extractNotesAsMarkdown() {
    // NotebookLM selectors are not stable. Strategy: walk likely note containers,
    // fall back to a broad scrape of the notes panel.
    const title = (document.querySelector('h1, [role="heading"][aria-level="1"]') || {}).innerText
        || document.title.replace(/ - NotebookLM.*$/, '')
        || 'NotebookLM notes';

    // Heuristic: notes typically live in cards within a notes panel.
    const candidateSelectors = [
        '[aria-label*="note" i] article',
        '[aria-label*="note" i] [role="listitem"]',
        '[data-testid*="note"]',
        '.note-card, .notes-card',
        '[role="list"] [role="listitem"]',
    ];
    let cards = [];
    for (const sel of candidateSelectors) {
        cards = Array.from(document.querySelectorAll(sel));
        if (cards.length >= 2) break;
    }

    if (!cards.length) {
        return { markdown: null, title, error: 'No notes detected (selectors may be stale).' };
    }

    const sections = cards.map((card, i) => {
        const heading = card.querySelector('h1, h2, h3, h4, [role="heading"]');
        const headText = heading ? heading.innerText.trim() : `Note ${i + 1}`;
        // Clone, strip headings, then convert remaining body to markdown
        const clone = card.cloneNode(true);
        if (heading) {
            const h = clone.querySelector('h1, h2, h3, h4, [role="heading"]');
            if (h) h.remove();
        }
        const body = htmlToMarkdown(clone);
        return `## ${headText}\n\n${body}`.trim();
    }).filter(Boolean);

    const markdown = `# ${title}\n\n_Exported from NotebookLM via NotebookLM-for-Windows_\n\n${sections.join('\n\n---\n\n')}\n`;
    return { markdown, title };
}

// Minimal HTML → Markdown converter (no external deps).
function htmlToMarkdown(root) {
    const buf = [];
    function walk(node, ctx) {
        if (node.nodeType === Node.TEXT_NODE) {
            buf.push(node.textContent.replace(/\s+/g, ' '));
            return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const tag = node.tagName.toLowerCase();
        switch (tag) {
            case 'br': buf.push('\n'); return;
            case 'p': walkChildren(node, ctx); buf.push('\n\n'); return;
            case 'strong': case 'b': buf.push('**'); walkChildren(node, ctx); buf.push('**'); return;
            case 'em': case 'i': buf.push('_'); walkChildren(node, ctx); buf.push('_'); return;
            case 'code': buf.push('`'); walkChildren(node, ctx); buf.push('`'); return;
            case 'pre': buf.push('\n```\n'); buf.push(node.innerText); buf.push('\n```\n'); return;
            case 'a': {
                const href = node.getAttribute('href') || '';
                buf.push('['); walkChildren(node, ctx); buf.push(`](${href})`);
                return;
            }
            case 'ul': case 'ol':
                buf.push('\n');
                Array.from(node.children).forEach((li, idx) => {
                    if (li.tagName.toLowerCase() !== 'li') return;
                    buf.push(tag === 'ol' ? `${idx + 1}. ` : '- ');
                    walkChildren(li, ctx);
                    buf.push('\n');
                });
                buf.push('\n');
                return;
            case 'h1': buf.push('\n# '); walkChildren(node, ctx); buf.push('\n\n'); return;
            case 'h2': buf.push('\n## '); walkChildren(node, ctx); buf.push('\n\n'); return;
            case 'h3': buf.push('\n### '); walkChildren(node, ctx); buf.push('\n\n'); return;
            case 'h4': buf.push('\n#### '); walkChildren(node, ctx); buf.push('\n\n'); return;
            case 'blockquote':
                buf.push('\n> '); walkChildren(node, ctx); buf.push('\n\n'); return;
            case 'script': case 'style': return;
            default: walkChildren(node, ctx);
        }
    }
    function walkChildren(node, ctx) {
        Array.from(node.childNodes).forEach(c => walk(c, ctx));
    }
    walk(root, {});
    return buf.join('').replace(/\n{3,}/g, '\n\n').trim();
}
