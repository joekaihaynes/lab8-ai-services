# Lab 8 -AI Services + PLaywright E2E Testing 

## Project Overview 
This lab builds directly on Lab 7 (MVC Chat App with CRUD + Persistence) and introduces an AI Service Layer to integrate real large language models
(LLMs) like OpenAI, Groq, and OpenRouter while keeping the core app modular, testable, and secure.
The project adds a configurable AI provider system and end-to-end testing using Playwright, reflecting real-world software engineering practices.

## Repository Structure
`
lab8-ai-services/
├── r-n-d/
│   ├── GroqTest/
│   │   ├── index.html
│   │   └── script.js
│   └── OpenRouterTest/
│       ├── index.html
│       └── script.js
├── src/
│   ├── index.html
│   ├── styles.css
│   └── js/
│       ├── app.js
│       ├── controller.js
│       ├── eliza.js
│       ├── llm.js
│       ├── model.js
│       └── view.js
├── tests/
│   ├── eliza.spec.js
│   └── groq.spec.js
├── .gitignore
├── README.md
├── LICENSE
└── package.json
`
### Providers Tested

| Provider       | Free Tier?           | Speed       | Ease of Use | Cost                  | Privacy | Verdict         |
|----------------|----------------------|-------------|-------------|-----------------------|---------|-----------------|
| **OpenRouter** | 10M tokens free/mo   | Fast        | Excellent   | Free tier + pay-as-you-go | Cloud   | **Chosen**      |
| **Groq**       | 1M tokens free/mo    | Very Fast   | Good        | Free tier             | Cloud   | Runner-up       |


# 1. **API Key Security in Client-Side Apps**
**Challenge:**  
Storing API keys in the browser (even in `localStorage`) is inherently insecure — they can be extracted via DevTools.

**Lesson Learned:**
- **Never use client-side secrets in production.**
- Use a **serverless proxy** (e.g., Cloudflare Worker, Netlify Function) to hide the key.
- For learning/demo apps: **prompt + `localStorage` is acceptable**, but document the risk.

### 2. **LLM Response Non-Determinism in E2E Tests**
**Challenge:**  
Cloud AI responses vary → Playwright tests fail due to string mismatches.

**Lesson Learned:**
- **Never assert exact response text** from real LLMs in tests.
- Use **response mocking** via `page.route()` to simulate API behavior.
- Test **structure** (message appears, UI updates) not content.

### 3. **Setting Up Playwright with JSON-Based Testing (Biggest Issue)**
**Challenge:**  
- could not figure out why it kept timing out 


### Link
https://joekaihaynes.github.io/lab8-ai-services/

## Author
Joe Haynes
University of San Diego – COMP 305