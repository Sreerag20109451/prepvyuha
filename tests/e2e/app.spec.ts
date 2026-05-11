import { expect, test } from "@playwright/test";

const protectedRoutes = [
  "/dashboard",
  "/notes",
  "/syllabus",
  "/practice",
  "/calendar",
  "/pomodoro",
];

test("public landing page links into the workspace", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /PrepVyuha/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Workspace" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Master the UPSC Syllabus/i })).toBeVisible();
});

for (const route of protectedRoutes) {
  test(`protects ${route} when signed out`, async ({ page }) => {
    await page.goto(route);

    await expect(
      page
        .getByRole("heading", { name: /Sign in to your workspace/i })
        .or(page.getByText("Loading workspace")),
    ).toBeVisible();
    await expect(page.getByText(/Recent Notes|Study Calendar|Start a focus block/i)).toHaveCount(0);
  });
}
