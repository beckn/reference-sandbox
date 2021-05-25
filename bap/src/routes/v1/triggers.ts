import express, { Request, Response } from "express";
import { initiateSearch, initiateCall, wait, getResultsFromApp, validateTriggerRequest } from "./utils";

const router = express.Router();

router.post("/search", async (req: Request, res: Response) => {
    const error = await validateTriggerRequest(req, 'search');
    if(error.message) {
        return res.status(400).send({ error });
    }
    const transaction_id = await initiateSearch(req);
    await wait(parseInt(req.body.ttl || 0));
    const result = getResultsFromApp(req, transaction_id);
    res.status(200).send(result);
});

router.post("/:api", async (req: Request, res: Response) => {
    const api = req.params.api;
    const error = await validateTriggerRequest(req, api);
    if(error.message) {
        return res.status(400).send({ error });
    }
    initiateCall(req, api);
    await wait(parseInt(req.body.ttl || 0));
    const result = getResultsFromApp(req, req.body.transaction_id);
    res.status(200).send(result);
});

module.exports = router;