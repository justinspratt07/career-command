import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("adds, persists, edits, and filters an application", async ({ page }) => {
  await expect(page).toHaveTitle("CareerCommand");
  await expect(page.getByRole("heading", { name: "Applications" })).toBeVisible();

  await page.getByRole("button", { name: "Add Application" }).click();
  const drawer = page.locator(".application-drawer");
  await expect(drawer.getByRole("heading", { name: "Add Application" })).toBeVisible();

  await drawer.getByLabel("Role", { exact: true }).fill("Junior React Developer");
  await drawer.getByLabel("Company").fill("Evergreen Apps");
  await drawer.getByLabel("Location").fill("Remote, US");
  await drawer.getByLabel("Salary").fill("$65k-$75k");
  await drawer.getByLabel("Stage").selectOption("Applied");
  await drawer.getByLabel("Resume fit").fill("88");
  await drawer.getByLabel("Applied date").fill("2026-06-21");
  await drawer.getByLabel("Follow-up date").fill("2026-06-27");
  await drawer.getByLabel("Source").fill("LinkedIn");
  await drawer.getByLabel("Contact").fill("Talent team");
  await drawer.getByLabel("Resume version").fill("frontend-react-portfolio.pdf");
  await drawer.getByLabel("Skills").fill("React, TypeScript, CSS");
  await drawer.getByLabel("Next step").fill("Send portfolio follow-up");
  await drawer.getByLabel("Notes").fill("Added from the desktop drawer during QA.");
  await page.getByRole("button", { name: "Save Application" }).click();

  await expect(page.getByRole("row", { name: /Junior React Developer/ })).toBeVisible();
  await expect(page.getByText("Evergreen Apps", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("row", { name: /Junior React Developer/ })).toBeVisible();

  await page.getByRole("row", { name: /Junior React Developer/ }).click();
  await page.getByRole("button", { name: "Edit role" }).click();
  await page
    .locator(".application-drawer")
    .getByLabel("Next step")
    .fill("Prepare portfolio walkthrough");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Prepare portfolio walkthrough")).toBeVisible();

  await page.getByPlaceholder("Search roles or companies").fill("no-match-xyz");
  await expect(page.getByText("No applications found")).toBeVisible();
});
