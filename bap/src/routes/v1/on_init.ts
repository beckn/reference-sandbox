import express, { Request, Response } from "express";
import config from "../../config/config";
import { getAckResponse, addResultToApp } from "./utils";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const ack = await getAckResponse(req);
    addResultToApp(req);
    res.status(200).send(ack);
    console.log(`${config.get('bap_id')} : ${req.body.context.transaction_id}  received result from ${req.body.context.bpp_id}:${req.body.context.bpp_uri}`);
});

module.exports = router;