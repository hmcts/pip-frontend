import { HomePage } from '../pageobjects/Home.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';
import { HearingListPage } from '../pageobjects/HearingList.page';
import { SearchPage } from '../pageobjects/Search.page';
import { SearchResultsPage } from '../pageobjects/SearchResults.page';

const homePage = new HomePage;
let searchOptionsPage: SearchOptionsPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let searchResultsPage: SearchResultsPage;

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing title', async () => {
    await homePage.open('');
    expect(await homePage.pageTitle()).toEqual('Find a court or tribunal listing');
  });

  it('should click on the "Start now button and navigate to Search Options page', async () => {
    searchOptionsPage = await homePage.clickStartNowButton();
    expect(await searchOptionsPage.pageTitle()).toEqual('Find a court or tribunal list');
  });

  it('should see both radio buttons', async () => {
    expect(await searchOptionsPage.radioButtons).toBe(2);
  });

  describe('Following the \'find\' path', () => {
    after(async () => {
      await homePage.open('');
      searchOptionsPage = await homePage.clickStartNowButton();
    });

    it('should select \'find\' option and navigate to alphabetical search page', async() => {
      await searchOptionsPage.selectFindRadio();
      alphabeticalSearchPage = await searchOptionsPage.clickContinueForAlphabetical();
      expect(await alphabeticalSearchPage.pageTitle()).toEqual('Find a court or tribunal listing');
    });

    it('should select \'Z\' option, and navigate to the end of the page', async() => {
      const endLetter = 'Z';
      await alphabeticalSearchPage.selectLetter(endLetter);
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible('Z')).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async() => {
      const startLetter = 'A';
      await alphabeticalSearchPage.selectBackToTop();
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });

    it('selecting first result should take you to to the hearings list page', async() => {
      hearingListPage = await alphabeticalSearchPage.selectFirstListResult();
      expect(await hearingListPage.pageTitle()).toEqual('Albertville Court hearing list');
    });

    it('should display 1 result', async() => {
      expect(await hearingListPage.getResults()).toBe(1);
    });
  });

  describe('Following the \'search\' path', () => {
    const searchTerm = 'aylesbury';
    const expectedNumOfResults = 2;
    const expectedNumOfHearings = 3;

    it('should select \'search\' option and navigate to search page', async() => {
      await searchOptionsPage.selectSearchRadio();
      searchPage = await searchOptionsPage.clickContinueForSearch();
      expect(await searchPage.pageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    it('should enter text and click continue', async() => {
      await searchPage.enterText(searchTerm);
      searchResultsPage = await searchPage.clickContinue();
      expect(await searchResultsPage.pageTitle()).toEqual(`Courts or tribunals in ${searchTerm}`);
    });

    it(`should display ${expectedNumOfResults} results`, async() => {
      expect(await searchResultsPage.getResults()).toBe(2);
    });

    it('should navigate to hearing list page', async() => {
      hearingListPage = await searchResultsPage.selectCourt();
      expect(await hearingListPage.pageTitle()).toEqual('Aylesbury Crown Court hearing list');
    });

    it(`should display ${expectedNumOfHearings} results`, async() => {
      expect(await hearingListPage.getResults()).toBe(3);
    });
  });
});
