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
      'court-name-search': {};
      'create-admin-account': {};
      'create-media-account': {};
      'delete-subscription': {};
      'error': {};
      'file-upload-confirm': {};
      'hearing-list': {};
      'home': {};
      'list-option': {};
      'interstitial': {};
      'live-case-alphabet-search': {};
      'live-case-status': {};
      'manual-upload': {};
      'manual-upload-summary': {};
      'not-found': {};
      'otp-template': {};
      'remove-list-search': {};
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
