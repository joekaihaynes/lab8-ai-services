// tests/eliza.spec.js
import { test, expect } from '@playwright/test';

const ELIZA_RESPONSES = {
    hello: [
        "Hello! How are you doing today?",
        "Hi there! What's on your mind?",
        "Hey! How can I help you?",
        "Howdy! What would you like to talk about?"
    ],
    howAreYou: [
        "I'm just a program, but I'm functioning well! How are you?",
        "I'm doing great! Thanks for asking. How about you?",
        "I'm here and ready to chat! How are you feeling?"
    ],
    name: [
        "I'm a simple chat assistant, built to demonstrate component-based thinking!",
        "I'm a chatbot created for educational purposes. Nice to meet you!",
        "You can call me ChatBot. I'm here to demonstrate different web component approaches."
    ],
    sorry: [
        "No need to apologize! Everything's fine.",
        "It's okay! No worries at all.",
        "Don't worry about it. We're all good!"
    ],
    yes: [
        "Great! What would you like to talk about?",
        "Awesome! Tell me more.",
        "Cool! What's next?"
    ],
    no: [
        "Okay, no problem! What else is on your mind?",
        "Fair enough. Is there something else you'd like to discuss?",
        "I understand. What would you like to talk about instead?"
    ],
    iAm: /How (long have you been|do you think you are|does being) .*\?/i,
    question: /interesting question|not sure|thought-provoking|Good question/i,
    default: /Tell me more|I see|That's interesting|Go on|How does that make you feel|What do you mean|Can you explain/i
};

async function sendMessage(page, text) {
    await page.fill('.input-area input', text);
    await page.click('.input-area button[type="submit"]');
    await page.waitForSelector('.msg-row.bot', { state: 'attached', timeout: 5000 });
}

test.describe('Eliza Mode', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.selectOption('#mode', 'eliza');
    });

    test('greets on "hello"', async ({ page }) => {
        await sendMessage(page, 'hello');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(ELIZA_RESPONSES.hello.some(r => bot.trim() === r)).toBe(true);
    });

    test('responds to "how are you"', async ({ page }) => {
        await sendMessage(page, 'how are you');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(ELIZA_RESPONSES.howAreYou.some(r => bot.trim() === r)).toBe(true);
    });

    test('introduces itself', async ({ page }) => {
        await sendMessage(page, 'who are you');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(ELIZA_RESPONSES.name.some(r => bot.trim() === r)).toBe(true);
    });

    test('handles apology', async ({ page }) => {
        await sendMessage(page, 'sorry');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(ELIZA_RESPONSES.sorry.some(r => bot.trim() === r)).toBe(true);
    });

    test('responds to "yes"', async ({ page }) => {
        await sendMessage(page, 'yes');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(ELIZA_RESPONSES.yes.some(r => bot.trim() === r)).toBe(true);
    });

    test('responds to "no"', async ({ page }) => {
        await sendMessage(page, 'no');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(ELIZA_RESPONSES.no.some(r => bot.trim() === r)).toBe(true);
    });

    test('matches "I am X"', async ({ page }) => {
        await sendMessage(page, 'I am tired');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(bot.trim()).toMatch(ELIZA_RESPONSES.iAm);
    });

    test('handles questions', async ({ page }) => {
        await sendMessage(page, 'Why is the sky blue?');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(bot.trim()).toMatch(ELIZA_RESPONSES.question);
    });

    test('falls back to default', async ({ page }) => {
        await sendMessage(page, 'random gibberish xyz');
        const bot = await page.locator('.msg-row.bot text-bubble').last().textContent();
        expect(bot.trim()).toMatch(ELIZA_RESPONSES.default);
    });

});