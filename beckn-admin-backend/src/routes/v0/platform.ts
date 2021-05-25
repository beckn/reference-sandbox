import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createNewPlatform, getAllPlatforms, updatePlatform, deletePlatform, getAllBAPs, getAllBPPs, getAllMockBPPs, triggerSync, getAllMockPlatforms } from "../../utils/platform"

const router = express.Router();

router.put("/", async (req: Request, res: Response) => {
    try {
        const platform = await updatePlatform(req.body);
        if(platform) {
            res.status(204).send(platform);
        } else {
            res.status(400).send("Bad Input");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete("/", async (req: Request, res: Response) => {
    try {
        const platform = await deletePlatform(req.body);
        if(platform) {
            res.status(204).send(platform);
        } else {
            res.status(400).send("Bad Input");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const platform = await createNewPlatform({ id: uuidv4(), ...req.body });
        res.status(201).send(platform);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/syncAll", async (req: Request, res: Response) => {
    try {
        const platforms = await getAllMockPlatforms();
        const results = await triggerSync(platforms);
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/syncAllBPPs", async (req: Request, res: Response) => {
    try {
        const platforms = await getAllMockBPPs();
        const results = await triggerSync(platforms);
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get("/", async (req: Request, res: Response) => {
    try {
        const platforms = await getAllPlatforms();
        res.status(200).send(platforms);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/bpp", async (req: Request, res: Response) => {
    try {
        const platforms = await getAllBPPs();
        res.status(200).send(platforms);
    } catch (error) {
        res.send(500).send(error.message);
    }
});

router.get("/bap", async (req: Request, res: Response) => {
    try {
        const platforms = await getAllBAPs();
        res.status(200).send(platforms);
    } catch (error) {
        res.send(500).send(error.message);
    }
});

module.exports = router;