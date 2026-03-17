# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"The Scriptorium" — an AI-powered English mastery app for academic/research writing. It presents daily tasks covering vocabulary, phrasebank, rewriting, sentence comparison, grammar correction, and grammar reference exercises. Uses the Claude API (via browser-side `fetch` to `api.anthropic.com`) for AI-powered rewrite feedback and grammar checking.

## Development Commands

```bash
# Start both backend and frontend (backend in background)
npm start

# Start only the Vite dev server (frontend, port 5173)
npm run dev

# Start only the Express API server (port 3001)
npm run server

# Build for production
npm run build
```

No test framework is configured.

## Architecture

**Single-page React app + Express API backend:**

- `src/App.jsx` — The entire frontend lives in one file. Contains all data banks (vocab, phrasebank, rewrite prompts, comparison pairs, grammar rules, grammar exercises), the Claude API helper, task view components, and the main App component. ~1300 lines.
- `server.js` — Express API server on port 3001. Uses `better-sqlite3` with a local `scriptorium.db` file. Provides REST endpoints under `/api/` for vocab progress, rewrite history, grammar submissions, daily tasks, and bank cursors.
- `vite.config.js` — Proxies `/api` requests to `localhost:3001` during development.

**Key patterns:**
- All exercise data is hardcoded in `App.jsx` as const arrays/objects (VOCAB_DATA, PHRASEBANK_DATA, REWRITE_DATA, COMPARE_DATA, GRAMMAR_DATA, GRAMMAR_PRACTICE).
- A "bank cursor" system (`getNextItems`) rotates through data banks sequentially, persisted server-side, so users see new items each day.
- Daily tasks are deterministically generated from the date string using a seeded random function (`seededRandom`, `pickDailyTaskTypes`).
- Each task type has its own `*TaskView` component (VocabTaskView, PhrasesTaskView, RewriteTaskView, CompareTaskView, GrammarTaskView, GrammarRefTaskView).
- The Claude API call (`callClaude`) is made directly from the browser — the API key is passed in request headers (not stored server-side).

**Styling:** Tailwind CSS with custom fonts (Cormorant Garamond + Nunito Sans). Light theme with a medieval/scriptorium aesthetic.

**Database tables:** `vocab_progress`, `rewrite_history`, `grammar_submissions`, `daily_tasks`, `bank_cursor`.

## Expanding Exercise Banks

When the user asks to generate more exercises for `GRAMMAR_PRACTICE` (or other banks), follow this pattern:

1. **Reference the error log** at `/home/kexin/Notes/phd_notes/English Error Log.md` for targeted error categories. Exercises should reflect real L1 (Chinese→English) transfer errors from that log.
2. **Format**: `{ sentence: "...", corrected: "...", categories: ["..."] }` — the sentence has deliberate errors, corrected is the fix, categories tag the error types.
3. **Category distribution** (weighted by frequency from the error log): Articles (~20%), Prepositions (~15%), Subject-verb agreement (~12%), Tense consistency (~12%), Word choice/confusion (~15%), Uncountable nouns (~5%), Sentence structure/word order (~10%), Spelling/compounds (~5%), Verb forms (~6%).
4. **Domain**: Sentences should use academic/research CS/ML/robotics/HCI context matching the user's PhD work.
5. **Target ~200 exercises per batch**. Once the user has cycled through all exercises, generate a fresh batch to replace the old ones.
