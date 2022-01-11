import express, { Request, Response } from "express";
import { publish } from "../../utils";

const router = express.Router();


router.post("/", async (req: Request, res: Response) => {
    publish(req.body);
    res.end("");
});



module.exports = router;
