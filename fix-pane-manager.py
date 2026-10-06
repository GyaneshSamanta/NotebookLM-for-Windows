with open('src/renderer.js', 'r') as f:
    content = f.read()

old_block = """// ---------- Pane manager (1 / 2 / 3 panes) ----------
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
});"""

new_block = """// ---------- Pane manager (up to 6 panes) ----------
const paneContainers = [
    { container: $('view1-container'), webviewId: 'notebookView1', errorId: 'err1' },
    { container: $('view2-container'), webviewId: 'notebookView2', errorId: 'err2' },
    { container: $('view3-container'), webviewId: 'notebookView3', errorId: 'err3' },
    { container: $('view4-container'), webviewId: 'notebookView4', errorId: 'err4' },
    { container: $('view5-container'), webviewId: 'notebookView5', errorId: 'err5' },
    { container: $('view6-container'), webviewId: 'notebookView6', errorId: 'err6' },
];
let paneCount = 1;
let activePaneIndex = 0;

const paneToggle = $('pane-toggle');
const appContainer = $('app-container');

function applyPaneCount(n) {
    const validPanes = [1, 2, 3, 4, 6];
    paneCount = validPanes.includes(n) ? n : 1;
    
    paneContainers.forEach((p, i) => {
        if (i < paneCount) p.container.classList.remove('hidden');
        else p.container.classList.add('hidden');
    });
    
    paneToggle.textContent = `Panes: ${paneCount}`;
    if (activePaneIndex >= paneCount) activePaneIndex = 0;
    
    // Update CSS grid layout
    if (paneCount === 1) {
        appContainer.style.gridTemplateColumns = '1fr';
        appContainer.style.gridTemplateRows = '1fr';
    } else if (paneCount === 2) {
        appContainer.style.gridTemplateColumns = '1fr 1fr';
        appContainer.style.gridTemplateRows = '1fr';
    } else if (paneCount === 3) {
        appContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
        appContainer.style.gridTemplateRows = '1fr';
    } else if (paneCount === 4) {
        appContainer.style.gridTemplateColumns = '1fr 1fr';
        appContainer.style.gridTemplateRows = '1fr 1fr';
    } else if (paneCount === 6) {
        appContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
        appContainer.style.gridTemplateRows = '1fr 1fr';
    }
}

paneToggle.addEventListener('click', () => {
    const sequence = [1, 2, 3, 4, 6];
    const nextIdx = (sequence.indexOf(paneCount) + 1) % sequence.length;
    const next = sequence[nextIdx];
    applyPaneCount(next);
    if (window.api) window.api.settingsSet('paneCount', next);
});"""

content = content.replace(old_block, new_block)
# Also fix tooltip
content = content.replace('title="Cycle 1 / 2 / 3 panes"', 'title="Cycle layout (1 to 6 panes)"')

with open('src/renderer.js', 'w') as f:
    f.write(content)

