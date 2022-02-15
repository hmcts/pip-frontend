module.exports = {
  // Common selectors
  ContinueButton: '.govuk-button',
  CommonPageTitleXl: '.govuk-heading-xl',
  CommonPageTitle: '.govuk-heading-l',
  CommonPageTitleM: '.govuk-heading-m',
  SignInButton: '#signInButton',
  SignOutButton: '#signOutButton',
  Results: 'tbody > tr.govuk-table__row',
  SearchInput: '#search-input',

  // Home selectors
  MainHeader: '.gem-c-title__text',
  ServiceLink: '#linkToService',

  // SearchOptions selectors
  SearchOptionsTitle: 'h1.govuk-fieldset__heading',
  RadioButton: 'div.govuk-radios__item',

  // Sign-in routing
  SignInRadio1: '#sign-in',
  SignInRadio2: '#sign-in-2',
  SignInRadio3: '#sign-in-3',
  EmailField: '#email',
  PasswordField: '#password',
  UserLoginContinue: '#next',

  // Search selectors
  SearchTitle: 'h1.govuk-label-wrapper',
  SearchResultTitle: 'h1.govuk-heading-l',
  SearchAToZLink: 'a.govuk-link',

  // SearchResults selectors
  LinkResult: 'tbody > tr.govuk-table__row > th > a',

  //Alphabetical Search selectors
  AlphabeticalHeading: '#page-heading',
  BackToTopButton: '#back-to-top-button',
  SingleJusticeProcedureLink: '#sjp-link',

  KeySelector: (letter): string => {
    return '#' + letter + '-selector';
  },
  RowSelector: (letter): string => {
    return '#' + letter;
  },
  FirstItemResult: 'tbody > tr.govuk-table__row > td > a',
  SecondItemResult: 'tr.govuk-table__row:nth-child(2) > td:nth-child(2) > a:nth-child(1)',
  SJPLink: '#sjp-link',
  MagistratesFilter: '#Jurisdiction-4',
  NorthWestFilter: '#Region-7',

  // ViewOption page selectors
  ViewOptionsTitle: 'h1.govuk-fieldset__heading',
  CourtOrTribunalRadioButton: '#view-choice',
  SingleJusticeProcedureRadioButton: '#view-choice-2',

  //SubscriptionAdd selectors
  SubscriptionAddTitle: 'h1.govuk-fieldset__heading',
  SubscriptionAddByCaseRefNumber: '#subscription-choice-1',
  SubscriptionAddByUniqueRefNumber: '#subscription-choice-2',
  SubscriptionAddByCaseName: '#subscription-choice-3',
  SubscriptionAddByCourtOrTribunal: '#subscription-choice-4',

  // LiveCaseAlphabetSearch selectors
  LiveHearingsTableFirstResult: 'tbody > tr.govuk-table__row > td > a',

  // LiveCaseResults selectors
  GlossaryTerm: 'tbody > tr.govuk-table__row > td.govuk-table__cell:nth-child(4) > a.govuk-link',

  // CaseEventGlossary selectors
  AppealInterpreterSworn: '#selector-2',

  // AddSubscription selector
  UrnSearchRadioButton: '#subscription-choice-2',
  LiveHearingsTableFirstValidResult: 'tbody > tr.govuk-table__row > td > a',

  // CaseNameSearch selectors
  CaseNameInput: '#case-name',
  CaseNameSearchErrorSummaryTitle: '.govuk-error-summary__title',

  // CaseNameSearchResults selectors
  CaseNameSearchResultsCheckbox: 'tbody > tr.govuk-table__row > td > .govuk-checkboxes__item > .govuk-checkboxes__input',
  CaseNameSearchResultsHeaderCheckbox: 'thead > tr.govuk-table__row > th > .govuk-checkboxes__input',

  // CourtNameSearch selectors
  JurisdictionCheckbox: '#Jurisdiction',
  ApplyFiltersButton: '.moj-filter__options > .govuk-button',
  ClearFiltersLink: '.moj-filter__heading-action > p > a',
  CourtNameSearchContinueButton: '.moj-action-bar > .govuk-button',
  TribunalCourtCheckbox: '.govuk-table__body > tr > .govuk-table__cell > .govuk-checkboxes__item > .govuk-checkboxes__input',
  CourtTableResults: 'tbody:nth-child(2) > tr.govuk-table__row',

  // MockSession selectors
  UsernameInput: '#username',
  UserIdInput: '#id',
  UserType: '#userType',

  // SubscriptionConfirmed selectors
  PanelTitle: 'h1.govuk-panel__title',
  PanelBody: '.govuk-panel__body',

  // SubscriptionManagement selectors
  SubscriptionManagementTableFirstResultUrl: '>>>.unsubscribe-action',

  // DeleteSubscription selectors
  yesRadioButton: '#unsubscribe-confirm',
  noRadioButton: '#unsubscribe-confirm-2',

  // UnsubscribeConfirmation selectors
  panelTitle: '.govuk-panel__title',

  // Admin selectors
  fileUpload: '#manual-file-upload',
  contentDateFromDay: '#content-date-from-day',
  contentDateFromMonth: '#content-date-from-month',
  contentDateFromYear: '#content-date-from-year',
  contentDateToDay: '#content-date-to-day',
  contentDateToMonth: '#content-date-to-month',
  contentDateToYear: '#content-date-to-year',
  displayDateFromDay: '#display-date-from-day',
  displayDateFromMonth: '#display-date-from-month',
  displayDateFromYear: '#display-date-from-year',
  displayDateToDay: '#display-date-to-day',
  displayDateToMonth: '#display-date-to-month',
  displayDateToYear: '#display-date-to-year',

  // AccountHome selectors
  EmailSubscriptionLink: '#card-subscription-management',
};
