module.exports = {
  // Common selectors
  ContinueButton: '.govuk-button',
  CommonPageTitle: '.govuk-heading-l',
  CommonPageTitleM: '.govuk-heading-m',
  SignInButton: '#signInButton',
  Results: 'tbody > tr.govuk-table__row',
  // Home page selectors
  StartNowButton: '.govuk-button--start',
  MainHeader: 'h1.govuk-heading-xl',
  // Search options page selectors
  SearchOptionsTitle: 'h1.govuk-fieldset__heading',
  RadioButton: 'div.govuk-radios__item',
  SearchRadioButton: '#find-choice',
  FindRadioButton: '#find-choice-2',
  // Search page selectors
  SearchTitle: 'h1.govuk-label-wrapper',
  SearchResultTitle: 'h1.govuk-heading-l',
  SearchInput: '#search-input',
  // Search results page selectors
  LinkResult: 'tbody > tr.govuk-table__row > th > a',
  // Hearing List selectors

  //Alphabetical Search selectors
  AlphabeticalHeading: '#page-heading',
  BackToTopButton: '#back-to-top-button',
  KeySelector: (letter): string => {
    return '#' + letter + '-selector';
  },
  RowSelector: (letter): string => {
    return '#' + letter;
  },
  SecondItemResult: 'tbody > tr.govuk-table__row:nth-child(2) > td > a',

  // ViewOption page selectors
  ViewOptionsTitle: 'h1.govuk-fieldset__heading',
  ViewSearchRadioButton: '#view-choice',
  LiveHearingsRadioButton: '#view-choice-2',
  SingleJusticeProcedureRadioButton: '#view-choice-3',

  //SubscriptionAdd selectors
  SubscriptionAddTitle: 'h1.govuk-fieldset__heading',
  SubscriptionAddByCaseRefNumber: '#subscription-choice-1',
  SubscriptionAddByUniqueRefNumber: '#subscription-choice-2',
  SubscriptionAddByCaseName: '#subscription-choice-3',
  SubscriptionAddByCourtOrTribunal: '#subscription-choice-4',

  // LiveCaseAlphabetSearch selectors
  LiveHearingsTableFirstValidResult: 'tbody > tr.govuk-table__row:nth-child(2) > td > a',

  // CaseNameSearch selectors
  CaseNameInput: '#case-name',
  CaseNameSearchErrorSummaryTitle: '.govuk-error-summary__title',

  // CaseNameSearchResults selectors
  CaseNameSearchResultsCheckbox: 'tbody > tr.govuk-table__row > td > .govuk-checkboxes__input',
  CaseNameSearchResultsHeaderCheckbox: 'thead > tr.govuk-table__row > th > .govuk-checkboxes__input',

  // CourtNameSearch selectors
  JurisdictionCheckbox: '#Jurisdiction',
  ApplyFiltersButton: '.moj-filter__options > .govuk-button',
  ClearFiltersLink: '.moj-filter__heading-action > p > a',

  // MockSession selectors
  UsernameInput: '#username',
  UserIdInput: '#id',
  UserType: '#userType',
};
