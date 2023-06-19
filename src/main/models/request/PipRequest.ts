import { Request } from 'express';

export interface PipRequest extends Request {
    i18n?: {
        getDataByLanguage: (lng: string) => {
            'account-home': {};
            'account-request-submitted': {};
            'admin-dashboard': {};
            'alphabetical-search': {};
            'case-name-search': {};
            'case-name-search-results': {};
            'case-reference-number-search': {};
            'case-reference-number-search-results': {};
            'cookie-policy': {};
            'create-admin-account': {};
            'create-admin-account-summary': {};
            'create-media-account': {};
            'delete-subscription': {};
            error: {};
            'file-upload-confirm': {};
            home: {};
            'list-option': {};
            'live-case-alphabet-search': {};
            'live-case-status': {};
            'location-name-search': {};
            'manage-third-party-users': {};
            'manage-third-party-users-view': {};
            'manual-upload': {};
            'manual-upload-summary': {};
            'media-applications': {};
            'not-found': {};
            'party-name-search': {};
            'party-name-search-results': {};
            'remove-list-confirmation': {};
            'remove-list-search': {};
            'remove-list-search-results': {};
            'remove-list-success': {};
            search: {};
            'search-results': {};
            'session-management': {};
            'sign-in': {};
            'single-justice-procedure': {};
            'standard-list': {};
            'subscription-add': {};
            'subscription-configure-list': {};
            'subscription-management': {};
            'system-admin-dashboard': {};
            template: {};
            'unsubscribe-confirmation': {};
            'view-option': {};
            'warned-list': {};
            'list-not-found': {};
        };
    };
    lng?: string;
    user?: object;
    file?: File;
}
