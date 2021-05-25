import express, { Request, Response } from "express";
import config from "../../config/config"

const router = express.Router();

router.get("/settings", async (req: Request, res: Response) => {
    res.status(200).send(config.stores.file.store);
});

router.post("/settings", async (req: Request, res: Response) => {
    try {
        Object.keys(req.body).forEach((key) => {
            config.set(key, req.body[key]);
        });
        config.save(0);
        res.status(200).send(config.stores.file.store);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
