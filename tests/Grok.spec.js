import { test, expect } from '@playwright/test';

test.describe('Groq AI Chatbot Tests with Mocking', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Clear localStorage to start fresh
        await page.evaluate(() => {
            localStorage.clear();
        });

        await page.reload();
    });

    test('should mock Groq API and display response', async ({ page }) => {
        // Mock the Groq API call
        await page.route('https://api.groq.com/openai/v1/chat/completions', async (route) => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: 'This is a mocked AI response for testing purposes.'
                        }
                    }
                ]
            };

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockResponse)
            });
        });

        // Set API key and select Groq mode
        await page.locator('#apiKey').fill('test-api-key-12345');
        await page.locator('#api-input button[type="submit"]').click();
        await page.selectOption('#mode', 'groq');

        // Clear any existing messages
        await page.locator('#clearButton').click();

        // Send a message
        const input = page.locator('.input-area input[type="text"]');
        await input.fill('Hello AI');
        await page.locator('.input-area button[type="submit"]').click();

        // Wait for user message
        await expect(page.locator('.msg-row.user text-bubble')).toContainText('Hello AI');

        // Wait for mocked AI response
        await expect(page.locator('.msg-row.bot text-bubble')).toContainText('This is a mocked AI response for testing purposes.');
    });


});
