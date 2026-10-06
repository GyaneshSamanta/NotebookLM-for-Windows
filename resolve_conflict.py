with open('README.md', 'r') as f:
    lines = f.readlines()

out = []
i = 0
while i < len(lines):
    if lines[i].startswith('<<<<<<< HEAD'):
        head_block = []
        i += 1
        while not lines[i].startswith('======='):
            head_block.append(lines[i])
            i += 1
        i += 1
        main_block = []
        while not lines[i].startswith('>>>>>>>'):
            main_block.append(lines[i])
            i += 1
        # Re-apply rebrand to the main block (which has the 11k updates)
        text = "".join(main_block)
        text = text.replace('NotebookLM', 'Gemini Notebook')
        text = text.replace('notebooklm', 'gemini-notebook')
        out.append(text)
    else:
        out.append(lines[i])
    i += 1

with open('README.md', 'w') as f:
    f.writelines(out)

