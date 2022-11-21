module.exports = {
  // Cookie selectors outside main content
  AcceptButton: '#cookie-banner-accept-button',
  HideMessageButton: '#cookie-banner-hide-button',
  CookieHeader: '.govuk-cookie-banner__heading',

  // Common selectors
  ContinueButton: '//*[@id="main-content"]//*[contains(@class, "govuk-button")]',
  CommonPageTitleXl: '.govuk-heading-xl',
  CommonPageTitle: '.govuk-heading-l',
  CommonPageTitleM: '#main-content > .govuk-heading-m',
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
  SearchAToZLink: '#main-content a.govuk-link:nth-child(2)',

  // SearchResults selectors
  LinkResult: 'tbody > tr.govuk-table__row > th > a',

  //Alphabetical Search selectors
  AlphabeticalHeading: '#page-heading',
  BackToTopButton: '#back-to-top-button',
  SingleJusticeProcedureLink: '#sjp-link',

  //SessionLoggedOut selectors
  SessionLoggedOutTitle: 'h1.govuk-heading-l',

  KeySelector: (letter): string => {
    return '#' + letter + '-selector';
  },
  RowSelector: (letter): string => {
    return '#' + letter;
  },
  FirstItemResult: 'tbody > tr.govuk-table__row > td > a',
  SecondItemResult: 'tr.govuk-table__row:nth-child(2) > td:nth-child(2) > a:nth-child(1)',
  LastItemResult: 'tbody > tr.govuk-table__row:last-child > td > a',
  SJPLink: '#sjp-link',
  JurisdictionFilter1: '#Jurisdiction-3',
  RegionFilter1: '#Region-8',
  RegionFilter2: '#Region-2',

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
  SubscriptionManagementBulkDeleteSubscriptionsButton: '#bulk-delete-button',

  // DeleteSubscription selectors
  yesRadioButton: '#unsubscribe-confirm',
  noRadioButton: '#unsubscribe-confirm-2',

  // UnsubscribeConfirmation selectors
  panelTitle: '.govuk-panel__title',
  panelHome: '.govuk-link=Home',

  // BulkDeleteSubscriptions selectors
  CourtSubscriptionCheckbox1: '#courtSubscription',
  BulkDeleteSubscriptionButton: '#bulk-delete-button',
  BulkDeleteRadioYes: '#bulk-delete-choice',

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

  // Admin dashboard selectors
  UploadFile: '#card-manual-upload',
  RemoveContent: '#card-remove-list-search',
  ManageMediaAccounts: '#card-media-applications',
  CreateAdminAccount: '#card-create-admin-account',

  // CreateMediaAccount selectors
  UploadImage: '#file-upload',
  NameInput: '#fullName',
  EmailInput: '#emailAddress',
  EmployerInput: '#employer',
  CheckBox: '#tcbox',

  // AccountHome selectors
  EmailSubscriptionLink: '#card-subscription-management',
  CourtSearchLink: '#card-search',
  SJPCardLink: 'a=Single Justice Procedure cases',

  // SummaryOfPublications selectors
  SOPListItem: '.das-search-results__link',

  // Banner navigation selectors
  BannerHome: '.moj-sub-navigation__item:first-child',
  BannerFindCourt: '.moj-sub-navigation__item:nth-child(2)',
  BannerSJP: '.moj-sub-navigation__item:nth-child(3)',
  BannerSignIn: '.moj-sub-navigation__item:nth-child(4)',

  // Signed in banner selectors
  SignedInBannerEmailSubs: '.moj-sub-navigation__item:nth-child(4)',
  SignedInBannerFindCourt: '.moj-sub-navigation__item:nth-child(2)',
  SignedInBannerSJP: '.moj-sub-navigation__item:nth-child(3)',
  SignedInBannerSignOut: '.moj-sub-navigation__item:nth-child(5)',

  // CreateAdminAccount selectors
  FirstNameInput: '#firstName',
  LastNameInput: '#lastName',
  UserRoleRadio: '#user-role',

  //Admin SignIn Page Title
  AdminPageTitle: 'h2',

  // RemoveListSearch selectors
  'remove-choice': '#remove-choice',

  //MediaAccountRequests selectors
  MediaAccountView: 'a.govuk-table__cell:nth-last-child(1)',

  //MediaAccountReviewPage
  MediaAccountReviewApprove: '#approve',
  MediaAccountReviewReject: '#reject',

  //MediaAccountApprovalPage
  MediaAccountApprovalNo: '#no',
  MediaAccountApprovalSubmitButton: '.govuk-button',

  //MediaAccountRejectionPage
  MediaAccountRejectionYes: '#yes',
  MediaAccountRejectionSubmitButton: '.govuk-button',

  //MediaAccountRejectionConfirmationPage
  MediaAccountRejectionConfirmationPanelTitle: '.govuk-panel__title',

  //CreateSystemAdminAccount selectors
  CreateSystemAdminAccount: '#card-create-system-admin-account',
  ReferenceDataUploadFile: '#card-manual-reference-data-upload',
  referenceDataFileUpload: '#manual-reference-data-upload',
  userManagement: '#card-user-management',

  //UserManagement screens selectors
  manageLink: '#manage-link',
  applyFiltersButton: '.moj-filter__options > .govuk-button',
  changeLink: '//*[@id="main-content"]/div/dl/div[3]/dd[2]/a',
  roleUpdateButton: '#button',
  roleUpdateSelectBox: '#updatedRole',
  userManagementPanelTitle: '.govuk-panel__title',
  userManagementPanelBody: '.govuk-panel__body',
  redirectToDashboardLink: '#main-content > div.parent-box > p > a',
  deleteUserButton: '//*[@id="main-content"]/div/a',
  deleteUserConfirmRadioButton: '#delete-user-confirm',
  continueButton: '#button',
};
