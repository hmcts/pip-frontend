Feature('System admin audit log');

Scenario('I as a system admin should be able to view audit log', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.see('System Admin Dashboard');
    I.click('#card-audit-log-viewer');
    I.see('System admin audit log');
    I.click('View');
    I.see('View audit log for');
    I.logout();
}).tag('@Nightly');
