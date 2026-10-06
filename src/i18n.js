let translations = {};

async function loadLocale(lang) {
    try {
        const res = await fetch(`./locales/${lang}.json`);
        if (res.ok) {
            translations = await res.json();
            applyTranslations();
        }
    } catch (e) {
        console.error('Failed to load locale', e);
    }
}

function t(key) {
    return translations[key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
}
