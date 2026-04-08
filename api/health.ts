import { Pool } from "pg";

export default async function handler(req: any, res: any) {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    res.status(200).json({ db: "missing", error: "DATABASE_URL not set" });
    return;
  }

  try {
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    await pool.end();
    res.status(200).json({ db: "ok", urlPrefix: dbUrl.slice(0, 30) + "…" });
  } catch (err) {
    res.status(200).json({
      db: "error",
      urlPrefix: dbUrl.slice(0, 30) + "…",
      error: (err as Error).message,
    });
  }
}
