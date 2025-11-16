import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';

const DATA_FILE = path.resolve('./data/count.json');

function readCount() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw).count ?? 0;
  } catch {
    return 0;
  }
}
function writeCount(n) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ count: n }), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/count', (req, res) => {
  const count = readCount();
  res.json({ ok: true, count });
});

app.post('/api/increment', (req, res) => {
  const delta = typeof req.body.delta === 'number' ? req.body.delta : 1;
  let count = readCount();
  count += delta;
  writeCount(count);
  res.json({ ok: true, count });
});

app.post('/api/reset', (req, res) => {
  writeCount(0);
  res.json({ ok: true, count: 0 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));

export default app;
