// @ts-check
const path = require('path');
const fs = require('fs');
const os = require('os');
const { _electron: electron } = require('@playwright/test');

function tempUserDataDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'nblm-test-'));
}

async function launchApp() {
    const userDataDir = tempUserDataDir();
    const app = await electron.launch({
        args: [path.join(__dirname, '..'), `--user-data-dir=${userDataDir}`],
        env: { ...process.env, NODE_ENV: 'test' },
        timeout: 30_000,
    });
    return { app, userDataDir };
}

async function cleanup({ app, userDataDir }) {
    try {
        if (app) {
            // The app keeps running for the tray on non-Mac; force quit.
            try {
                await app.evaluate(({ app: electronApp }) => {
                    electronApp.exit(0);
                });
            } catch (e) { /* may already be gone */ }
            try { await app.close(); } catch (e) {}
        }
    } finally {
        try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
    }
}

module.exports = { launchApp, cleanup };
