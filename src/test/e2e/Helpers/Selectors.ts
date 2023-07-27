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
    CftEmailField: '#username',
    CftPasswordField: '#password',
    UserLoginContinue: '#next',
    CftSignInButton: '.button',

    // Search selectors
    SearchTitle: 'h1.govuk-label-wrapper',
    SearchResultTitle: 'h1.govuk-heading-l',
    SearchAToZLink: '#main-content a.govuk-link:nth-child(2)',

    // SearchResults selectors
    LinkResult: 'tbody > tr.govuk-table__row > th > a',

    //Alphabetical Search selectors
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

    // LiveCaseResults selectors
    GlossaryTerm: 'tbody > tr.govuk-table__row > td.govuk-table__cell:nth-child(4) > a.govuk-link',

    // CaseEventGlossary selectors
    AppealInterpreterSworn: '#selector-2',

    // AddSubscription selector
    LiveHearingsTableFirstValidResult: 'tbody > tr.govuk-table__row > td > a',

    // CourtNameSearch selectors
    ApplyFiltersButton: '.moj-filter__options > .govuk-button',
    ClearFiltersLink: '.moj-filter__heading-action > p > a',
    RemoveFirstFilterLink: '.moj-filter__selected > .moj-filter-tags > li > a',
    FilterTags: '.moj-filter__tag',

    CourtNameSearchContinueButton: '.moj-action-bar > .govuk-button',
    TribunalCourtCheckbox:
        '.govuk-table__body > tr > .govuk-table__cell > .govuk-checkboxes__item > .govuk-checkboxes__input',
    CourtTableResults: 'tbody:nth-child(2) > tr.govuk-table__row',

    // MockSession selectors
    UsernameInput: '#username',
    UserIdInput: '#id',
    UserType: '#userType',

    // SubscriptionConfirmed selectors
    PanelTitle: 'h1.govuk-panel__title',
    PanelBody: '.govuk-panel__body',

    // UnsubscribeConfirmation selectors
    panelTitle: '.govuk-panel__title',
    panelHome: '.govuk-link=Home',

    // BulkUnsubscribe selectors
    BulkUnsubscribeButton: '#bulk-unsubscribe-button',

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
    sensitivityInput: '#classification',
    listTypeInput: '#listType',

    // Admin dashboard selectors
    ManageMediaAccounts: '#card-media-applications',
    CreateAdminAccount: '#card-create-admin-account',
    BlobExplorerLocations: '#card-blob-view-locations',

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
    SjpPublicListItem: '*=Single Justice Procedure Public List',

    // SJP public selector
    DownloadACopyButton: '#download-button',

    // SJP press selector
    PostcodeFilter: '#postcodes-2',
    ProsecutorFilter: '#prosecutors-3',
    SjpPressSummaryList: '.govuk-summary-list--no-border',
    ShowFiltersButton: '#show-filters',
    SearchFilters: '#search-filters',
    Filters: '.govuk-checkboxes__item',

    // List download selector
    AgreeCheckBox: '#disclaimer-agreement',

    // Blob Explorer Location Selector
    locationSelector: '.govuk-table__body > tr:nth-child(1) > th:nth-child(1) > a:nth-child(1)',

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

    // RemoveListSearchResults selectors
    RemovalTableContentDateButton: 'thead > tr.govuk-table__row > th:nth-child(3) > button',
    RemovalTableFirstRowContentDateCell: 'tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(3)',

    //MediaAccountRequests selectors
    MediaAccountView: 'a.govuk-table__cell:nth-last-child(1)',

    //MediaAccountReviewPage
    MediaAccountReviewApprove: '#approve',
    MediaAccountReviewReject: '#reject',

    //MediaAccountApprovalPage
    MediaAccountApprovalNo: '#no',
    MediaAccountApprovalSubmitButton: '.govuk-button',

    //MediaAccountRejectionReasonsPage
    MediaAccountDetailsNoMatch: '#rejection-reasons-2',
    MediaAccountRejectionContinue: '#button',
    fieldSetTitle: 'h1.govuk-fieldset__heading',

    //MediaAccountRejectionPage
    MediaAccountRejectionYes: '#yes',
    MediaAccountRejectionSubmitButton: '.govuk-button',

    //MediaAccountRejectionConfirmationPage
    MediaAccountRejectionConfirmationPanelTitle: '.govuk-panel__title',

    //System admin dashboard selectors
    ReferenceDataUploadFile: '#card-manual-reference-data-upload',
    ManageThirdPartyUsers: '#card-manage-third-party-users',
    referenceDataFileUpload: '#manual-reference-data-upload',
    DeleteCourt: '#card-delete-court-reference-data',

    //DeleteReferenceCourt selectors
    DeleteCourtLink: '//*[@id="main-content"]/div/table/tbody/tr[1]/td[5]/a',
    DeletedSelectOption: '#delete-choice',
    'delete-choice': '#delete-choice',

    userManagement: '#card-user-management',
    BulkCreateMediaAccounts: '#card-bulk-create-media-accounts',

    //BulkCreateMediaAccounts page
    BulkMediaAccountsFileUpload: '#bulk-account-upload',

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

    // CFT Rejected login page selectors
    firstParagraphCftRejected: '/html/body/div[2]/main/p[1]',
};
