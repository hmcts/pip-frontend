Feature('Search for court or tribunal');

const invalidCourtName = 'InvalidCourt';

Scenario('I should be able to view error summary if no results', async ({ I }) => {
    I.amOnPage('/search');
    I.waitForText('What court or tribunal are you interested in?');
    I.fillField('#search-input', invalidCourtName);
    I.see('No results found');

    I.click('Continue');
    I.waitForText('No results found');
    I.see('There is nothing matching your criteria')
});

Scenario('I should be able to view error summary in Welsh if no results', async ({ I }) => {
    I.amOnPage('/search');
    I.waitForText('What court or tribunal are you interested in?');
    I.click(locate('//a').withText('Cymraeg'));
    I.waitForText('Ym mha lys neu dribiwnlys y mae gennych ddiddordeb?');
    I.fillField('#search-input', invalidCourtName);
    I.see('Ni ddaethpwyd o hyd i unrhyw ganlyniad');

    // The field needs to be cleared first before continuing because the dropdown is hiding the button
    I.clearField('#search-input');
    I.click('Parhau');
    I.waitForText('Ni ddaethpwyd o hyd i unrhyw ganlyniad');
    I.see('Nid oes dim sy\'n cyfateb i\'ch meini prawf')
});
