import express, { Request, Response } from "express";
import { getSettingValues, setSettingsValue } from "../../utils/networkSettings"

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const setting = await getSettingValues();
        if(setting) {
            res.status(200).send(setting);
        } else {
            res.status(400).send("Bad Input");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const setting = await setSettingsValue(req.body);
        if(setting) {
            res.status(200).send(setting);
        } else {
            res.status(400).send("Bad Input");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;