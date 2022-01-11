import express, { Request, response, Response } from "express";
import config from '../../config/config';
import { subscribe } from "../../utils";
import axios from "axios";


const router = express.Router();
const CALLBACK_URI = config.get('callback_uri');

router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.context.bap_uri) {
        // Assuming, if bap_uri is not set, user wants sync response.
        body.context.bap_uri = CALLBACK_URI;
    }
    
    const bppResponse = await axios({ 
        url: combineURLs(req.body.context.bpp_uri, req.baseUrl),
        method: 'POST',
        data: body,
        headers: req.headers
    }).catch(err => {
        return res.status(500).end(err);
    });

    if (bppResponse.status < 300) {
        subscribe(req.message_id, (err, response) => {
            if (err) {
                return res.status(500).end(err);
            }

            return res.send(response);
        })    
    } else {
        res.status(response.statusCode).end();
    }

});

function combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
}

module.exports = router;
