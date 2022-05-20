import { Router } from "express";
import pollRouter from "./pollRouter.js";

const router = Router();

router.use(pollRouter);

export default router;