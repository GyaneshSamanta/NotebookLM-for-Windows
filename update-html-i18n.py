with open('src/index.html', 'r') as f:
    html = f.read()

# Add <script src="i18n.js"></script> before renderer.js
html = html.replace('<script src="renderer.js"></script>', '<script src="i18n.js"></script>\n    <script src="renderer.js"></script>')

replacements = {
    '<span id="titlebar-title">Gemini-Notebook-for-Windows v3</span>': '<span id="titlebar-title" data-i18n="title">Gemini-Notebook-for-Windows v3</span>',
    'Opacity': '<span data-i18n="opacity">Opacity</span>',
    '>Panes: ': '><span data-i18n="panes">Panes</span>: ',
    '>📌 Pin<': ' data-i18n="pin">📌 Pin<',
    '>⬇ Export<': ' data-i18n="export">⬇ Export<',
    '>Settings<': ' data-i18n="settings">Settings<',
    '<div class="err-title">Couldn\'t reach Gemini Notebook</div>': '<div class="err-title" data-i18n="error_title">Couldn\'t reach Gemini Notebook</div>',
    '<div class="err-body">Check your internet connection or try again in a moment.</div>': '<div class="err-body" data-i18n="error_body">Check your internet connection or try again in a moment.</div>',
    'id="err1-body">Check your internet connection or try again in a moment.</div>': 'id="err1-body" data-i18n="error_body">Check your internet connection or try again in a moment.</div>',
    '>Retry<': ' data-i18n="retry">Retry<',
    '>Open in browser<': ' data-i18n="open_browser">Open in browser<',
    '<h2>Settings</h2>': '<h2 data-i18n="settings">Settings</h2>',
    '<label for="theme-select">Theme</label>': '<label for="theme-select" data-i18n="theme">Theme</label>',
    '>System<': ' data-i18n="system">System<',
    '>Light<': ' data-i18n="light">Light<',
    '>Dark<': ' data-i18n="dark">Dark<',
    '<label>Quick-Clip Hotkey</label>': '<label data-i18n="hotkey">Quick-Clip Hotkey</label>',
    '<label for="always-on-top">Always on Top</label>': '<label for="always-on-top" data-i18n="always_on_top">Always on Top</label>',
    '<label for="auto-launch">Launch on Startup</label>': '<label for="auto-launch" data-i18n="autolaunch">Launch on Startup</label>',
    '>Close<': ' data-i18n="close">Close<',
    '<h2>What\'s New in this version</h2>': '<h2 data-i18n="whats_new">What\'s New in this version</h2>',
    '>Got it<': ' data-i18n="got_it">Got it<'
}

for old, new in replacements.items():
    html = html.replace(old, new)

with open('src/index.html', 'w') as f:
    f.write(html)
