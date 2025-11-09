// tests/routes.spec.js
import { test, expect } from '@playwright/test';

const ORIGIN = process.env.PW_BASE_URL || 'http://localhost:3000';
const toUrl = (path) => new URL(path, ORIGIN).toString();

async function assertNoConsoleErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.waitForLoadState('networkidle');
  expect(errors, `Console errors:\n${errors.join('\n')}`).toEqual([]);
}

// Some pages in this template render different wrappers.
// Treat header OR footer as a valid layout render.
const ANY_LAYOUT_SELECTORS = [
  '.main-bar-wraper',      // header container (most pages)
  'header',                // fallback
  'footer',                // some pages only show footer
  '.page-content',         // common content wrapper
];

// Utility: pass if ANY of the selectors becomes visible
async function expectAnyVisible(page, selectors, timeout = 5000) {
  const start = Date.now();
  let lastError;
  for (;;) {
    for (const sel of selectors) {
      const loc = page.locator(sel);
      if (await loc.first().isVisible().catch(() => false)) {
        return; // success
      }
    }
    if (Date.now() - start > timeout) {
      lastError = new Error(
        `None of the selectors became visible within ${timeout}ms:\n` +
        selectors.map(s => `  - ${s}`).join('\n')
      );
      break;
    }
    await page.waitForTimeout(50);
  }
  throw lastError;
}

const PUBLIC_ROUTES_SMOKE = [
  '/', '/services', '/services-details',
  '/blog-grid', '/portfolio', '/portfolio-details',
  '/about-us', '/team', '/faq', '/pricing',
  '/schedule', '/contact-us', '/coming-soon',
  '/under-construction', '/error-page', '/weight-calculator',
  '/appointment'
];

// Route-specific content checks
const PAGE_CHECKS = [
  { path: '/login',         locator: 'h1', textRe: /log in to forty\+?fit/i },
  { path: '/signup',        locator: 'h1', textRe: /create your account/i },
  // /auth/callback shows either of these depending on env:
  { path: '/auth/callback', locator: 'body', textAny: [/Completing sign-in/i, /Auth isn.?t configured/i] },
  // ServicesFortyPlusFit page
  { path: '/allservices',   locator: '.page-content', textRe: /allservices/i },
];

test.describe('Routes — smoke coverage', () => {

  test('public routes render some layout and have no console errors', async ({ page }) => {
    for (const route of PUBLIC_ROUTES_SMOKE) {
      await test.step(`visit ${route}`, async () => {
        await page.goto(toUrl(route), { waitUntil: 'domcontentloaded' });
        await assertNoConsoleErrors(page);
        await expectAnyVisible(page, ANY_LAYOUT_SELECTORS, 5000);
        await expect(page).toHaveURL(new RegExp(`${route.replace(/\//g, '\\/')}$`));
      });
    }
  });

  test('key pages show expected text', async ({ page }) => {
    for (const { path, locator, textRe, textAny } of PAGE_CHECKS) {
      await test.step(`visit ${path}`, async () => {
        await page.goto(toUrl(path));
        await assertNoConsoleErrors(page);

        const loc = page.locator(locator);
        await expect(loc).toBeVisible();

        if (textRe) {
          await expect(loc).toContainText(textRe);
        } else if (textAny?.length) {
          const content = await page.locator('body').innerText();
          const matched = textAny.some((re) => re.test(content));
          expect(matched, `None of ${textAny.map(r=>r.toString()).join(', ')} matched:\n${content}`).toBeTruthy();
        }
      });
    }
  });

  test('unauthenticated users are redirected from /onboarding to /login', async ({ page }) => {
    await page.goto(toUrl('/onboarding'));
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/log in/i);
  });

});

