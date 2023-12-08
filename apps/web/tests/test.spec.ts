import { testWithoutAuth as test } from './utils/extended-test'

test('Signin page', async ({ page }) => {
  await page.goto('/')
})
