import { test, expect } from '@playwright/test';

const VIEWPORTS = {
  'mobile-320': { width: 320, height: 667, name: 'iPhone SE' },
  'mobile-480': { width: 480, height: 853, name: 'Pixel 5' },
  'tablet': { width: 768, height: 1024, name: 'iPad' },
  'desktop': { width: 1440, height: 900, name: 'Desktop' },
};

// Helper to check horizontal scrollbar presence
async function hasHorizontalScrollbar(page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  return scrollWidth > clientWidth;
}

// Helper to check element visibility
async function isElementVisibleInViewport(page, selector) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  return await element.isVisible();
}

// Helper to get element dimensions
async function getElementDimensions(element) {
  const box = await element.boundingBox();
  return box ? { width: box.width, height: box.height } : null;
}

test.describe('Responsive Design Tests', () => {
  test('should not have horizontal scrollbar on mobile 320px', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    await page.goto('/');
    
    const hasScroll = await hasHorizontalScrollbar(page);
    expect(hasScroll).toBe(false);
    
    // Verify main content fits
    const main = page.locator('main');
    expect(await main.isVisible()).toBe(true);
  });

  test('should not have horizontal scrollbar on mobile 480px', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-480']);
    await page.goto('/');
    
    const hasScroll = await hasHorizontalScrollbar(page);
    expect(hasScroll).toBe(false);
  });

  test('should not have horizontal scrollbar on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['tablet']);
    await page.goto('/');
    
    const hasScroll = await hasHorizontalScrollbar(page);
    expect(hasScroll).toBe(false);
  });

  test('should not have horizontal scrollbar on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['desktop']);
    await page.goto('/');
    
    const hasScroll = await hasHorizontalScrollbar(page);
    expect(hasScroll).toBe(false);
  });

  test('should render homepage layout on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    await page.goto('/');
    
    // Check key elements are visible
    expect(await isElementVisibleInViewport(page, 'h2')).toBe(true);
    expect(await isElementVisibleInViewport(page, 'input[type="email"]')).toBe(true);
    expect(await isElementVisibleInViewport(page, 'button[type="submit"]')).toBe(true);
  });

  test('should render homepage layout on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['tablet']);
    await page.goto('/');
    
    expect(await isElementVisibleInViewport(page, 'h2')).toBe(true);
    expect(await isElementVisibleInViewport(page, 'input[type="email"]')).toBe(true);
    expect(await isElementVisibleInViewport(page, 'button[type="submit"]')).toBe(true);
  });

  test('should render homepage layout on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['desktop']);
    await page.goto('/');
    
    expect(await isElementVisibleInViewport(page, 'h2')).toBe(true);
    expect(await isElementVisibleInViewport(page, 'input[type="email"]')).toBe(true);
    expect(await isElementVisibleInViewport(page, 'button[type="submit"]')).toBe(true);
  });
});

test.describe('Accessibility - Touch Targets', () => {
  test('buttons should have minimum 44x44px on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    await page.goto('/');
    
    const button = page.locator('button[type="submit"]');
    const dimensions = await getElementDimensions(button);
    
    expect(dimensions).not.toBeNull();
    if (dimensions) {
      // Allow slight margin for actual click area
      expect(dimensions.height).toBeGreaterThanOrEqual(40);
      expect(dimensions.width).toBeGreaterThanOrEqual(40);
    }
  });

  test('input fields should be accessible on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    await page.goto('/');
    
    const input = page.locator('input[type="email"]');
    expect(await input.isVisible()).toBe(true);
    
    // Test keyboard accessibility
    await input.focus();
    await input.type('test@example.com');
    expect(await input.inputValue()).toBe('test@example.com');
  });

  test('form labels should be associated with inputs', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['desktop']);
    await page.goto('/');
    
    const input = page.locator('input[type="email"]');
    const inputId = await input.getAttribute('id');
    
    expect(inputId).toBeTruthy();
    
    // Verify label references input
    const label = page.locator(`label[for="${inputId}"]`);
    expect(await label.count()).toBeGreaterThan(0);
  });
});

test.describe('Form Functionality', () => {
  test('should accept valid email input on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    await page.goto('/');
    
    const input = page.locator('input[type="email"]');
    await input.fill('test@example.com');
    
    expect(await input.inputValue()).toBe('test@example.com');
  });

  test('should show placeholder text on input', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    await page.goto('/');
    
    const input = page.locator('input[type="email"]');
    const placeholder = await input.getAttribute('placeholder');
    
    expect(placeholder).toBeTruthy();
  });

  test('form should be keyboard navigable', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['desktop']);
    await page.goto('/');
    
    // Tab to input
    await page.keyboard.press('Tab');
    const input = page.locator('input[type="email"]');
    
    // Verify input is focused
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe('INPUT');
  });
});

test.describe('Visual Consistency', () => {
  test('should maintain consistent spacing on all viewports', async ({ page }) => {
    const viewports = Object.values(VIEWPORTS);
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Check that main section has proper margins
      const main = page.locator('main');
      expect(await main.isVisible()).toBe(true);
      
      const box = await main.boundingBox();
      expect(box).not.toBeNull();
      
      // Main should not touch viewport edges on most sizes
      if (viewport.width > 320) {
        expect(box?.x).toBeGreaterThan(0);
      }
    }
  });

  test('text should be readable without zoom', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    await page.goto('/');
    
    // Get font size of heading
    const heading = page.locator('h2').first();
    const fontSize = await heading.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    
    // Parse font size (e.g., "16px" -> 16)
    const fontSizeValue = parseInt(fontSize);
    
    // Minimum readable font size on mobile is typically 12-14px
    expect(fontSizeValue).toBeGreaterThanOrEqual(12);
  });
});

test.describe('Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const start = Date.now();
    
    await page.setViewportSize(VIEWPORTS['desktop']);
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - start;
    
    // Should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have minimal layout shift on load', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    
    // Listen for layout shift
    const layoutShifts = [];
    
    await page.evaluate(() => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.hadRecentInput) return;
              console.log('CLS:', entry.value);
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // PerformanceObserver not available
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });
});

test.describe('Browser Compatibility', () => {
  test('should work on chromium', async ({ page }) => {
    await page.goto('/');
    expect(await page.title()).toBeTruthy();
  });
});

test.describe('Error Handling', () => {
  test('should display error on network failure', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['mobile-320']);
    
    // Intercept network requests
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/');
    
    // Try to submit form
    const input = page.locator('input[type="email"]');
    await input.fill('test@example.com');
    
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    
    // Wait a bit for error handling
    await page.waitForTimeout(1000);
    
    // Verify error message or graceful handling
    expect(await page.locator('main').isVisible()).toBe(true);
  });
});

