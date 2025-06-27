import { test, expect } from '@playwright/test';

test('Debug UI - see what is actually rendered', async ({ page }) => {
  // Capture console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Capture JavaScript errors
  const jsErrors: string[] = [];
  page.on('pageerror', error => {
    jsErrors.push(error.message);
  });

  await page.goto('/');

  // Wait for any Vue components to render
  await page.waitForTimeout(2000);

  // Take a screenshot to see the actual UI
  await page.screenshot({ path: 'debug-ui.png', fullPage: true });

  // Get page HTML to debug
  const html = await page.content();
  console.log('📄 Page HTML length:', html.length);

  // Log any JavaScript errors
  if (jsErrors.length > 0) {
    console.log('❌ JavaScript errors found:');
    jsErrors.forEach((error, i) => console.log(`Error ${i + 1}: ${error}`));
  } else {
    console.log('✅ No JavaScript errors found');
  }

  // Log recent console messages
  console.log('📝 Console messages:');
  consoleMessages.slice(-10).forEach((msg, i) => console.log(`Console ${i + 1}: ${msg}`));

  // Find all elements with grid classes
  const gridElements = await page.locator('[class*="grid"]').all();
  console.log('🎯 Grid elements found:', gridElements.length);

  for (let i = 0; i < gridElements.length; i++) {
    const classes = await gridElements[i].getAttribute('class');
    console.log(`Grid ${i} classes:`, classes);
  }

  // Find all buttons
  const buttons = await page.locator('button').all();
  console.log('🔲 Total buttons found:', buttons.length);

  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const classes = await buttons[i].getAttribute('class');
    console.log(`Button ${i}: "${text}" classes: ${classes}`);
  }

  // Check specifically for game cells
  const gameCellsInGrid = page.locator('div[class*="grid-cols-3"] button');
  const gameCellCount = await gameCellsInGrid.count();
  console.log('🎮 Game cells in grid-cols-3:', gameCellCount);

  // Check what's inside the grid-cols-3 container
  const gridContainer = page.locator('div[class*="grid-cols-3"]');
  const gridContent = await gridContainer.innerHTML();
  console.log('📋 Grid container content:', gridContent.substring(0, 200) + '...');

  // Check all children of the grid container
  const gridChildren = gridContainer.locator('> *');
  const childrenCount = await gridChildren.count();
  console.log('👶 Grid children count:', childrenCount);

  for (let i = 0; i < Math.min(childrenCount, 5); i++) {
    const tagName = await gridChildren.nth(i).evaluate(el => el.tagName);
    const innerHTML = await gridChildren.nth(i).innerHTML();
    console.log(`Child ${i}: <${tagName}> content: ${innerHTML.substring(0, 50)}...`);
  }

  // Check if GameBoard component is rendered
  const gameBoard = page.locator('[class*="GameBoard"], [data-v-]');
  const gameBoardCount = await gameBoard.count();
  console.log('🎮 GameBoard components found:', gameBoardCount);

  // Check the game board data
  const boardData = await page.evaluate(() => {
    // Try to access Vue instance data if available
    const app = (window as any).__VUE__;
    return app ? 'Vue app found' : 'No Vue app found';
  });
  console.log('🔍 Vue app status:', boardData);
});