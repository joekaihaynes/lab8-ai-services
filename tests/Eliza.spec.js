import { test, expect } from '@playwright/test';

test.describe('Eliza Chatbot Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to your app
        await page.goto('/');

        // Make sure Eliza mode is selected
        await page.selectOption('#mode', 'eliza');

        // Clear any existing messages
        const clearButton = page.locator('#clearButton');
        await clearButton.click();
    });

    test('should respond to hello greeting', async ({ page }) => {
        // Type a message
        const input = page.locator('.input-area input[type="text"]');
        await input.fill('Hello');

        // Click send button
        await page.locator('.input-area button[type="submit"]').click();

        // Wait for user message to appear
        await expect(page.locator('.msg-row.user text-bubble')).toContainText('Hello');

        // Wait for bot response
        await expect(page.locator('.msg-row.bot text-bubble')).toBeVisible();

        // Check that bot response contains expected greeting pattern
        const botResponse = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(botResponse.toLowerCase()).toMatch(/hello|hi|hey|how/i);
    });

});
