# Contributing to NotebookLM-for-Windows

First off, thank you for considering contributing to NotebookLM-for-Windows! It's people like you that make this tool better for everyone.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for NotebookLM-for-Windows. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

*   **Check the existing issues** to see if the bug has already been reported.
*   **Use a clear and descriptive title** for the issue.
*   **Describe the exact steps to reproduce the bug.**
*   **Explain which behavior you expected to see and why.**
*   **Include screenshots or animated GIFs** which help demonstrate the steps or the bug itself.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

*   **Check if there's already an enhancement suggestion** which has been addressed.
*   **Use a clear and descriptive title.**
*   **Provide a step-by-step description of the suggested enhancement.**
*   **Explain why this enhancement would be useful** to most users.
*   **List some other applications where this feature exists**, if applicable.

## Local Development Setup

To get started with local development on Windows:

### 1. Prerequisites

*   **Git**: [Download and install Git](https://git-scm.com/downloads)
*   **Node.js**: [Download and install Node.js (LTS version recommended)](https://nodejs.org/)

### 2. Clone the Repository

```bash
git clone https://github.com/GyaneshSamanta/NotebookLM-for-Windows.git
cd NotebookLM-for-Windows
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run in Development Mode

```bash
npm start
```
This will open the application in development mode with Chrome DevTools available (accessible via `Ctrl+Shift+I`).

## Building and Packaging

### The Easy Way (One-Click)

Run the included build script:
```bash
build_installer.bat
```
This script will:
1. Close any running instances of the app.
2. Clean the `release/` folder.
3. Install dependencies.
4. Build the portable app into the `release/` directory.

### The Manual Way

If you prefer to run commands manually:
```bash
# Build portable app
npm run pack
```
The built app will be located in `release/NotebookLM-for-Windows-win32-x64/`.

## Project Structure Overview

*   `src/main.js`: The Electron main process. Handles window creation, IPC, and native integrations.
*   `src/preload.js`: The bridge between the renderer process and the main process.
*   `src/renderer.js`: Handles UI logic, title bar controls, and settings.
*   `src/webview-preload.js`: Injected into the NotebookLM webview to monitor for events like audio generation.
*   `src/index.html`: The main container for the application UI.
*   `assets/`: Contains icons and static assets.
*   `build_installer.bat`: Windows batch script for automated building.

## Style Guide

*   Use standard JavaScript (ES6+).
*   Follow the existing code style (2-space indentation).
*   Keep logic modular and well-commented.

## Questions?

If you have any questions, feel free to open an issue or contact the maintainer.

Happy coding! 🚀
