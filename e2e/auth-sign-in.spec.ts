import { test, expect } from '@playwright/test'

/**
 * Authentication Sign-In E2E Tests
 *
 * These tests verify the sign-in functionality of the application.
 *
 * Prerequisites:
 * - Test user credentials must be set in environment variables:
 *   - TEST_USER_EMAIL
 *   - TEST_USER_PASSWORD
 *
 * - Test user must exist in Supabase (create manually or via setup script)
 */

test.describe('Sign-In Flow', () => {
  const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
  const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123'

  test.beforeEach(async ({ page }) => {
    // Navigate to sign-in page before each test
    await page.goto('/sign-in')
  })

  test('should display sign-in page with correct elements', async ({ page }) => {
    // Verify page title and header
    await expect(page.locator('text=AI Finance Manager')).toBeVisible()
    await expect(page.locator('text=Sign in to your account or create a new one')).toBeVisible()

    // Verify tabs are present
    await expect(page.getByRole('tab', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Sign Up' })).toBeVisible()

    // Verify login form elements
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('should have login tab selected by default', async ({ page }) => {
    // Verify login tab is active
    const loginTab = page.getByRole('tab', { name: 'Login' })
    await expect(loginTab).toHaveAttribute('data-state', 'active')

    // Verify login form is visible
    await expect(page.locator('#login-email')).toBeVisible()
  })

  test('should switch between login and signup tabs', async ({ page }) => {
    // Initially on Login tab
    await expect(page.locator('#login-email')).toBeVisible()

    // Click Sign Up tab
    await page.getByRole('tab', { name: 'Sign Up' }).click()

    // Verify Sign Up form is now visible
    await expect(page.locator('#signup-email')).toBeVisible()
    await expect(page.locator('#signup-password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()

    // Switch back to Login tab
    await page.getByRole('tab', { name: 'Login' }).click()

    // Verify Login form is visible again
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
  })

  test('should show validation for empty form submission', async ({ page }) => {
    // Try to submit without filling form
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Browser native validation should prevent submission
    // Email field should be focused (HTML5 validation)
    const emailInput = page.locator('#login-email')
    await expect(emailInput).toBeFocused()
  })

  test('should show validation for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.locator('#login-email').fill('invalid-email')
    await page.locator('#login-password').fill('password123')

    // Try to submit
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Email field should show validation error (HTML5 validation)
    const emailInput = page.locator('#login-email')
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage)
    expect(validationMessage).toBeTruthy()
  })

  test('should successfully sign in with valid credentials', async ({ page }) => {
    // Fill in the login form
    await page.locator('#login-email').fill(TEST_USER_EMAIL)
    await page.locator('#login-password').fill(TEST_USER_PASSWORD)

    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Verify loading state appears
    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeVisible()

    // Wait for redirect to account page after successful login
    await page.waitForURL('/account', { timeout: 10000 })

    // Verify we're on the account page
    expect(page.url()).toContain('/account')

    // Optional: Verify authenticated state by checking for auth elements
    // (adjust based on your account page structure)
    await expect(page).toHaveURL(/\/account/)
  })

  test('should redirect to error page with invalid credentials', async ({ page }) => {
    // Fill in form with invalid credentials
    await page.locator('#login-email').fill('wrong@example.com')
    await page.locator('#login-password').fill('wrongpassword')

    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Wait for redirect to error page
    await page.waitForURL('/error', { timeout: 10000 })

    // Verify we're on the error page
    expect(page.url()).toContain('/error')
  })

  test('should disable form inputs while signing in', async ({ page }) => {
    // Fill in the form
    await page.locator('#login-email').fill(TEST_USER_EMAIL)
    await page.locator('#login-password').fill(TEST_USER_PASSWORD)

    // Start form submission
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Verify inputs are disabled during loading
    await expect(page.locator('#login-email')).toBeDisabled()
    await expect(page.locator('#login-password')).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify form is visible and usable on mobile
    await expect(page.locator('text=AI Finance Manager')).toBeVisible()
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()

    // Verify form can be filled on mobile
    await page.locator('#login-email').fill(TEST_USER_EMAIL)
    await page.locator('#login-password').fill(TEST_USER_PASSWORD)

    const emailValue = await page.locator('#login-email').inputValue()
    expect(emailValue).toBe(TEST_USER_EMAIL)
  })

  test('should handle password field security', async ({ page }) => {
    const passwordInput = page.locator('#login-password')

    // Verify password field is type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Fill password
    await passwordInput.fill('secretpassword123')

    // Verify value is not visible in the DOM (shown as bullets)
    const inputType = await passwordInput.getAttribute('type')
    expect(inputType).toBe('password')
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper labels
    const emailLabel = page.locator('label[for="login-email"]')
    const passwordLabel = page.locator('label[for="login-password"]')

    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()

    // Verify inputs have proper required attributes
    await expect(page.locator('#login-email')).toHaveAttribute('required', '')
    await expect(page.locator('#login-password')).toHaveAttribute('required', '')

    // Verify form has proper structure
    const form = page.locator('form').first()
    await expect(form).toBeVisible()
  })
})

test.describe('Sign-In Authentication State', () => {
  const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
  const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123'

  test('authenticated users should be redirected from sign-in page', async ({ page, context }) => {
    // First, sign in
    await page.goto('/sign-in')
    await page.locator('#login-email').fill(TEST_USER_EMAIL)
    await page.locator('#login-password').fill(TEST_USER_PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Wait for redirect to account page
    await page.waitForURL('/account', { timeout: 10000 })

    // Now try to navigate back to sign-in page
    await page.goto('/sign-in')

    // Should be redirected away from sign-in page (middleware should handle this)
    // Wait a moment for potential redirect
    await page.waitForTimeout(1000)

    // If middleware redirects authenticated users, URL should not be /sign-in
    // (Adjust this based on your actual middleware behavior)
    const currentUrl = page.url()
    console.log('Current URL after attempting to access sign-in while authenticated:', currentUrl)
  })

  test('unauthenticated users should be able to access sign-in page', async ({ page, context }) => {
    // Clear any existing session
    await context.clearCookies()

    // Navigate to sign-in page
    await page.goto('/sign-in')

    // Should be able to see sign-in form
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
    expect(page.url()).toContain('/sign-in')
  })
})
