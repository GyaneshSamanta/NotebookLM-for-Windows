import os
import re

replacements = [
    (r'https://notebooklm\.google\.com/?', 'https://notebook.google.com/'),
    (r'NotebookLM-for-Windows', 'Gemini-Notebook-for-Windows'),
    (r'notebooklm-for-windows', 'gemini-notebook-for-windows'),
    (r'NotebookLM for Windows', 'Gemini Notebook for Windows'),
    (r'NotebookLM-for-Mac', 'Gemini-Notebook-for-Mac'),
    (r'NotebookLM-for-Linux', 'Gemini-Notebook-for-Linux'),
    (r'NotebookLM', 'Gemini Notebook'),
    (r'notebooklm', 'gemini-notebook'),
]

files_to_update = [
    'src/main.js',
    'src/settings.js',
    'src/preload.js',
    'src/renderer.js',
    'src/webview-preload.js',
    'src/index.html',
    'src/quick-clip-overlay.html',
    'package.json',
    'README.md'
]

for filepath in files_to_update:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
        
    for old, new in replacements:
        # Avoid double replacing if a string was already replaced by a previous rule
        # but in this case, order matters. Longest matches first.
        content = re.sub(old, new, content)
        
    with open(filepath, 'w') as f:
        f.write(content)
print("Done replacing.")
