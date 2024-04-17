import { Request } from 'express';

export interface PipRequest extends Request {
    i18n?: {
        getDataByLanguage: (lng: string) => {
            'account-home': object;
            'account-request-submitted': object;
            'admin-dashboard': object;
            'alphabetical-search': object;
            'case-name-search': object;
            'case-name-search-results': object;
            'case-reference-number-search': object;
            'case-reference-number-search-results': object;
            'cookie-policy': object;
            'create-admin-account': object;
            'create-admin-account-summary': object;
            'create-media-account': object;
            'delete-subscription': object;
            error: object;
            'file-upload-confirm': object;
            home: object;
            'list-option': object;
            'location-name-search': object;
            'manage-third-party-users': object;
            'manage-third-party-users-view': object;
            'manual-upload': object;
            'manual-upload-summary': object;
            'media-applications': object;
            'not-found': object;
            'party-name-search': object;
            'party-name-search-results': object;
            'remove-list-confirmation': object;
            'remove-list-search': object;
            'remove-list-search-results': object;
            'remove-list-success': object;
            search: object;
            'search-results': object;
            'sign-in': object;
            'single-justice-procedure': object;
            'standard-list': object;
            'subscription-add': object;
            'subscription-configure-list': object;
            'subscription-management': object;
            'system-admin-dashboard': object;
            template: object;
            'unsubscribe-confirmation': object;
            'view-option': object;
            'list-not-found': object;
        };
    };
    lng?: string;
    user?: object;
    file?: File;
}
