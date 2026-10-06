import re

# 1. Update settings.js
with open('src/settings.js', 'r') as f:
    s = f.read()

s = s.replace(
    "autoLaunch: true,",
    "autoLaunch: true,\n    activeProfile: 'default',"
)

with open('src/settings.js', 'w') as f:
    f.write(s)

# 2. Update index.html
with open('src/index.html', 'r') as f:
    html = f.read()

# Add profile dropdown in settings
settings_html = """
        <div class="setting-item">
          <label for="profile-select">Workspace Profile</label>
          <select id="profile-select">
            <option value="default">Default</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="school">School</option>
          </select>
        </div>
        <div class="setting-item">
"""
html = html.replace('<div class="setting-item">\n          <label for="theme-select">Theme</label>', settings_html + '          <label for="theme-select">Theme</label>')

# Remove hardcoded webviews
for i in range(1, 4):
    webview_tag = f'<webview id="notebookView{i}" src="https://notebook.google.com/" partition="persist:gemini-notebook" preload="./webview-preload.js" allowpopups></webview>'
    html = html.replace(webview_tag, '')

with open('src/index.html', 'w') as f:
    f.write(html)

