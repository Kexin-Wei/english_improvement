import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── Database setup ──────────────────────────────────────────
const db = new Database(join(__dirname, "scriptorium.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS vocab_progress (
    word TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'unseen' CHECK(status IN ('unseen','learning','known')),
    times_seen INTEGER NOT NULL DEFAULT 0,
    last_reviewed TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rewrite_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_sentence TEXT NOT NULL,
    user_rewrite TEXT NOT NULL,
    ai_rating INTEGER,
    ai_feedback TEXT,
    model_rewrite TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS grammar_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_text TEXT NOT NULL,
    corrected_text TEXT,
    error_count INTEGER DEFAULT 0,
    errors_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS daily_tasks (
    date TEXT NOT NULL,
    task_index INTEGER NOT NULL,
    task_type TEXT NOT NULL,
    item_ids TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    PRIMARY KEY (date, task_index)
  );

  CREATE TABLE IF NOT EXISTS bank_cursor (
    bank TEXT PRIMARY KEY,
    cursor_pos INTEGER NOT NULL DEFAULT 0
  );
`);

// ── Prepared statements ─────────────────────────────────────
const stmts = {
  getVocab: db.prepare("SELECT * FROM vocab_progress"),
  getVocabWord: db.prepare("SELECT * FROM vocab_progress WHERE word = ?"),
  upsertVocab: db.prepare(`
    INSERT INTO vocab_progress (word, status, times_seen, last_reviewed, updated_at)
    VALUES (@word, @status, 1, datetime('now'), datetime('now'))
    ON CONFLICT(word) DO UPDATE SET
      status = @status,
      times_seen = times_seen + 1,
      last_reviewed = datetime('now'),
      updated_at = datetime('now')
  `),

  addRewrite: db.prepare(`
    INSERT INTO rewrite_history (original_sentence, user_rewrite, ai_rating, ai_feedback, model_rewrite)
    VALUES (@original_sentence, @user_rewrite, @ai_rating, @ai_feedback, @model_rewrite)
  `),

  addGrammar: db.prepare(`
    INSERT INTO grammar_submissions (original_text, corrected_text, error_count, errors_json)
    VALUES (@original_text, @corrected_text, @error_count, @errors_json)
  `),

  getDailyTasks: db.prepare("SELECT * FROM daily_tasks WHERE date = ? ORDER BY task_index"),
  upsertDailyTask: db.prepare(`
    INSERT INTO daily_tasks (date, task_index, task_type, item_ids, completed)
    VALUES (@date, @task_index, @task_type, @item_ids, 0)
    ON CONFLICT(date, task_index) DO NOTHING
  `),
  completeDailyTask: db.prepare(`
    UPDATE daily_tasks SET completed = 1, completed_at = datetime('now')
    WHERE date = @date AND task_index = @task_index
  `),
  uncompleteDailyTask: db.prepare(`
    UPDATE daily_tasks SET completed = 0, completed_at = NULL
    WHERE date = @date AND task_index = @task_index
  `),

  getCursor: db.prepare("SELECT cursor_pos FROM bank_cursor WHERE bank = ?"),
  upsertCursor: db.prepare(`
    INSERT INTO bank_cursor (bank, cursor_pos) VALUES (@bank, @cursor_pos)
    ON CONFLICT(bank) DO UPDATE SET cursor_pos = @cursor_pos
  `),
};

// ── Routes: Vocabulary ──────────────────────────────────────
app.get("/api/vocab", (req, res) => {
  res.json(stmts.getVocab.all());
});

app.put("/api/vocab/:word", (req, res) => {
  const { status } = req.body;
  if (!["unseen", "learning", "known"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  stmts.upsertVocab.run({ word: req.params.word, status });
  res.json(stmts.getVocabWord.get(req.params.word));
});

// ── Routes: Rewrite history ─────────────────────────────────
app.post("/api/rewrites", (req, res) => {
  const { original_sentence, user_rewrite, ai_rating, ai_feedback, model_rewrite } = req.body;
  const result = stmts.addRewrite.run({
    original_sentence,
    user_rewrite,
    ai_rating: ai_rating || null,
    ai_feedback: ai_feedback || null,
    model_rewrite: model_rewrite || null,
  });
  res.json({ id: result.lastInsertRowid });
});

// ── Routes: Grammar history ─────────────────────────────────
app.post("/api/grammar", (req, res) => {
  const { original_text, corrected_text, error_count, errors } = req.body;
  const result = stmts.addGrammar.run({
    original_text,
    corrected_text: corrected_text || null,
    error_count: error_count || 0,
    errors_json: errors ? JSON.stringify(errors) : null,
  });
  res.json({ id: result.lastInsertRowid });
});

// ── Routes: Bank cursors ────────────────────────────────────
app.get("/api/cursor/:bank", (req, res) => {
  const row = stmts.getCursor.get(req.params.bank);
  res.json({ cursor_pos: row?.cursor_pos ?? 0 });
});

app.put("/api/cursor/:bank", (req, res) => {
  const { cursor_pos } = req.body;
  stmts.upsertCursor.run({ bank: req.params.bank, cursor_pos });
  res.json({ ok: true });
});

// ── Routes: Daily Tasks ─────────────────────────────────────
app.get("/api/daily-tasks/:date", (req, res) => {
  const tasks = stmts.getDailyTasks.all(req.params.date);
  res.json(tasks);
});

app.post("/api/daily-tasks", (req, res) => {
  const { date, tasks } = req.body;
  for (const t of tasks) {
    stmts.upsertDailyTask.run({
      date,
      task_index: t.task_index,
      task_type: t.task_type,
      item_ids: t.item_ids,
    });
  }
  res.json(stmts.getDailyTasks.all(date));
});

app.put("/api/daily-tasks/:date/:index/complete", (req, res) => {
  stmts.completeDailyTask.run({ date: req.params.date, task_index: parseInt(req.params.index) });
  res.json({ ok: true });
});

app.put("/api/daily-tasks/:date/:index/uncomplete", (req, res) => {
  stmts.uncompleteDailyTask.run({ date: req.params.date, task_index: parseInt(req.params.index) });
  res.json({ ok: true });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Scriptorium API running on http://localhost:${PORT}`);
});
