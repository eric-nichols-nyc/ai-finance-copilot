import { test, expect } from '@playwright/test'

/**
 * Example E2E tests demonstrating common Playwright patterns
 * These can be used as templates when building out features
 */

test.describe('Example Tests', () => {
  test('basic page navigation', async ({ page }) => {
    await page.goto('/')

    // Verify page loaded
    await expect(page).toHaveTitle(/Next.js/)

    // Example: Click a link (update selector when you have actual links)
    // await page.click('a[href="/dashboard"]')
    // await expect(page).toHaveURL('/dashboard')
  })

  test('form submission example', async ({ page }) => {
    await page.goto('/')

    // Example: Fill out a form (update when you have actual forms)
    // await page.fill('input[name="email"]', 'test@example.com')
    // await page.fill('input[name="password"]', 'password123')
    // await page.click('button[type="submit"]')
    //
    // await expect(page).toHaveURL('/dashboard')
  })

  test('accessibility check example', async ({ page }) => {
    await page.goto('/')

    // Example: Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)

    // Example: Check for alt text on images
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('dark mode example', async ({ page }) => {
    await page.goto('/')

    // Example: Test dark mode toggle (update when implemented)
    // const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]')
    // await darkModeToggle.click()
    //
    // const html = page.locator('html')
    // await expect(html).toHaveClass(/dark/)
  })

  test('api response example', async ({ page }) => {
    // Example: Intercept and verify API calls
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log('API Request:', request.url())
      }
    })

    await page.goto('/')
  })
})
