test('Console debug output capture', async ({ page }) => {
  const consoleMessages: string[] = [];

  // Capture console messages from the browser
  page.on('console', msg => {
    const message = `${msg.type()}: ${msg.text()}`;
    consoleMessages.push(message);
    console.log(`🌐 Browser console [${msg.type()}]:`, msg.text());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Give time for Vue to mount and run debug logs

  console.log('📋 Console messages after page load:', consoleMessages.length);

  // Click New Game to trigger debug logs
  const newGameButton = page.locator('button', { hasText: 'New Game' });
  if (await newGameButton.isVisible()) {
    console.log('🔲 Clicking New Game...');
    await newGameButton.click();
    await page.waitForTimeout(1000);
  }

  console.log('📋 Total console messages captured:', consoleMessages.length);

  // Find board-related messages
  const boardMessages = consoleMessages.filter(msg =>
    msg.includes('board') || msg.includes('Board') || msg.includes('GameBoard')
  );

  console.log('🎮 Board-related messages:');
  boardMessages.forEach(msg => console.log(`  ${msg}`));
});

test('Screenshot and HTML dump', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-page.png', fullPage: true });

  // Get the HTML of the game board area
  const gameBoardHTML = await page.locator('.grid-cols-3').first().innerHTML();
  console.log('🎮 Game board HTML:');
  console.log(gameBoardHTML);

  // Check if there are any Vue errors
  const bodyHTML = await page.locator('body').innerHTML();
  if (bodyHTML.includes('error') || bodyHTML.includes('Error')) {
    console.log('❌ Possible errors found in page');
  }

  // Get the full page title for verification
  const title = await page.title();
  console.log('📄 Page title:', title);

  console.log('✅ Screenshot saved to test-results/debug-page.png');
});