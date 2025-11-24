import { Page, BrowserContext } from '@playwright/test'

/**
 * Authentication Helper Functions for E2E Tests
 *
 * These utilities provide reusable functions for handling authentication
 * in Playwright tests.
 */

export interface TestUser {
  email: string
  password: string
}

/**
 * Get test user credentials from environment variables
 */
export function getTestUser(): TestUser {
  return {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123',
  }
}

/**
 * Sign in a user via the UI
 *
 * @param page - Playwright page object
 * @param credentials - User credentials (optional, uses env vars by default)
 * @returns Promise that resolves when sign-in is complete
 */
export async function signIn(
  page: Page,
  credentials: TestUser = getTestUser()
): Promise<void> {
  // Navigate to sign-in page
  await page.goto('/sign-in')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Fill in the login form
  await page.locator('#login-email').fill(credentials.email)
  await page.locator('#login-password').fill(credentials.password)

  // Submit the form
  await page.getByRole('button', { name: 'Sign In' }).click()

  // Wait for redirect to account page (indicating successful login)
  await page.waitForURL('/account', { timeout: 10000 })
}

/**
 * Sign up a new user via the UI
 *
 * @param page - Playwright page object
 * @param credentials - User credentials
 * @returns Promise that resolves when sign-up is complete
 */
export async function signUp(
  page: Page,
  credentials: TestUser
): Promise<void> {
  // Navigate to sign-in page
  await page.goto('/sign-in')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Click on Sign Up tab
  await page.getByRole('tab', { name: 'Sign Up' }).click()

  // Fill in the signup form
  await page.locator('#signup-email').fill(credentials.email)
  await page.locator('#signup-password').fill(credentials.password)

  // Submit the form
  await page.getByRole('button', { name: 'Create Account' }).click()

  // Wait for redirect to account page (indicating successful signup)
  await page.waitForURL('/account', { timeout: 10000 })
}

/**
 * Sign out the current user
 *
 * Note: This function assumes there's a logout button/link in the UI.
 * Adjust the selector based on your actual logout implementation.
 *
 * @param page - Playwright page object
 * @returns Promise that resolves when sign-out is complete
 */
export async function signOut(page: Page): Promise<void> {
  // Look for logout button/link (adjust selector as needed)
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i })

  if (await logoutButton.isVisible()) {
    await logoutButton.click()

    // Wait for redirect to sign-in or home page
    await page.waitForURL(/\/(sign-in)?/, { timeout: 5000 })
  } else {
    // Fallback: clear session by clearing cookies
    await page.context().clearCookies()
    await page.goto('/')
  }
}

/**
 * Clear all authentication cookies and storage
 *
 * @param context - Playwright browser context
 * @returns Promise that resolves when cookies are cleared
 */
export async function clearAuth(context: BrowserContext): Promise<void> {
  await context.clearCookies()
  await context.clearPermissions()
}

/**
 * Check if a user is currently authenticated
 *
 * This checks for the presence of auth-specific elements or cookies
 *
 * @param page - Playwright page object
 * @returns Promise that resolves to true if authenticated, false otherwise
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Method 1: Check for auth-specific UI elements
  // Adjust this selector based on your app's authenticated state indicators
  const authButton = page.locator('[data-testid="auth-button"]').first()

  // Try to navigate to a protected route
  await page.goto('/account')

  // If we get redirected to sign-in, user is not authenticated
  await page.waitForLoadState('networkidle')
  const currentUrl = page.url()

  return !currentUrl.includes('/sign-in')
}

/**
 * Setup an authenticated session before tests
 *
 * This is useful for test suites that require a logged-in user
 *
 * @param page - Playwright page object
 * @param credentials - User credentials (optional)
 * @returns Promise that resolves when authentication is complete
 */
export async function setupAuthenticatedSession(
  page: Page,
  credentials: TestUser = getTestUser()
): Promise<void> {
  await signIn(page, credentials)
  // Verify we're authenticated
  const authenticated = await isAuthenticated(page)
  if (!authenticated) {
    throw new Error('Failed to establish authenticated session')
  }
}

/**
 * Generate a unique test user email
 *
 * Useful for creating unique users in tests
 *
 * @param prefix - Email prefix (default: 'test')
 * @returns Unique email address
 */
export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `${prefix}+${timestamp}${random}@example.com`
}

/**
 * Wait for authentication redirect
 *
 * Waits for the app to redirect after authentication
 *
 * @param page - Playwright page object
 * @param expectedPath - Expected path to redirect to (default: /account)
 * @param timeout - Maximum wait time in milliseconds (default: 10000)
 * @returns Promise that resolves when redirect is complete
 */
export async function waitForAuthRedirect(
  page: Page,
  expectedPath: string = '/account',
  timeout: number = 10000
): Promise<void> {
  await page.waitForURL(expectedPath, { timeout })
}

/**
 * Fill login form without submitting
 *
 * Useful for testing form validation
 *
 * @param page - Playwright page object
 * @param email - Email address
 * @param password - Password
 * @returns Promise that resolves when form is filled
 */
export async function fillLoginForm(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.locator('#login-email').fill(email)
  await page.locator('#login-password').fill(password)
}

/**
 * Fill signup form without submitting
 *
 * Useful for testing form validation
 *
 * @param page - Playwright page object
 * @param email - Email address
 * @param password - Password
 * @returns Promise that resolves when form is filled
 */
export async function fillSignupForm(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  // Make sure we're on the Sign Up tab
  await page.getByRole('tab', { name: 'Sign Up' }).click()

  await page.locator('#signup-email').fill(email)
  await page.locator('#signup-password').fill(password)
}
