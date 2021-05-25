import express, { Request, Response } from "express";
import { getAckResponse, initiateSearch, getBPPList } from "./utils";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const { context } = req.body;
    const { use_case } = req.headers;
    const result = await getBPPList();
    const BPP_ARRAY = result.data;
    console.log(`BPPs received from db: ${BPP_ARRAY}`)
    console.log(`MOCK_BG : ${context.transaction_id} : Initiating searching for BAP ${context.bap_id}:${context.bap_uri}`);
    const ack = await getAckResponse(req);
    res.status(200).send(ack);
    if(req.body.context.bpp_uri !== undefined && req.body.context.bpp_uri != "" && req.body.context.bpp_uri != "string") {
        initiateSearch(req.body.context.bpp_uri, req.body, use_case)
    } else {
        BPP_ARRAY.forEach((BPP_URL: string) => initiateSearch(BPP_URL, req.body, use_case));
    }
});

module.exports = router;