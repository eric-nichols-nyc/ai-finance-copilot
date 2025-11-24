# Testing Guide

This project uses **Vitest** for unit/integration testing and **Playwright** for end-to-end (e2e) testing.

## Quick Start

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

# Run e2e tests in UI mode
npm run test:e2e:ui

# Run e2e tests in debug mode
npm run test:e2e:debug

# Run all tests (unit + e2e)
npm run test:all
```

## Unit Testing with Vitest

### Configuration

- **Config file:** `vitest.config.ts`
- **Setup file:** `vitest.setup.ts`
- **Test files:** `**/*.{test,spec}.{ts,tsx}` (excluding `e2e/` and `node_modules`)
- **Environment:** jsdom (for React component testing)

### Writing Tests

#### Testing Utility Functions

```typescript
// __tests__/lib/myUtil.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/myUtil'

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction(input)).toBe(expectedOutput)
  })
})
```

#### Testing React Components

```typescript
// __tests__/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Coverage

Coverage reports are generated in the `/coverage` directory and include:
- Text output in the terminal
- JSON report: `coverage/coverage-final.json`
- HTML report: `coverage/index.html`

Run `npm run test:coverage` and open `coverage/index.html` in a browser to view detailed coverage.

### Available Matchers

Vitest includes Jest-compatible matchers via `@testing-library/jest-dom`:
- `toBeInTheDocument()`
- `toHaveTextContent()`
- `toBeVisible()`
- `toBeDisabled()`
- `toHaveClass()`
- And many more...

## E2E Testing with Playwright

### Configuration

- **Config file:** `playwright.config.ts`
- **Test directory:** `e2e/`
- **Test files:** `e2e/**/*.spec.ts`

### Playwright Projects

Tests run across multiple browsers:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

To run tests on specific browsers:

```bash
# Run only chromium tests
npx playwright test --project=chromium

# Run mobile tests
npx playwright test --project="Mobile Chrome"
```

### Writing E2E Tests

```typescript
// e2e/myFeature.spec.ts
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test('should perform expected behavior', async ({ page }) => {
    await page.goto('/')

    await page.click('button[data-testid="my-button"]')
    await expect(page.locator('.result')).toHaveText('Expected Result')
  })
})
```

### Authentication Testing

#### Environment Setup

Authentication tests require valid test user credentials. Set these environment variables:

```bash
# .env.test or .env.local
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
```

**IMPORTANT:** The test user must exist in your Supabase project. Create it manually via:
- Supabase Dashboard → Authentication → Users → Add User
- Or run a setup script to create test users

#### Using Auth Helpers

The project includes reusable authentication helpers in `e2e/helpers/auth.ts`:

```typescript
import { signIn, signOut, isAuthenticated, getTestUser } from './helpers/auth'

test('should access protected route after login', async ({ page }) => {
  // Sign in using the helper
  await signIn(page)

  // Navigate to protected route
  await page.goto('/dashboard')

  // Verify access granted
  await expect(page).toHaveURL('/dashboard')
})

test('should redirect unauthenticated users', async ({ page, context }) => {
  // Clear any existing auth
  await context.clearCookies()

  // Try to access protected route
  await page.goto('/dashboard')

  // Should redirect to sign-in
  await expect(page).toHaveURL(/\/sign-in/)
})
```

#### Available Auth Helpers

- `signIn(page, credentials?)` - Sign in via UI
- `signUp(page, credentials)` - Create new account via UI
- `signOut(page)` - Sign out current user
- `clearAuth(context)` - Clear all auth cookies
- `isAuthenticated(page)` - Check if user is logged in
- `setupAuthenticatedSession(page, credentials?)` - Setup auth for test suite
- `getTestUser()` - Get test credentials from env vars
- `generateTestEmail(prefix?)` - Generate unique test email
- `fillLoginForm(page, email, password)` - Fill form without submitting
- `waitForAuthRedirect(page, path?, timeout?)` - Wait for post-auth redirect

#### Example: Testing Protected Routes

```typescript
import { test, expect } from '@playwright/test'
import { signIn, clearAuth } from './helpers/auth'

test.describe('Protected Routes', () => {
  test('authenticated user can access dashboard', async ({ page }) => {
    await signIn(page)
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })

  test('unauthenticated user redirected to sign-in', async ({ page, context }) => {
    await clearAuth(context)
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/sign-in/)
  })
})
```

#### Running Auth Tests

```bash
# Run all auth tests
npx playwright test auth

# Run with specific test user
TEST_USER_EMAIL=custom@test.com TEST_USER_PASSWORD=custom123 npm run test:e2e

# Debug auth tests
npm run test:e2e:debug auth-sign-in.spec.ts
```

### Best Practices

1. **Use data-testid attributes** for stable selectors:
   ```tsx
   <button data-testid="submit-btn">Submit</button>
   ```
   ```typescript
   await page.click('[data-testid="submit-btn"]')
   ```

2. **Prefer role-based selectors** when possible:
   ```typescript
   await page.getByRole('button', { name: 'Submit' })
   ```

3. **Wait for elements** before interacting:
   ```typescript
   await page.waitForSelector('[data-testid="content"]')
   ```

4. **Use auto-waiting assertions**:
   ```typescript
   await expect(page.locator('.status')).toHaveText('Success')
   ```

5. **Use auth helpers for authentication**:
   ```typescript
   import { signIn } from './helpers/auth'
   await signIn(page) // Instead of manually filling forms
   ```

### Debugging E2E Tests

#### UI Mode (Recommended)
```bash
npm run test:e2e:ui
```

This opens Playwright's UI where you can:
- See all tests
- Step through tests
- View traces and screenshots
- Time travel through test execution

#### Debug Mode
```bash
npm run test:e2e:debug
```

Opens tests with Playwright Inspector for step-by-step debugging.

#### Headed Mode
```bash
npx playwright test --headed
```

Runs tests with the browser visible.

### Test Reports

After running e2e tests, view the HTML report:

```bash
npx playwright show-report
```

Reports include:
- Test results
- Screenshots of failures
- Traces for failed tests
- Performance metrics

## CI/CD Integration

Both test suites are CI-friendly:

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      # Install dependencies
      - run: npm ci

      # Run unit tests
      - run: npm test

      # Install Playwright browsers
      - run: npx playwright install --with-deps

      # Run e2e tests
      - run: npm run test:e2e

      # Upload test results
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Organization

```
ai-finance-copilot/
├── __tests__/              # Unit/integration tests
│   ├── components/         # Component tests
│   │   └── example.test.tsx
│   └── lib/                # Utility function tests
│       └── example.test.ts
│
├── e2e/                    # E2E tests
│   ├── helpers/            # Test utilities
│   │   └── auth.ts         # Authentication helpers
│   ├── auth-sign-in.spec.ts # Auth tests
│   ├── home.spec.ts
│   ├── error-pages.spec.ts
│   └── example.spec.ts
│
├── vitest.config.ts        # Vitest configuration
├── vitest.setup.ts         # Vitest global setup
└── playwright.config.ts    # Playwright configuration
```

## Tips

### Vitest
- Use `test.only()` to run a single test
- Use `test.skip()` to skip a test
- Use `vi.mock()` to mock modules
- Use `beforeEach()` and `afterEach()` for setup/cleanup

### Playwright
- Use `test.only()` to run a single test
- Use `test.skip()` to skip a test
- Use `page.pause()` to pause execution (debug mode only)
- Use `page.screenshot()` to capture screenshots manually

## Troubleshooting

### Vitest Issues

**Problem:** Tests fail with module resolution errors
**Solution:** Check `vitest.config.ts` path aliases match `tsconfig.json`

**Problem:** React hooks errors
**Solution:** Ensure components are wrapped with proper providers in tests

### Playwright Issues

**Problem:** Browsers not installed
**Solution:** Run `npx playwright install --with-deps`

**Problem:** Tests timeout
**Solution:** Increase timeout in `playwright.config.ts` or use `test.setTimeout()`

**Problem:** Flaky tests
**Solution:** Use auto-waiting assertions and avoid hard-coded waits

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
