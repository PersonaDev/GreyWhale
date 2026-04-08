import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors({ origin: "*" }));

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      requestId?: string;
    }
  }
}

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.requestId = Math.random().toString(36).slice(2, 9);
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${req.requestId}] --> ${req.method} ${req.path} | origin: ${req.headers.origin ?? "none"} | ip: ${req.ip}`);
  next();
});

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), (req: Request, _res: Response, next: NextFunction) => {
  req.rawBody = req.body as Buffer;
  req.body = JSON.parse((req.rawBody as Buffer).toString());
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.method !== "GET" && req.path !== "/api/stripe/webhook") {
    console.log(`[${req.requestId}] body:`, JSON.stringify(req.body));
  }
  next();
});

app.use("/api", router);

app.use((req: Request, res: Response) => {
  console.warn(`[${req.requestId}] 404 NOT FOUND: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${req.requestId}] UNHANDLED ERROR on ${req.method} ${req.originalUrl}:`, err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

export default app;
