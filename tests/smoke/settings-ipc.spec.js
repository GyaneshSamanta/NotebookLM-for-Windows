// @ts-check
const { test, expect } = require('@playwright/test');
const { launchApp, cleanup } = require('../helpers');

test.describe('settings IPC', () => {
  let ctx;
  test.beforeEach(async () => { ctx = await launchApp(); });
  test.afterEach(async () => { if (ctx) await cleanup(ctx); });

  test('settings:get-all returns the default schema keys', async () => {
    const window = await ctx.app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    const settings = await window.evaluate(() => window.api.settingsGetAll());
    expect(settings).toBeTruthy();
    expect(settings).toHaveProperty('theme');
    expect(settings).toHaveProperty('quickClipAccelerator');
    expect(settings).toHaveProperty('paneCount');
    expect(settings).toHaveProperty('alwaysOnTop');
  });

  test('settings:set roundtrips a value', async () => {
    const window = await ctx.app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    const result = await window.evaluate(async () => {
      await window.api.settingsSet('paneCount', 2);
      const s = await window.api.settingsGetAll();
      return s.paneCount;
    });
    expect(result).toBe(2);
  });
});
