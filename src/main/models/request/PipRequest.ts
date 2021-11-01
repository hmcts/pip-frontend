import { Request } from 'express';

export interface PipRequest extends Request {
  i18n?: {
    getDataByLanguage: (lng: string) => {
      'home': {};
      'template': {};
      'alphabetical-search': {};
      'error': {};
      'hearing-list': {};
      'live-case-alphabet-search': {};
      'live-case-status': {};
      'not-found': {};
      'otp-template': {};
      'search': {};
      'search-option': {};
      'search-results': {};
      'subscription-management': {};
      'view-option': {};
      'single-justice-procedure': {};
      'subscription-add': {};
      'subscription-urn-search': {};
      'subscription-urn-search-result': {};
      'court-name-search': {};
      'case-name-search': {};
      'case-name-search-results': {};
      'warned-list': {};
      'list-option': {};
      'session-management': {};
      'standard-list': {};
      'subscription-case-search': {};
      'subscription-search-case-results': {};
    };
  };
  lng?: string;
  user?: object;
}
