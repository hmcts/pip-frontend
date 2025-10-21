import { test, expect } from '@playwright/test';
import { config as testConfig } from '../config';

test.describe('Login', () => {
    test('System admin should be able to sign-in with valid credentials', async ({ page }) => {
        await login(page, testConfig.ADMIN_USERNAME, testConfig.ADMIN_PASSWORD);
        await expect(page).toHaveURL(/dashboard/);
        await logout(page);
    });

    test('System admin sees error messages when username or password fields are empty', async ({ page }) => {
        await page.goto('https://your-app-url/b2c-admin-login');
        await page.fill('input[name="username"]', '');
        await page.fill('input[name="password"]', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Please enter your Email Address')).toBeVisible();
        await expect(page.locator('text=Please enter your password')).toBeVisible();
    });

    test('System admin sees error message when username or password is wrong', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('input[name="username"]', 'email@justice.gov.uk');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Invalid username or password.')).toBeVisible();
    });

    test('System admin sees error message when username is not a valid email address', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('input[name="username"]', 'email..@justice.gov.uk');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
    });

    test('Admin should be able to sign-in with valid credentials', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('input[name="username"]', testConfig.ADMIN_USERNAME);
        await page.fill('input[name="password"]', testConfig.ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Your account')).toBeVisible(); // Adjust as needed

        // Logout flow
        await page.click('button[aria-label="Sign out"]'); // Adjust selector as needed
        await expect(page.locator('text=Sign in with your email address')).toBeVisible();
    });

    test('Admin should see error messages when username or password fields are empty', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('input[name="username"]', '');
        await page.fill('input[name="password"]', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Please enter your Email Address')).toBeVisible();
        await expect(page.locator('text=Please enter your password')).toBeVisible();
    });

    test('Admin should see error message when username or password is wrong', async ({ page }) => {
        await page.goto(testConfig.TEST_URL + '/b2c-admin-login');
        await page.fill('input[name="username"]', 'email@justice.gov.uk');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Invalid username or password.')).toBeVisible();
    });
});

async function login(page, email: string, password: string) {
    await page.goto(testConfig.TEST_URL + '/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
}

async function logout(page) {
    await page.click('text=Logout');
}
