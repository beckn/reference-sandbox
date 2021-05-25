import express, { Request, Response } from "express";
import { getAckResponse, sendResults } from "./utils"

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const ack = await getAckResponse(req)
    res.status(200).send(ack);
    sendResults(req, req.body.context.bap_uri, 'init');
});

module.exports = router;
