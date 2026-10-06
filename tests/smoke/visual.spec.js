const { test, expect } = require('@playwright/test');
const { launchApp, closeApp } = require('../helpers');

let app;
let window;

test.beforeEach(async () => {
    app = await launchApp();
    window = await app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
});

test.afterEach(async () => {
    await closeApp(app);
});

test.describe('visual regression', () => {
    test('title bar matches snapshot (light and dark)', async () => {
        const titlebar = window.locator('#titlebar');
        
        await window.evaluate(() => document.body.setAttribute('data-theme', 'light'));
        await expect(titlebar).toHaveScreenshot('titlebar-light.png');
        
        await window.evaluate(() => document.body.setAttribute('data-theme', 'dark'));
        await expect(titlebar).toHaveScreenshot('titlebar-dark.png');
    });

    test('settings modal matches snapshot', async () => {
        await window.evaluate(() => document.getElementById('settings-modal').classList.add('show'));
        const modal = window.locator('.modal');
        
        await window.evaluate(() => document.body.setAttribute('data-theme', 'light'));
        await expect(modal).toHaveScreenshot('settings-modal-light.png');
        
        await window.evaluate(() => document.body.setAttribute('data-theme', 'dark'));
        await expect(modal).toHaveScreenshot('settings-modal-dark.png');
    });
    
    test('pane layouts match snapshot', async () => {
        const container = window.locator('#app-container');
        
        // Disable webview rendering content to avoid flakiness in snapshots
        await window.evaluate(() => {
            document.querySelectorAll('webview').forEach(w => w.style.opacity = '0');
            document.querySelectorAll('.error-overlay').forEach(e => e.style.display = 'none');
        });

        await window.evaluate(() => window.applyPaneCount(1));
        await expect(container).toHaveScreenshot('layout-1-pane.png');

        await window.evaluate(() => window.applyPaneCount(2));
        await expect(container).toHaveScreenshot('layout-2-pane.png');

        await window.evaluate(() => window.applyPaneCount(3));
        await expect(container).toHaveScreenshot('layout-3-pane.png');
    });
});
