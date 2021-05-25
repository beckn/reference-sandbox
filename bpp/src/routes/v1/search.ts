import express, { Request, Response } from "express";
import logger from "../../logger";

import config from "./../../config/config"
import { getAckResponse, getAllUseCases, isValidUseCase, sendResults } from "./utils"

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const ack = await getAckResponse(req);
    const use_case = req.headers.use_case?.toString() || "";
    const proxy_auth = req.headers["proxy-authorization"]?.toString() || "";
    const valid_use_case = await isValidUseCase(req.body.context.domain, use_case);
    if (!valid_use_case) {
        const use_cases = await getAllUseCases();
        logger.error(`${config.get('bpp_id')} ERROR : Invalid use case`);
        return res.status(400).send({message:"Invalid domain/use case. Please select a valid one",use_cases});
    }
    res.status(200).send(ack);
    const end_point = proxy_auth ? config.get('bg_uri') : req.body.context.bap_uri;
    sendResults(req, end_point, 'search');
});


module.exports = router;
