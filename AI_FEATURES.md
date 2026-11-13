# AI Features for SplitMate

### 1. Natural-language transaction drafts — best starting point

A user types “Coffee ₹180 this morning” or “I got ₹500 cashback yesterday.” AI extracts the description, amount, date, category, and debit/credit direction into a draft. If information is missing or ambiguous, it asks the user instead of guessing. The user reviews the draft and chooses the account before saving.

**You’ll learn:** prompt design, structured output, validation, and evaluating extraction quality. Structured Outputs can constrain responses to a schema your backend expects. [OpenAI Structured Outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs)

### 2. Receipt scanner

The user uploads a receipt and SplitMate proposes the merchant, total, date, and category. You could add line-item extraction later, such as splitting a receipt between group members. Treat the result as a draft: users should be able to correct mistakes before saving. Vision-capable models can analyze images and read visible text. [OpenAI images and vision guide](https://developers.openai.com/api/docs/guides/images-vision)

**You’ll learn:** image inputs, extraction prompts, upload handling, and measuring accuracy on real examples.

### 3. “Ask SplitMate” analytics

Users ask questions like “How much did I spend on food this month?” or “Which group has the most expenses?” The AI calls a small set of backend functions, such as `getPersonalSpendingByCategory` or `getGroupExpenseSummary`; your server runs the authorized database aggregation and returns the result for the AI to explain.

**You’ll learn:** tool/function calling and how to connect an LLM to application data. Keep the tools narrow and user-scoped; don’t let the model query MongoDB directly. [OpenAI function calling guide](https://developers.openai.com/api/docs/guides/function-calling)

### 4. Group split assistant

A user describes a split in plain language: “Split dinner equally between Alex and me, but Sam pays only for the drinks.” AI turns that into a proposed participant list and shares. The user reviews it, and your existing split code does the actual calculations.

**You’ll learn:** turning messy instructions into structured actions, handling ambiguity, and keeping financial calculations deterministic.

### 5. “Why do I owe this?” explanation

From a group balance, the user asks why they owe a specific person. AI receives the relevant expenses, shares, and settlements through a read-only backend function and explains the calculation with links to the records it used.

**You’ll learn:** grounded answers and retrieval from application data. The answer should be traceable to real records, not just a plausible-sounding explanation.

### 6. Spending insights

SplitMate could summarize patterns such as “You recorded more food transactions this month than last month.” Use regular code for comparisons and totals, then let AI phrase the result clearly. Keep it descriptive; don’t present uncertain predictions as financial advice.

**You’ll learn:** combining deterministic analytics with LLM-generated explanations and checking that the explanation matches the underlying data.

### A good build order

Start with **natural-language transaction drafts**, then add **receipt scanning**, then **Ask SplitMate**. Together, those show structured generation, multimodal input, and tool calling—three distinct AI skills. In every case, keep the API key on the backend, validate model output there, and require confirmation before creating or changing transactions.
