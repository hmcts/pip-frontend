import { HomePage } from '../pageobjects/Home.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';

const homePage = new HomePage;
let searchOptionsPage: SearchOptionsPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing title', async () => {
    await homePage.open('');
    await expect(homePage.pageTitle).toHaveTextContaining('Find a court or tribunal listing');
  });

  it('should click on the "Start now button and navigate to Search Options page', async () => {
    searchOptionsPage = await homePage.clickStartNowButton();
    await expect(searchOptionsPage.pageTitle).toHaveTextContaining('Find a court or tribunal list');
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
      await expect(alphabeticalSearchPage.pageTitle).toHaveTextContaining('Find a court or tribunal listing');
    });

    it('should select \'Z\' option, and navigate to the end of the page', async() => {
      const endLetter = 'Z';
      await alphabeticalSearchPage.selectLetter(endLetter);
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible('Z')).toBeTruthy();
    });

  });
});
