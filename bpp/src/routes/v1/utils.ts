import { Request } from "express";
import fs from "fs/promises";
import config from "./../../config/config"
import axios from "axios";
import logger from "../../logger";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const wait = async () => {
    const delay_ms = config.get('delay');
    if (delay_ms !== 0) {
        logger.info(`${config.get('bpp_id')}: Delaying for ${delay_ms}`)
        await delay(delay_ms);
    }
}

export const getMockResponse = async (req: Request, use_case: string) => {
    const domain = req.body.context.domain;
    const req_data = await fs.readFile(`./../mock_json_files/${domain}/${use_case}.json`, 'utf-8');
    const req_obj = JSON.parse(req_data);
    req_obj.context = req.body.context;
    req_obj.context.bpp_uri = config.get('bpp_uri');
    req_obj.context.bpp_id = config.get('bpp_id');
    req_obj.context.timestamp = new Date().toISOString();
    return req_obj;
}

export const getAckResponse = async (req: Request) => {
    const res_data = await fs.readFile(`./../mock_json_files/ack.json`, 'utf-8');
    const ack = JSON.parse(res_data);
    if (req.body.context) {
        ack.context = req.body.context;
    }
    ack.context.timestamp = new Date().toISOString();
    return ack;
}

export const sendResults = async (req: Request, uri: string, api: string) => {
    try {
        await wait();
        const use_case = req.headers.use_case?.toString() || "";
        const use_case_api = use_case.split('/')[0];
        if (use_case_api === `on_${api}`) {
            const response = await getMockResponse(req, use_case);
            logger.info(`${config.get('bpp_id')} : ${response.context.transaction_id} Sending ${api} results to BAP ${response.context.bap_id}:${response.context.bap_uri} via ${uri}`);
            const res = await axios.post(combineURLs(uri, `/on_${api}`), response);
        } else { //Dont bother sending response from MOCK BPPs
            logger.info(`${config.get('bpp_id')} : ${req.body.context.transaction_id} Ignoring as use case is not valid for Mock BPP`);
        }
    } catch (error) {
        logger.error(error);
    }
}

function combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
};

export const getAllUseCases = async () => {
    const dir = await fs.readdir('./../mock_json_files', { withFileTypes: true })
    const domains = dir.filter(d => d.isDirectory() && d.name !== 'generic_jsons').map(d => d.name);
    let use_cases: { [k: string]: any } = {}
    for (let index = 0; index < domains.length; index++) {
        const domain = domains[index];
        const dir = await fs.readdir('./../mock_json_files/' + domain, { withFileTypes: true });
        const apis = dir.filter(d => d.isDirectory()).map(d => d.name);
        use_cases[domain] = [];
        for (let index = 0; index < apis.length; index++) {
            const api = apis[index];
            const dir = await fs.readdir(`./../mock_json_files/${domain}/${api}`);
            const use_case = dir.filter(s => s.endsWith('.json')).map(s => `${api}/${s.slice(0, -5)}`);
            use_cases[domain] = use_cases[domain].concat(use_case);
        }
    }
    return use_cases;
}

export const isValidUseCase = async (domain: string, use_case: string): Promise<boolean> => {
    const all_use_cases = await getAllUseCases();
    if (Object.keys(all_use_cases).includes(domain)) {
        return (all_use_cases[domain].includes(use_case));
    } else {
        return false;
    }
}