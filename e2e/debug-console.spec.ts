import { test, expect } from '@playwright/test';

test('Debug console output', async ({ page }) => {
  const consoleMessages: string[] = [];

  // Capture console messages
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    console.log(`🌐 Browser console [${msg.type()}]:`, msg.text());
  });

  // Navigate to the game
  await page.goto('/');

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('📋 Total console messages captured:', consoleMessages.length);

  // Try to click New Game to see the debug output
  const newGameButton = page.locator('button', { hasText: 'New Game' });
  if (await newGameButton.isVisible()) {
    console.log('🔲 Clicking New Game button to trigger debug output...');
    await newGameButton.click();
    await page.waitForTimeout(1000);
  }

  console.log('📋 Final console messages captured:', consoleMessages.length);

  // Log all captured messages for debugging
  consoleMessages.forEach((msg, index) => {
    console.log(`Message ${index}: ${msg}`);
  });
});