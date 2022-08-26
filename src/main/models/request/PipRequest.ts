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
      'error': {};
      'file-upload-confirm': {};
      'hearing-list': {};
      'home': {};
      'list-option': {};
      'live-case-alphabet-search': {};
      'live-case-status': {};
      'location-name-search': {};
      'manual-upload': {};
      'manual-upload-summary': {};
      'media-applications': {};
      'not-found': {};
      'remove-list-confirmation': {};
      'remove-list-search': {};
      'remove-list-search-results': {};
      'remove-list-success': {};
      'search': {};
      'search-results': {};
      'session-management': {};
      'sign-in': {};
      'single-justice-procedure': {};
      'standard-list': {};
      'subscription-add': {};
      'subscription-management': {};
      'subscription-urn-search': {};
      'subscription-urn-search-result': {};
      'template': {};
      'unsubscribe-confirmation': {};
      'view-option': {};
      'warned-list': {};
    };
  };
  lng?: string;
  user?: object;
  file?: File;
}
