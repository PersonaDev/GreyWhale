import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import stripeRouter from "./stripe";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(stripeRouter);
router.use(contactRouter);

export default router;
