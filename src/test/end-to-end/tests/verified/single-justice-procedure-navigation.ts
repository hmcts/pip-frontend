Feature('Verified user single Justice Procedure page navigation');

Scenario('I as a verified user should be able to navigate to Single Justice Procedure page', async ({ I }) => {
    I.loginAsMediaUser();
    I.see('Single Justice Procedure cases');
    I.see(
        'Cases ready to be decided by a magistrate without a hearing. Includes TV licensing, minor traffic offences such as speeding and more.'
    );
    I.click('#card-summary-of-publications\\?locationId\\=9');
    I.waitForText('What do you want to view from Single Justice Procedure?');

    I.click('Dashboard');
    I.click('#card-search');
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', 'Single Justice Procedure');
    I.click('Continue');
    I.waitForText('What do you want to view from Single Justice Procedure?');

    I.logout();
});
