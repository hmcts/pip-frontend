module.exports = {
  // Common selectors
  ContinueButton: '.govuk-button',
  CommonPageTitle: '.govuk-heading-l',
  CommonPageTitleM: '.govuk-heading-m',
  SubscriptionsButton: '#subscriptionHeaderButton',
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
  SearchCaseResultTitle: 'h1.govuk-heading-l',
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
  FirstItemResult: 'tbody > tr.govuk-table__row > td > div > a',

  // OtpLogin page selectors
  OtpInput: '#otp-code',

  // ViewOption page selectors
  ViewOptionsTitle: 'h1.govuk-fieldset__heading',
  ViewSearchRadioButton: '#view-choice',
  LiveHearingsRadioButton: '#view-choice-2',
  SingleJusticeProcedureRadioButton: '#view-choice-3',

  // LiveCaseAlphabetSearch selectors
  LiveHearingsTableFirstResult: 'tbody > tr.govuk-table__row > td > a',
};
