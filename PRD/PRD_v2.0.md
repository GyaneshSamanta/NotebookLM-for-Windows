# Product Requirements Document (PRD): NotebookLM-for-Windows v2.0

## 1. Product Overview
**Product Name:** NotebookLM-for-Windows
**Version:** 2.0
**Description:** A major feature update to the existing standalone Electron wrapper for Google's NotebookLM (`https://notebooklm.google.com/`). 
**Objective:** Evolve the application from a basic web container into a deeply integrated Windows OS research utility. Focus is on reducing context-switching friction, enhancing multi-source synthesis, and establishing a clear brand identity, all distributed as a portable `.exe`.

## 2. Platform and Architecture Updates
* **Framework:** Electron (maintaining V1 tech stack).
* **Session Management:** Must maintain the V1 capability of persistent login (storing session cookies securely in `AppData` so users sign in only once).
* **DOM Interaction:** V2 requires a `preload.js` script to securely interact with the NotebookLM DOM for advanced features like Quick-Clip and Drag-and-Drop.

## 3. Core Functional Requirements (The V2 Upgrades)

### 3.1. Ghost Mode (Window Transparency)
* **Functionality:** Allow the user to adjust the opacity of the entire application window so they can reference materials (PDFs, videos, protected web pages) positioned underneath the app.
* **UI Control:** Add a discrete opacity slider (range: 20% to 100%) in the custom application title bar.
* **State Persistence:** The app must remember the last set opacity level upon restart.

### 3.2. Global "Quick-Clip" Hotkey
* **Functionality:** A system-wide hotkey to instantly capture clipboard text into NotebookLM.
* **Shortcut:** `Ctrl + Alt + N` (Configurable in settings).
* **Action Flow:** 1. User copies text from any external application.
    2. User presses `Ctrl + Alt + N`.
    3. The app instantly comes to the foreground.
    4. Via preload script, the app programmatically triggers the "New Note" or "Add Source" DOM element in the active NotebookLM webview and pastes the clipboard contents.

### 3.3. Native Drag-and-Drop Global Dropzone
* **Functionality:** Bypass the standard web file picker by enabling native OS file drops directly onto the Electron window.
* **Implementation:** The Electron main process must intercept file drag-and-drop events over the app window. If the file is a supported format (e.g., `.pdf`, `.txt`, `.md`), the app must pass the file path/object to the webview and programmatically trigger NotebookLM's upload pipeline.

### 3.4. Cross-Notebook Synthesis (Split View)
* **Functionality:** Enable users to view and interact with two different Notebooks simultaneously.
* **Implementation:** Provide a "Split View" toggle in the title bar. When activated, the window splits 50/50 vertically, rendering a second webview instance. Both instances must share the same session partition so the user remains authenticated. 

## 4. UI/UX & Branding Requirements

### 4.1. Signature Branding & Custom Title Bar
* **Title Bar Implementation:** Replace the default Windows OS title bar with a custom Electron frameless window title bar.
* **Accent Colors:** The app must utilize a distinct Purple brand palette:
    * **Primary Interactive Elements:** Deep Purple (e.g., `#6B21A8` or similar).
    * **Backgrounds/Hover States:** Light Lavender.
* **Title Bar Elements (Left to Right):** App Icon, "NotebookLM-for-Windows v2", Ghost Mode Slider, Split View Toggle, standard window controls (Minimize, Maximize, Close).

### 4.2. The Persistent Footer
* **Functionality:** A fixed, narrow, non-intrusive status bar at the bottom of the application window.
* **Branding Text:** `built with <3 by Gyanesh Samanta` 
* **External Links:** Must contain icon-buttons or text links that open in the user's default system browser (NOT the internal webview):
    * Newsletter: `https://www.linkedin.com/newsletters/gyanesh-on-product-6979386586404651008/`
    * LinkedIn: `https://www.linkedin.com/in/gyanesh-samanta/`
    * GitHub: `https://github.com/GyaneshSamanta`
    * Buy Me a Chai: `https://buymeachai.ezee.li/GyaneshOnProduct`

## 5. Performance and Security Constraints
* **Resource Management:** Ensure that running dual webviews (Split View) does not cause excessive memory leaks. Implement aggressive garbage collection and resource throttling for the background webview if the app is minimized.
* **External Navigation:** Any links clicked within a notebook that lead outside of `notebooklm.google.com` (e.g., external citations) must be intercepted by Electron and routed to the user's default OS browser.