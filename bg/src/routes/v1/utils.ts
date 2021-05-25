import { Request } from "express";
import axios from "axios";
import fs from "fs/promises";
import config from "../../config/config";

export const getAckResponse = async (req: Request) => {
    const res_data = await fs.readFile(`./../mock_json_files/ack.json`, 'utf-8');
    const ack = JSON.parse(res_data);
    if (req.body.context) {
        ack.context = req.body.context;
    }
    ack.context.timestamp = new Date().toISOString();
    return ack;
};

function combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
};

export const sendResult = async (body: any) => {
    try {
        console.log(`MOCK_BG : ${body.context.transaction_id} : Sending results to ${body.context.bap_id}:${body.context.bap_uri}`);
        const res = await axios.post(combineURLs(body.context.bap_uri, "/on_search"), body);
    } catch (error) {
        console.log(`MOCK_BG`, error);
    }
};

export const getBPPList = async () => {
    try {
        const res = await axios.get(combineURLs(config.admin_backend, "/user/bpp"));
        if (res.status === 200) {
            const bpp_array = res.data.map((bpp: { platform_endpoint: any; }) => bpp.platform_endpoint); 
            return { status: "success", data: bpp_array };
        } else {
            return { status: "error", message: res.data };
        }
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

export const initiateSearch = async (bpp_uri: string, req: any, use_case: any) => {
    try {
        req.context.bpp_uri = bpp_uri;
        const res = await axios.post(combineURLs(bpp_uri, "/search"), req, { headers: { use_case, "proxy-authorization": "bg_auth_placeholder" } });
        console.log(`MOCK_BG : ${req.context.transaction_id} : Initiated search on ${bpp_uri}`);
    } catch (error) {
        console.log(`MOCK_BG : ${req.context.transaction_id} : Error searching BPP ${bpp_uri}`, error);
    }
};