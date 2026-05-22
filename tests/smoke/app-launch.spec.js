// @ts-check
const { test, expect } = require('@playwright/test');
const { launchApp, cleanup } = require('../helpers');

test.describe('app launch', () => {
  let ctx;
  test.beforeEach(async () => { ctx = await launchApp(); });
  test.afterEach(async () => { if (ctx) await cleanup(ctx); });

  test('main window opens with the expected title', async () => {
    const window = await ctx.app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    const title = await window.title();
    expect(title).toMatch(/NotebookLM-for-Windows/i);
  });

  test('title bar buttons are present', async () => {
    const window = await ctx.app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    await expect(window.locator('#min-btn')).toBeVisible();
    await expect(window.locator('#max-btn')).toBeVisible();
    await expect(window.locator('#close-btn')).toBeVisible();
    await expect(window.locator('#pane-toggle')).toBeVisible();
    await expect(window.locator('#pin-toggle')).toBeVisible();
    await expect(window.locator('#theme-toggle')).toBeVisible();
    await expect(window.locator('#settings-btn')).toBeVisible();
  });
});
