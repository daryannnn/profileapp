import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/profile/uwQpIREuHGY1b2Mu4EjXfEDw6eW2');
    await expect(page.getByRole("button", { name: 'избранное' } )).toBeVisible();
    await expect(page.getByTestId("name")).toContainText("Тренажерный зал");
});

test.describe('Testing upper profile', () => {
    test('going to photos page', async ({ page }) => {
        await page.getByTestId("photos-button").click();
        await expect(page).toHaveURL('http://localhost:3002/photos/uwQpIREuHGY1b2Mu4EjXfEDw6eW2')
        await expect(page.getByTestId("user-type")).toContainText("организации");
        await expect(page.getByTestId("photos-name")).toContainText("Тренажерный зал");
        await page.getByRole("button").click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.setInputFiles('input[type="file"]', './tests/fixtures/image.jpg')
        await expect(page.getByRole("img")).toBeVisible();
    })
});