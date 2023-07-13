import { randomData } from '../../shared/random-data';
import { config as testConfig } from '../../../config';

Feature('Admin manage media account request');

const TEST_EMPLOYER = 'HMCTS';

Scenario('I as an admin user should be able to accept valid media account request', async ({ I }) => {
    const testFullName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString() + ' Surname';
    const emailTestMediaAccount = randomData.getRandomEmailAddress();

    I.requestMediaAccount(testFullName, emailTestMediaAccount, TEST_EMPLOYER);

    I.loginAsAdmin();
    I.waitForText('Your Dashboard');
    I.see('CTSC assess new media account applications.');
    I.click('#card-media-applications');
    I.waitForText('Select application to assess');
    I.see(testFullName);
    I.click(locate('//tr').withText(testFullName).find('a').withText('View'));
    I.waitForText("Applicant's details");
    I.see(testFullName);
    I.see(emailTestMediaAccount);
    I.see(TEST_EMPLOYER);
    I.click(locate('//div').withText('Proof of ID').find('a').withText('View'));
    I.switchToNextTab(1);
    I.switchToPreviousTab(1);
    I.see("Applicant's details");
    I.click('#approve');
    I.waitForText('Are you sure you want to approve this application?');
    I.see("Applicant's Details");
    I.see(testFullName);
    I.see(emailTestMediaAccount);
    I.see(TEST_EMPLOYER);
    I.click('#yes');
    I.click('Continue');
    I.waitForText('Application has been approved');
    I.see(testFullName);
    I.see(emailTestMediaAccount);
    I.see(TEST_EMPLOYER);
    I.see('What happens next');
    I.see(
        'This account will be created and the applicant will be notified to set up their account. If an account' +
            ' already exists the applicant will be asked to sign in, or choose forgot password.'
    );
    I.logout();

    I.loginAsSystemAdmin();
    I.waitForText('System Admin Dashboard');
    I.click('#card-user-management');
    I.waitForText('User Management');
    I.fillField('#email', emailTestMediaAccount);
    I.click('Apply filters');
    I.waitForText(emailTestMediaAccount);
    I.click('#manage-link');
    I.waitForText('Manage ' + emailTestMediaAccount);
    I.click('Delete user');
    I.waitForText('Are you sure you want to delete ' + emailTestMediaAccount + '?');
    I.click('Yes');
    I.click('Continue');
    I.waitForText('User Deleted');

    I.logout();
});

Scenario(
    'I as an admin user should be able to reject applications and see proper error ' +
        'messages related to media account request',
    async ({ I }) => {
        const testFullName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString() + ' Surname';
        const emailTestMediaAccount = randomData.getRandomEmailAddress();

        I.requestMediaAccount(testFullName, emailTestMediaAccount, TEST_EMPLOYER);

        I.loginAsAdmin();
        I.waitForText('Your Dashboard');
        I.see('CTSC assess new media account applications.');
        I.click('#card-media-applications');
        I.waitForText('Select application to assess');
        I.see(testFullName);
        I.click(locate('//tr').withText(testFullName).find('a').withText('View'));
        I.waitForText("Applicant's details");
        I.see(testFullName);
        I.see(emailTestMediaAccount);
        I.see(TEST_EMPLOYER);
        I.click('#approve');
        I.waitForText('Are you sure you want to approve this application?');
        I.click('#no');
        I.click('Continue');

        I.waitForText("Applicant's details");
        I.click('#reject');
        I.waitForText('Why are you rejecting this application?');
        I.see('Select all that apply.');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('An option must be selected');
        I.click('#rejection-reasons');
        I.click('Continue');
        I.waitForText('Are you sure you want to reject this application?');
        I.click('#no');
        I.click('Continue');

        I.waitForText("Applicant's details");
        I.click('#reject');
        I.waitForText('Why are you rejecting this application?');
        I.click('#rejection-reasons');
        I.click('#rejection-reasons-2');
        I.click('#rejection-reasons-3');
        I.click('Continue');

        I.waitForText('Are you sure you want to reject this application?');
        I.see("Applicant's Details");
        I.see(testFullName);
        I.see(emailTestMediaAccount);
        I.see(TEST_EMPLOYER);
        I.click(locate('//div').withText('Proof of ID').find('a').withText('View'));
        I.switchToNextTab(1);
        I.switchToPreviousTab(1);
        I.click('.govuk-details__summary-text');
        I.waitForText("After you've completed this form, the applicant will be emailed the following:");
        I.see('The applicant is not an accredited member of the media.');
        I.seeElement(locate('//a').withText('Court and tribunal hearings service'));
        I.see('ID provided has expired or is not a Press ID.');
        I.see('Details provided do not match.');
        I.see(
            'You can access the court and tribunal service from the link below should you wish to make a new request.'
        );
        I.seeElement(
            locate('//a').withAttr({
                href: 'https://www.gov.uk/guidance/myhmcts-online-case-management-for-legal-professionals',
            })
        );
        I.click('#yes');
        I.click('Continue');

        I.waitForText('Account has been rejected');
        I.see(testFullName);
        I.see(emailTestMediaAccount);
        I.see(TEST_EMPLOYER);
        I.see('The applicant is not an accredited member of the media.');
        I.see('ID provided has expired or is not a Press ID.');
        I.see('Details provided do not match.');
        I.see('What happens next');
        I.see(
            'The applicant [ ' +
                emailTestMediaAccount +
                ' ] will now be emailed to notify them why their application ' +
                'cannot be progressed and invited to reapply once the issue(s) are rectified.'
        );

        I.logout();
    }
);
