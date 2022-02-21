import { Request } from 'express';

export interface PipRequest extends Request {
  i18n?: {
    getDataByLanguage: (lng: string) => {
      'account-home': {};
      'alphabetical-search': {};
      'account-request-submitted': {};
      'case-name-search': {};
      'case-name-search-results': {};
      'case-reference-number-search': {};
      'case-reference-number-search-results': {};
      'court-name-search': {};
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
