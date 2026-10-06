with open('src/main.js', 'r') as f:
    js = f.read()

js = js.replace(
    "case 'close': mainWindow.close(); break;",
    "case 'close': mainWindow.close(); break;\n        case 'reload': mainWindow.reload(); break;"
)

with open('src/main.js', 'w') as f:
    f.write(js)
