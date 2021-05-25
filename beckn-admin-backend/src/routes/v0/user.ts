import express, { Request, Response } from "express";
import { createNewUser, loginUser, changePassword } from "../../utils/user";
import { auth } from "./middleware/auth";
import { getAllBPPs } from "../../utils/platform";


const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const user = await createNewUser(req);
        res.status(201).send(user.toResponse());
    } catch (e) {
        res.status(400).send({ status: "error", message: e?.message })
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const result = await loginUser(req);
        if (result?.status === "success") {
            res.status(200).send(result);
        } else {
            res.status(401).send(result);
        }
    } catch (e) {
        res.status(400).send({ status: "error", message: e?.message })
    }
});

router.post('/changePassword', auth, async (req: Request, res: Response) => {
    try {
        const { new_password, old_password } = req.body
        const result = await changePassword(req.body.authenticated_user_obj, new_password, old_password);
        if (result.status === 'success') {
            res.status(201).send(result);
        } else {
            res.status(400).send(result)
        }
    } catch (e) {
        res.status(400).send({ status: "error", message: e?.message });
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        const user = req.body.authenticated_user_obj;
        user.logout();
        res.status(200).send({ status: "success", message: "logged out" });
    } catch (e) {
        res.status(400).send({ status: "error", message: e?.message })
    }
});

router.get("/bpp", async (req: Request, res: Response) => {
    try {
        const platforms = await getAllBPPs();
        res.status(200).send(platforms);
    } catch (error) {
        res.send(500).send({ status: "error", message: error?.message });
    }
});

module.exports = router;