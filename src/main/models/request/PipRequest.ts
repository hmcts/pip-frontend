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
      'otp-login': {};
      'otp-login-testing': {};
      'search': {};
      'search-option': {};
      'search-results': {};
      'subscription-management': {};
      'view-option': {};
      'single-justice-procedure-search': {};
      'status-description': {};

    };
  };
  lng?: string;
}
