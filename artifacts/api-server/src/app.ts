import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, _res, next) => {
  req.rawBody = req.body;
  req.body = JSON.parse(req.body.toString());
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
