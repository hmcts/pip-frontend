import { HomePage } from '../pageobjects/Home.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';

const homePage = new HomePage;
let searchOptionsPage: SearchOptionsPage;

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing title', async () => {
    await homePage.open('');
    await expect(homePage.pageTitle).toHaveTextContaining('Find a court or tribunal listing');
  });

  it('should click on the "Start now button and navigate to Search Options page', async () => {
    await homePage.open('');
    searchOptionsPage = await homePage.clickStartNowButton();
    await expect(searchOptionsPage.pageTitle).toHaveTextContaining('Find a court or tribunal list');
  });
});
