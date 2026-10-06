with open('src/index.html', 'r') as f:
    content = f.read()

# Replace css
content = content.replace(
    '#app-container { flex: 1; display: flex; transition: all 0.3s ease; }',
    '#app-container { flex: 1; display: grid; transition: all 0.3s ease; }'
)

# the view container border
content = content.replace(
    '.view-container {\n        flex: 1; display: flex; flex-direction: column;\n        border-right: 1px solid var(--divider); position: relative; min-width: 0;\n      }',
    '.view-container {\n        display: flex; flex-direction: column;\n        border-right: 1px solid var(--divider); border-bottom: 1px solid var(--divider); position: relative; min-width: 0; min-height: 0;\n      }'
)
content = content.replace('.view-container:last-child { border-right: none; }', '')

# add panes 4, 5, 6
pane_html = """
      <div class="view-container hidden" id="view4-container" data-pane="4">
        <webview id="notebookView4" src="https://notebook.google.com/" partition="persist:gemini-notebook" preload="./webview-preload.js" allowpopups></webview>
        <div class="error-overlay" id="err4">
          <div class="err-title">Couldn't reach Gemini Notebook</div>
          <div class="err-body">Check your internet connection or try again in a moment.</div>
          <div class="err-actions">
            <button class="primary" data-retry="notebookView4">Retry</button>
            <button data-open-browser="1">Open in browser</button>
          </div>
        </div>
      </div>
      <div class="view-container hidden" id="view5-container" data-pane="5">
        <webview id="notebookView5" src="https://notebook.google.com/" partition="persist:gemini-notebook" preload="./webview-preload.js" allowpopups></webview>
        <div class="error-overlay" id="err5">
          <div class="err-title">Couldn't reach Gemini Notebook</div>
          <div class="err-body">Check your internet connection or try again in a moment.</div>
          <div class="err-actions">
            <button class="primary" data-retry="notebookView5">Retry</button>
            <button data-open-browser="1">Open in browser</button>
          </div>
        </div>
      </div>
      <div class="view-container hidden" id="view6-container" data-pane="6">
        <webview id="notebookView6" src="https://notebook.google.com/" partition="persist:gemini-notebook" preload="./webview-preload.js" allowpopups></webview>
        <div class="error-overlay" id="err6">
          <div class="err-title">Couldn't reach Gemini Notebook</div>
          <div class="err-body">Check your internet connection or try again in a moment.</div>
          <div class="err-actions">
            <button class="primary" data-retry="notebookView6">Retry</button>
            <button data-open-browser="1">Open in browser</button>
          </div>
        </div>
      </div>
    </div>
"""
content = content.replace('      </div>\n    </div>', '      </div>' + pane_html)

# Add to settings pane
content = content.replace(
    '<option value="3">3</option>',
    '<option value="3">3</option>\n            <option value="4">4</option>\n            <option value="6">6</option>'
)

with open('src/index.html', 'w') as f:
    f.write(content)
