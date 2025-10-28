import { test, expect } from '@playwright/test';
import { config as testConfig } from '../playwright_config';

const b2cAdminLogin = '/b2c-admin-login';
const signIn = '/sign-in';

test.describe('Login', () => {
    test('Admin should be able to sign-in with valid credentials. Feedback links present', async ({ page }) => {
        await login(page, b2cAdminLogin, testConfig.ADMIN_USERNAME, testConfig.ADMIN_PASSWORD);
        await expect(page.locator('text=What do you want to do?')).toBeVisible();

        await logout(page);
        await checkBetaTagAndFeedbackLink(page);
    });

    test('System admin should be able to sign-in with valid credentials. Feedback links present', async ({ page }) => {
        await login(page, b2cAdminLogin, testConfig.SYSTEM_ADMIN_USERNAME, testConfig.SYSTEM_ADMIN_PASSWORD);
        await expect(page.locator('text=What do you want to do?')).toBeVisible();

        await logout(page);
        await checkBetaTagAndFeedbackLink(page);
    });

    test('Media user should be able to sign-in with valid credentials. Feedback links present', async ({ page }) => {
        await login(page, signIn, testConfig.MEDIA_USER_USERNAME, testConfig.MEDIA_USER_PASSWORD);
        await expect(page.locator('text=What do you want to do?')).toBeVisible();

        await logout(page);
        await checkBetaTagAndFeedbackLink(page);
    });

    test('Admin/System Admin - Error messages when username or password fields are empty', async ({ page }) => {
        await login(page, b2cAdminLogin, '', '');
        await expect(page.locator('text=Please enter your Email Address')).toBeVisible();
        await expect(page.locator('text=Please enter your password')).toBeVisible();
    });

    test('Admin/System Admin - Error messages when username or password is wrong', async ({ page }) => {
        await login(page, b2cAdminLogin, 'email@justice.gov.uk', 'password');
        await expect(page.locator('text=Invalid username or password.')).toBeVisible();
    });

    test('Admin/System Admin - Error messages when username is not a valid email address', async ({ page }) => {
        await login(page, b2cAdminLogin, 'email..@justice.gov.uk', 'password');
        await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
    });

    test('Media User - Error messages when username or password fields are empty', async ({ page }) => {
        await login(page, signIn, '', '');
        await expect(page.locator('text=Please enter your Email Address')).toBeVisible();
        await expect(page.locator('text=Please enter your password')).toBeVisible();
    });

    test('Media User - Error messages when username or password is wrong', async ({ page }) => {
        await login(page, signIn, 'email@justice.gov.uk', 'password');
        await expect(page.locator('text=Invalid username or password.')).toBeVisible();
    });

    test('Media User- Error messages when username is not a valid email address', async ({ page }) => {
        await login(page, signIn, 'email..@justice.gov.uk', 'password');
        await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
    });
});

async function login(page, urlSuffix: string, email: string, password: string) {
    if (urlSuffix == b2cAdminLogin) {
        await page.goto(testConfig.TEST_URL + urlSuffix);
    } else if (urlSuffix == signIn) {
        await page.goto(testConfig.TEST_URL + urlSuffix);
        // Select radio button - With a Court and tribunal hearings account
        const radioButton = page.locator('input#sign-in-3[type="radio"]');
        await radioButton.check();
        //Click continue button
        await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
}

async function checkBetaTagAndFeedbackLink(page) {
    await page.goto(testConfig.TEST_URL + '/b2c-admin-login');

    const betaBanner = page.locator('strong.govuk-tag.govuk-phase-banner__content__tag', { hasText: 'beta' });
    await expect(betaBanner).toBeVisible();

    const feedbackButton = page.locator('a', { hasText: 'feedback' });
    await expect(feedbackButton).toBeVisible();
    const href = await feedbackButton.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);

    await feedbackButton.click();
    await expect(page.locator('text=Online Information Feedback Form')).toBeVisible();
}

async function logout(page) {
    await page.goto(testConfig.TEST_URL + '/logout');
    await expect(page.locator('text=You have been signed out')).toBeVisible();
}
