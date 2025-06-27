import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('You did it!');
})

test('New Game button functionality', async ({ page }) => {
  // Navigate to the game
  await page.goto('/');

  console.log('🔍 Page loaded, checking for New Game functionality...')

  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

  // Check if page loaded correctly - look for game title
  const title = await page.locator('h1').textContent();
  console.log('📄 Page title:', title);

  // Debug: Check all elements with grid in class name
  const allGrids = await page.locator('[class*="grid"]').all();
  console.log('🎯 All grid elements found:', allGrids.length);
  for (let i = 0; i < allGrids.length; i++) {
    const classes = await allGrids[i].getAttribute('class');
    console.log(`Grid ${i} classes:`, classes);
  }

  // Look for the New Game button
  const newGameButton = page.locator('button', { hasText: 'New Game' });
  const isNewGameVisible = await newGameButton.isVisible();
  console.log('🔲 New Game button visible:', isNewGameVisible);

  if (!isNewGameVisible) {
    // If not found, list all buttons for debugging
    console.log('❌ New Game button not found! Listing all buttons:');
    const allButtons = await page.locator('button').all();
    for (let i = 0; i < allButtons.length; i++) {
      const text = await allButtons[i].textContent();
      console.log(`Button ${i}: "${text}"`);
    }
    throw new Error('New Game button not found');
  }

  // Debug: Find ALL buttons on the page
  const allButtons = await page.locator('button').all();
  console.log('🔲 Total buttons on page:', allButtons.length);
  for (let i = 0; i < allButtons.length; i++) {
    const text = await allButtons[i].textContent();
    const classes = await allButtons[i].getAttribute('class');
    console.log(`Button ${i}: "${text}" - classes: ${classes}`);
  }

  // Try different selectors for the game board
  const gameBoard1 = page.locator('.grid-cols-3').first();
  const gameBoard2 = page.locator('[class*="grid-cols-3"]');
  const gameBoard3 = page.locator('div').filter({ hasText: /grid/ });

  console.log('🎮 Trying different game board selectors:');
  console.log('grid-cols-3 count:', await gameBoard1.count());
  console.log('[class*="grid-cols-3"] count:', await gameBoard2.count());
  console.log('div with grid text count:', await gameBoard3.count());

  // Find the actual game board cells using different approaches
  const cells1 = gameBoard1.locator('button');
  const cells2 = page.locator('.grid-cols-3 button');
  const cells3 = page.locator('button').filter({ hasText: /^[XO]?$/ });

  const cellCount1 = await cells1.count();
  const cellCount2 = await cells2.count();
  const cellCount3 = await cells3.count();

  console.log('🎮 Game board cells found with different selectors:');
  console.log('gameBoard1.locator("button"):', cellCount1);
  console.log('.grid-cols-3 button:', cellCount2);
  console.log('button with X/O pattern:', cellCount3);

  // Use whichever selector finds cells
  let cells = cells1;
  let cellCount = cellCount1;

  if (cellCount === 0 && cellCount2 > 0) {
    cells = cells2;
    cellCount = cellCount2;
  } else if (cellCount === 0 && cellCount3 > 0) {
    cells = cells3;
    cellCount = cellCount3;
  }

  console.log('🎮 Using cells with count:', cellCount);

  if (cellCount === 0) {
    console.log('❌ No game board cells found! Test cannot proceed.');
    throw new Error('No game board cells found');
  }

  // Make a move to establish game state
  console.log('🔲 Making a move on first cell...');
  await cells.first().click();
  await page.waitForTimeout(500);

  const cellContent = await cells.first().textContent();
  console.log('📝 Cell content after move:', cellContent);

  // Verify the move was made
  expect(cellContent?.trim()).not.toBe('');

  // Now test the New Game functionality
  console.log('🎮 Clicking New Game button...');
  await newGameButton.click();
  await page.waitForTimeout(1000);

  // Check if the board was reset
  const cellAfterReset = await cells.first().textContent();
  console.log('🔄 Cell content after New Game:', cellAfterReset);

  // The cell should be empty after reset
  expect(cellAfterReset?.trim()).toBe('');

  console.log('✅ New Game functionality test completed successfully!');
});

test('Game cell interaction', async ({ page }) => {
  await page.goto('/');

  // Find game cells
  const cells = page.locator('.grid-cols-3 button');
  const cellCount = await cells.count();

  if (cellCount >= 3) {
    // Click first cell
    await cells.nth(0).click();
    const firstCellContent = await cells.nth(0).textContent();

    // Click second cell
    await cells.nth(1).click();
    const secondCellContent = await cells.nth(1).textContent();

    console.log('First cell:', firstCellContent);
    console.log('Second cell:', secondCellContent);

    // Both cells should have content
    expect(firstCellContent?.trim()).not.toBe('');
    expect(secondCellContent?.trim()).not.toBe('');

    // They should be different (X vs O)
    expect(firstCellContent?.trim()).not.toBe(secondCellContent?.trim());
  }
});
