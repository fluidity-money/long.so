import { test, expect } from "./fixtures";

test("should navigate to the stake page", async ({ page }) => {
  await page.goto("/");

  await page.waitForSelector("data-test=third-page-anchor");

  await expect(page.getByTestId("third-page-anchor")).toContainText(
    "Go to third page",
  );
  await page.getByTestId("third-page-anchor").click();
  await expect(page).toHaveURL("/third");
  await expect(page.locator("h3")).toContainText("Third page");
});
