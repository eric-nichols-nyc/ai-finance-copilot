import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await expect(page).toHaveTitle(/Next.js/)

    // Check that the main content is visible
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')

    // Check for basic SEO elements
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('should be responsive', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()
  })
})
