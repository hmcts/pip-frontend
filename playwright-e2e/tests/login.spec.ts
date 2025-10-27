import { test, expect } from '@playwright/test';
import { config as testConfig } from '../playwright_config';

test.describe('Login', () => {
    test('Admin should be able to sign-in with valid credentials', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('#email', testConfig.ADMIN_USERNAME);
        await page.fill('#password', testConfig.ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Your account')).toBeVisible(); // Adjust as needed

        // Logout flow
        await page.click('button[aria-label="Sign out"]'); // Adjust selector as needed
        await expect(page.locator('text=Sign in with your email address')).toBeVisible();
    });

    test.only('System admin should be able to sign-in with valid credentials', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('#email', testConfig.SYSTEM_ADMIN_USERNAME);
        await page.fill('#password', testConfig.SYSTEM_ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/dashboard/);
        await logout(page);
    });

    test('System admin sees error messages when username or password fields are empty', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('#email', '');
        await page.fill('#password', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Please enter your Email Address')).toBeVisible();
        await expect(page.locator('text=Please enter your password')).toBeVisible();
    });

    test('System admin sees error message when username or password is wrong', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('#email', 'email@justice.gov.uk');
        await page.fill('#password', 'password');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Invalid username or password.')).toBeVisible();
    });

    test('System admin sees error message when username is not a valid email address', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('#email', 'email..@justice.gov.uk');
        await page.fill('#password', 'password');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
    });

    test('Admin should see error message when username or password is wrong', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('#email', 'email@justice.gov.uk');
        await page.fill('#password', 'password');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Invalid username or password.')).toBeVisible();
    });
});

// async function login(page, email: string, password: string) {
//     // await page.goto(TEST_URL + '/login');
//     await page.fill('#email', email);
//     await page.fill('#password', password);
//     await page.click('button[type="submit"]');
// }

async function logout(page) {
    await page.click('text=Logout');
}
