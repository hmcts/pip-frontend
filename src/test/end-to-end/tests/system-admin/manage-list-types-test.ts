Feature('System admin manage list types');

Scenario('I as a system admin should be able to delete a user', async ({ I }) => {
    I.loginAsSsoSystemAdmin();
    I.click('Dashboard');
    I.click('#card-manage-list-types');
    I.waitForText('Manage list types');
    I.see('Single Justice Procedure Public List (Full List)');
    I.click(locate('//tr').withText('Single Justice Procedure Public List (Full List)').find('a').withText('Manage'));
    I.waitForText('Configure list type search fields for Single Justice Procedure Public List (Full List)');
    I.see('Enter the JSON field names used to extract case details for this list type.');
    I.see('Case number JSON field name');
    I.see('Case name JSON field name');
    I.see('Continue');
});
