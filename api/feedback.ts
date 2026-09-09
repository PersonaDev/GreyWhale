import pg from "pg";

const { Pool } = pg;
let pool: pg.Pool | undefined;

const roadmapIds = new Set([
  "public-project-notes",
  "a-clearer-view-of-current-projects",
  "custom-crm-and-lead-management",
  "legal-intake-and-workflow-tools",
  "greywhale-feedback-board",
  "omni-project-page",
]);

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}

async function prepareDatabase() {
  await getPool().query(
    "CREATE TABLE IF NOT EXISTS greywhale_feedback_requests (id UUID PRIMARY KEY, kind TEXT NOT NULL DEFAULT 'feature', title TEXT NOT NULL, details TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'submitted', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  );
  await getPool().query(
    "CREATE TABLE IF NOT EXISTS greywhale_roadmap_votes (item_id TEXT NOT NULL, voter_key TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (item_id, voter_key))",
  );
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  try {
    await prepareDatabase();
    if (req.method === "GET") {
      const requests = await getPool().query(
        "SELECT id, title, status, EXTRACT(EPOCH FROM created_at) * 1000 AS \"createdAt\" FROM greywhale_feedback_requests WHERE kind = 'feature' ORDER BY created_at DESC LIMIT 20",
      );
      const votes = await getPool().query(
        'SELECT item_id AS "itemId", COUNT(*)::int AS votes FROM greywhale_roadmap_votes GROUP BY item_id',
      );
      res.json({
        requests: requests.rows,
        votes: Object.fromEntries(
          votes.rows.map((row) => [row.itemId, row.votes]),
        ),
      });
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const body = req.body ?? {};
    if (body.action === "vote") {
      const itemId = typeof body.itemId === "string" ? body.itemId : "";
      const voterKey = typeof body.voterKey === "string" ? body.voterKey : "";
      if (!roadmapIds.has(itemId) || !/^[a-f0-9-]{20,64}$/i.test(voterKey)) {
        res.status(400).json({ error: "Invalid vote" });
        return;
      }
      await getPool().query(
        "INSERT INTO greywhale_roadmap_votes (item_id, voter_key) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [itemId, voterKey],
      );
      const result = await getPool().query(
        "SELECT COUNT(*)::int AS votes FROM greywhale_roadmap_votes WHERE item_id = $1",
        [itemId],
      );
      res.json({ votes: result.rows[0].votes });
      return;
    }

    const kind =
      body.kind === "legal" || body.kind === "general" ? body.kind : "feature";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const details = typeof body.details === "string" ? body.details.trim() : "";
    if (body.website) {
      res.json({ ok: true });
      return;
    }
    if (title.length < 5 || title.length > 120) {
      res
        .status(400)
        .json({ error: "Use a title between 5 and 120 characters." });
      return;
    }
    if (details.length < 20 || details.length > 2000) {
      res.status(400).json({ error: "Add between 20 and 2,000 characters." });
      return;
    }

    const result = await getPool().query(
      'INSERT INTO greywhale_feedback_requests (id, kind, title, details) VALUES ($1, $2, $3, $4) RETURNING id, kind, title, status, EXTRACT(EPOCH FROM created_at) * 1000 AS "createdAt"',
      [crypto.randomUUID(), kind, title, details],
    );
    res.status(201).json({ request: result.rows[0] });
  } catch (error) {
    console.error("[feedback]", error);
    res.status(503).json({ error: "Feedback is temporarily unavailable." });
  }
}
