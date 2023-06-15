Feature('Cft-idam user configure list - list type filtering');

Scenario(
    'I as a cft-idam user should be able to configure only sjp public list for single justice procedure',
    async ({ I }) => {
        I.loginAsCftUser();
        I.waitForText('Your account');
        I.click('#card-subscription-management');
        I.waitForText('Your email subscriptions');
        I.click('Add email subscription');
        I.waitForText('How do you want to add an email subscription?');
        I.see('You can only search for information that is currently published.');
        I.click('#subscription-choice-1');
        I.click('Continue');
        I.checkOption('//*[@id="' + 9 + '"]');
        I.click('Continue');
        I.click('Confirm Subscriptions');
        I.waitForText('Subscription(s) confirmed');
        I.see('Your subscription(s) has been added successfully');

        I.click('Email subscriptions');
        I.waitForText('Single Justice Procedure');
        I.click('Select which list types to receive');
        I.waitForText('Select List Types');
        I.click(locate('//input').withAttr({ value: 'Single Justice Procedure' }));
        I.click('Apply filters');
        I.see('Single Justice Procedure Public List');
        I.seeCheckboxIsChecked('#SJP_PUBLIC_LIST');
        I.dontSee('Single Justice Procedure Press List');
        I.click('Continue');
        I.waitForText('Court Subscription(s) refined');
        I.see('Your subscription(s) has been amended successfully');

        I.click('Email subscriptions');
        I.click(locate('//tr').withText('Single Justice Procedure').find('a').withText('Unsubscribe'));
        I.waitForText('Are you sure you want to remove this subscription?');
        I.click('#unsubscribe-confirm');
        I.click('Continue');
        I.waitForText('Your subscription has been removed.');

        I.logout();
    }
);
