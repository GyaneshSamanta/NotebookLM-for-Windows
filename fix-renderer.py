with open('src/renderer.js', 'r') as f:
    js = f.read()

# Wait, we need to inject webviews before we attach event listeners to them.
# In renderer.js, the event listeners are attached in `paneContainers.forEach(({ webviewId, errorId }) => ...)`
# Let's see how renderer.js is structured.
