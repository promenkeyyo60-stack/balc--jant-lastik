import { Router, type IRouter } from "express";
import healthRouter from "./health";
import squadsRouter from "./squads";
import analysisRouter from "./analysis";

const router: IRouter = Router();

router.use(healthRouter);
router.use(squadsRouter);
router.use(analysisRouter);

export default router;
