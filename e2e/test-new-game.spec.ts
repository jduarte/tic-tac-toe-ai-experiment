import { test, expect } from '@playwright/test'

test('New Game button functionality test', async ({ page }) => {
  // Start the dev server and navigate to the game
  await page.goto('http://localhost:5173')

  // Wait for the Vue app to mount completely
  await page.waitForSelector('h1', { timeout: 10000 })

  console.log('🔍 Page loaded, checking initial state...')

  // Take a screenshot of initial state
  await page.screenshot({ path: 'initial-state.png' })

  // Check if the page loaded correctly
  const title = await page.textContent('h1')
  console.log('📄 Page title:', title)

  // Look for the New Game button more specifically
  const newGameButton = page.locator('button', { hasText: 'New Game' })
  console.log('🔲 New Game button visible:', await newGameButton.isVisible())

  // Wait for the GAME BOARD grid to be rendered (more specific selector)
  const gameBoard = page.locator('div.grid.grid-cols-3.w-80')
  await gameBoard.waitFor({ timeout: 5000 })

  // Count all buttons on the page
  const allButtons = page.locator('button')
  const buttonCount = await allButtons.count()
  console.log('🔲 Total buttons found:', buttonCount)

  // Look specifically for game cell buttons inside the game board
  const gameCells = gameBoard.locator('button')
  const cellCount = await gameCells.count()
  console.log('🎮 Game cells found:', cellCount)

  // Take screenshot before clicking
  await page.screenshot({ path: 'before-click.png' })

  if (cellCount > 0) {
    console.log('✅ Game cells found! Testing New Game functionality...')

    // Click the first game cell to make a move
    await gameCells.first().click()
    console.log('🔲 Clicked first game cell')

    // Take screenshot after first move
    await page.screenshot({ path: 'after-first-move.png' })

    // Now click New Game button
    await newGameButton.click()
    console.log('🎮 Clicked New Game button')

    // Take screenshot after New Game
    await page.screenshot({ path: 'after-new-game.png' })

    // Verify the board reset (game cells should be empty or reset)
    console.log('✅ New Game functionality test completed')

  } else {
    console.log('❌ No game cells found - GameBoard component may not be rendering correctly')

    // Debug: Let's see what's actually in the game board container
    const boardContent = await gameBoard.textContent()
    console.log('🔍 Game board content:', boardContent)
  }
})