// @ts-check
const { test, expect } = require('@playwright/test');
const { launchApp, cleanup } = require('../helpers');

test.describe('theme + panes', () => {
  let ctx;
  test.beforeEach(async () => { ctx = await launchApp(); });
  test.afterEach(async () => { if (ctx) await cleanup(ctx); });

  test('theme toggle cycles data-theme attribute', async () => {
    const window = await ctx.app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    await window.locator('#theme-toggle').click();
    await window.waitForTimeout(300);
    const next = await window.locator('body').getAttribute('data-theme');
    expect(['light', 'dark']).toContain(next);
  });

  test('pane toggle cycles 1 -> 2 -> 3 -> 1', async () => {
    const window = await ctx.app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    const btn = window.locator('#pane-toggle');
    await expect(btn).toHaveText(/Panes: 1/);
    await btn.click();
    await expect(btn).toHaveText(/Panes: 2/);
    await btn.click();
    await expect(btn).toHaveText(/Panes: 3/);
    await btn.click();
    await expect(btn).toHaveText(/Panes: 1/);
  });
});
