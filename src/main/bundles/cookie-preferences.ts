import cookieManager from '@hmcts/cookie-manager';

cookieManager.on('UserPreferencesLoaded', preferences => {
    const dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: 'Cookie Preferences',
        cookiePreferences: preferences,
    });
});

cookieManager.on('UserPreferencesSaved', preferences => {
    const dataLayer = window.dataLayer || [];
    const dtrum = window.dtrum;

    dataLayer.push({
        event: 'Cookie Preferences',
        cookiePreferences: preferences,
    });

    if (dtrum !== undefined) {
        if (preferences.apm === 'on') {
            dtrum.enable();
            dtrum.enableSessionReplay();
        } else {
            dtrum.disableSessionReplay();
            dtrum.disable();
        }
    }
});

const config = {
    userPreferences: {
        cookieName: 'court-and-tribunal-hearings-cookie-preferences',
    },
    cookieManifest: [
        {
            categoryName: 'essential',
            optional: false,
            cookies: ['i18next', 'formCookie', 'createAdminAccount', 'session.sig', 'session'],
        },
        {
            categoryName: 'analytics',
            cookies: ['_ga', '_gid', '_gat_UA-', '_gat'],
        },
        {
            categoryName: 'apm',
            cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'],
        },
    ],
};

cookieManager.init(config);
