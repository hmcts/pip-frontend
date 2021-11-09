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
      'single-justice-procedure-search': {};
      'subscription-add': {};
      'court-name-search': {};
      'case-name-search': {};
      'case-name-search-results': {};
      'list-option': {};
      'session-management': {};
      'standard-list': {};
    };
  };
  lng?: string;
  user?: object;
}
