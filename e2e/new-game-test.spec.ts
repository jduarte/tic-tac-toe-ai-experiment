import { test, expect } from '@playwright/test'

test('New Game button functionality test', async ({ page }) => {
  // Navigate to the game
  await page.goto('http://localhost:5173')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  console.log('🔍 Page loaded, checking initial state...')

  // Check if the page loaded correctly
  const title = await page.textContent('h1')
  console.log('📄 Page title:', title)

  // Look for the New Game button
  const newGameButton = page.locator('button:has-text("New Game")')
  const isVisible = await newGameButton.isVisible()
  console.log('🔲 New Game button visible:', isVisible)

  if (isVisible) {
    console.log('✅ Found New Game button, testing it...')

    // First, click a cell to make a move
    const gameBoard = page.locator('.grid')
    const firstCell = gameBoard.locator('button').first()

    if (await firstCell.isVisible()) {
      console.log('🔲 Making a move on first cell...')
      await firstCell.click()
      await page.waitForTimeout(500)

      const cellAfterMove = await firstCell.textContent()
      console.log('📝 Cell content after move:', cellAfterMove)
    }

    // Now click New Game
    console.log('🎮 Clicking New Game button...')
    await newGameButton.click()
    await page.waitForTimeout(1000)

    // Check if the board was reset
    const cellAfterReset = await firstCell.textContent()
    console.log('🔄 Cell content after New Game:', cellAfterReset)

    // Expect the cell to be empty after reset
    expect(cellAfterReset?.trim()).toBe('')

  } else {
    console.log('❌ New Game button not found!')

    // Log all buttons on the page for debugging
    const allButtons = page.locator('button')
    const buttonCount = await allButtons.count()
    console.log('🔍 All buttons found:', buttonCount)

    for (let i = 0; i < buttonCount; i++) {
      const buttonText = await allButtons.nth(i).textContent()
      console.log(`🔲 Button ${i}:`, buttonText?.trim())
    }

    throw new Error('New Game button not found on the page')
  }
})