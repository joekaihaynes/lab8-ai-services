// tests/groq-mocked.spec.js
import { test, expect } from '@playwright/test';

const MOCK_RESPONSE = "This is a **mocked** LLM response with *markdown*!";

test.describe('Groq Mode (Mocked)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.selectOption('#mode', 'groq');
    });

    test('requires API key before sending message', async ({ page }) => {
        await page.fill('.input-area input', 'hello');
        await page.click('.input-area button[type="submit"]');
        await page.waitForSelector('.msg-row.bot', { timeout: 5000 });
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(bot.trim()).toBe('LLM error:No API key found.');
    });

    test('uses stored API key and returns mocked response', async ({ page }) => {
        await page.route('https://api.groq.com/openai/v1/chat/completions', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    choices: [{ message: { content: MOCK_RESPONSE } }]
                })
            });
        });

        await page.fill('#apiKey', 'fake-key-123');
        await page.click('#api-input button[type="submit"]');
        await page.waitForTimeout(200);

        await page.fill('.input-area input', 'tell me a joke');
        await page.click('.input-area button[type="submit"]');
        await page.waitForSelector('.msg-row.bot');

        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(bot.trim()).toBe(MOCK_RESPONSE);
    });

    test('handles network error from API', async ({ page }) => {
        await page.route('https://api.groq.com/**', route => route.abort());

        await page.fill('#apiKey', 'fake-key');
        await page.click('#api-input button[type="submit"]');
        await page.waitForTimeout(100);

        await page.fill('.input-area input', 'hello');
        await page.click('.input-area button[type="submit"]');
        await page.waitForSelector('.msg-row.bot');

        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(bot.trim()).toBe('LLM error:Network Error');
    });

    test('handles malformed JSON response', async ({ page }) => {
        await page.route('https://api.groq.com/**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: '{invalid json'
            });
        });

        await page.fill('#apiKey', 'fake');
        await page.click('#api-input button[type="submit"]');
        await page.waitForTimeout(100);

        await page.fill('.input-area input', 'hi');
        await page.click('.input-area button[type="submit"]');
        await page.waitForSelector('.msg-row.bot');

        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(bot.trim()).toBe('LLM error:Network Error');
    });

    test('disables API key input after submission', async ({ page }) => {
        await page.fill('#apiKey', 'my-secret-key');
        await page.click('#api-input button[type="submit"]');

        await expect(page.locator('#apiKey')).toBeDisabled();
        await expect(page.locator('#apiKey')).toHaveAttribute('placeholder', 'Key is Stored');
        await expect(page.locator('#apiKey')).toHaveValue('');
    });

});