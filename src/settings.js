const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const SCHEMA_VERSION = 1;

const DEFAULTS = {
    schemaVersion: SCHEMA_VERSION,
    opacity: 1.0,
    theme: 'system',
    alwaysOnTop: false,
    paneCount: 1,
    quickClipAccelerator: 'CommandOrControl+Alt+N',
    autoLaunch: true,
};

let settingsPath = null;
let legacyConfigPath = null;
let cache = null;
let writeTimer = null;
const subscribers = new Set();

function init() {
    settingsPath = path.join(app.getPath('userData'), 'settings.json');
    legacyConfigPath = path.join(app.getPath('userData'), 'ui-config.json');
    cache = load();
    return cache;
}

function load() {
    try {
        if (fs.existsSync(settingsPath)) {
            const parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            return migrate({ ...DEFAULTS, ...parsed });
        }
    } catch (e) {
        console.error('settings: read failed, falling back to defaults', e);
    }

    // Migrate legacy ui-config.json if present
    try {
        if (legacyConfigPath && fs.existsSync(legacyConfigPath)) {
            const legacy = JSON.parse(fs.readFileSync(legacyConfigPath, 'utf8'));
            const merged = { ...DEFAULTS, ...legacy, schemaVersion: SCHEMA_VERSION };
            persist(merged);
            return merged;
        }
    } catch (e) {
        console.error('settings: legacy migration failed', e);
    }

    persist(DEFAULTS);
    return { ...DEFAULTS };
}

function migrate(s) {
    // Reserved for future schema version bumps. Currently a no-op.
    if (!s.schemaVersion) s.schemaVersion = SCHEMA_VERSION;
    return s;
}

function persist(obj) {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(obj, null, 2));
    } catch (e) {
        console.error('settings: write failed', e);
    }
}

function schedulePersist() {
    if (writeTimer) clearTimeout(writeTimer);
    writeTimer = setTimeout(() => persist(cache), 250);
}

function getAll() {
    return { ...cache };
}

function get(key) {
    return cache ? cache[key] : DEFAULTS[key];
}

function set(key, value) {
    if (!cache) return;
    cache[key] = value;
    schedulePersist();
    for (const fn of subscribers) {
        try { fn(key, value, cache); } catch (e) { console.error('settings subscriber', e); }
    }
}

function setMany(partial) {
    Object.assign(cache, partial);
    schedulePersist();
    for (const fn of subscribers) {
        try { fn(null, null, cache); } catch (e) { console.error('settings subscriber', e); }
    }
}

function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
}

module.exports = { init, getAll, get, set, setMany, subscribe, DEFAULTS };
