import express, { Request, Response } from "express";
import { getAckResponse, sendResult } from "./utils";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const { results, context } = req.body;
    const ack = getAckResponse(req);
    res.status(200).send(ack);
    console.log(`MOCK_BG : ${context.transaction_id} :Received result from ${context.bpp_id}:${context.bpp_uri}`);
    sendResult(req.body);
});

module.exports = router;