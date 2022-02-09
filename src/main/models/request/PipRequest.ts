import { Request } from 'express';

export interface PipRequest extends Request {
  i18n?: {
    getDataByLanguage: (lng: string) => {
      'home': {};
      'template': {};
      'account-request-submitted': {};
      'alphabetical-search': {};
      'create-media-account': {};
      'error': {};
      'hearing-list': {};
      'live-case-alphabet-search': {};
      'live-case-status': {};
      'not-found': {};
      'otp-template': {};
      'search': {};
      'search-results': {};
      'subscription-management': {};
      'view-option': {};
      'single-justice-procedure': {};
      'subscription-add': {};
      'case-reference-number-search': {};
      'case-reference-number-search-results': {};
      'subscription-urn-search': {};
      'subscription-urn-search-result': {};
      'court-name-search': {};
      'case-name-search': {};
      'case-name-search-results': {};
      'warned-list': {};
      'list-option': {};
      'session-management': {};
      'standard-list': {};
      'account-home': {};
      'delete-subscription': {};
      'unsubscribe-confirmation': {};
      'sign-in': {};
      'manual-upload': {};
    };
  };
  lng?: string;
  user?: object;
  file?: File;
}
