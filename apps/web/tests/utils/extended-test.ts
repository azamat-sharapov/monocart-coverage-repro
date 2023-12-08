import { test as base } from 'playwright-test-coverage'
import { addCoverageReport } from 'monocart-reporter'

export const testWithoutAuth = base.extend<{ autoTestFixture: string }>({
  autoTestFixture: [
    async ({ page }, use) => {
      if (testWithoutAuth.info().project.name === 'chromium') {
        await Promise.all([
          page.coverage.startJSCoverage({
            resetOnNavigation: false,
          }),
        ])
      }

      await use('autoTestFixture')

      if (testWithoutAuth.info().project.name === 'chromium') {
        const [jsCoverage] = await Promise.all([page.coverage.stopJSCoverage()])
        const coverageList = [...jsCoverage]
        await addCoverageReport(coverageList, testWithoutAuth.info())
      }
    },
    {
      scope: 'test',
      auto: true,
    },
  ],
})
