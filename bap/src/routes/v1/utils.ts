import { Request } from "express";
import axios from "axios";
import { set } from "lodash";
import { v4 as uuidv4 } from "uuid";
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
}

function combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export const wait = async (delay_ms: number) => {
    if (delay_ms !== 0) {
        await delay(delay_ms);
    }
}

export const getMockResponse = async (domain: string, use_case: string, api: string) => {
    const use_case_api = use_case.split('/')[0];
    const file_path = use_case_api !== api ? `generic_jsons/${api}` : `${domain}/${use_case}`
    const req_data = await fs.readFile(`./../mock_json_files/${file_path}.json`, 'utf-8');
    const req_obj = JSON.parse(req_data);
    req_obj.context.domain = domain;
    req_obj.context.bap_uri = config.get('bap_uri');
    req_obj.context.bap_id = config.get('bap_id');
    req_obj.context.timestamp = new Date().toISOString();
    return req_obj;
}

export const addResultToApp = async (req: Request) => {
    let curr = req.app.get(req.body.context.transaction_id);
    if (curr === undefined || curr === null) {
        curr = [];
    }
    curr.push(req.body)
    req.app.set(req.body.context.transaction_id, curr);
}

export const getResultsFromApp = (req: Request, transaction_id: string) => {
    const result = req.app.get(transaction_id);
    req.app.set(transaction_id, null);
    return result;
}

export const initiateCall = async (req: Request, api: string) => {
    try {
        const domain = req.body.domain;
        const use_case = req.body.use_case;
        const bpp_uri = req.body.bpp_uri;
        const request = await getMockResponse(domain, use_case, api);
        request.context.transaction_id = req.body.transaction_id;
        const end_point = combineURLs(bpp_uri, `/${api}`);
        console.log(`${config.get('bap_id')} : ${request.context.transaction_id}  Sending ${api} to ${end_point}`);
        const res = await axios.post(end_point, request, { headers: { use_case } });
    } catch (error) {
        console.log(`${config.get('bap_id')} ERROR : `, error);
    }
};

export const initiateSearch = async (req: Request) => {
    try {
        const domain = req.body.domain;
        const use_case = req.body.use_case;
        const bpp_uri = req.body.bpp_uri;
        const bg_uri = config.get('bg_uri');
        const end_point = bpp_uri ? combineURLs(bpp_uri,'/search') : combineURLs(bg_uri,'/search');
        console.log(bpp_uri, end_point);
        const search_request = await getMockResponse(domain, use_case, 'search');
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key) && key !== "domain" && key !== "use_case" && key !== "ttl") {
                set(search_request, key, req.body[key]);
            }
        }
        search_request.context.transaction_id = uuidv4();
        console.log(`${config.get('bap_id')} : ${search_request.context.transaction_id}  Sending search to ${end_point}`);
        const res = await axios.post(end_point, search_request, { headers: { use_case } });
        return search_request.context.transaction_id;
    } catch (error) {
        console.log(`${config.get('bap_id')} ERROR : `, error);
    }
};

export const validateTriggerRequest = async (req: Request, api: string) => {
    const allowedApis = ["search", "select", "init", "confirm", "update", "status", "track", "cancel", "feedback", "support"];
    if (!allowedApis.includes(api)) {
        console.log(`${config.get('bap_id')} ERROR : Invalid api ${api}`);
        return ({ message: `Only the following apis are allowed to be triggered:${allowedApis.toString()}` });
    }
    const { domain, use_case, bpp_uri, transaction_id } = req.body
    if (domain === undefined || domain === "" || use_case === undefined || use_case === "") {
        console.log(`${config.get('bap_id')} ERROR : Invalid inputs domain and usecase required`);
        const all_use_cases = await getAllUseCases();
        return ({ message: `domain and use_case are required inputs`, supported_use_cases_and_domains: all_use_cases });
    }
    if (api !== 'search') {
        if (bpp_uri === undefined || bpp_uri === "") {
            console.log(`${config.get('bap_id')} ERROR : Invalid inputs bpp_uri required`);
            return ({ message: `bpp_uri is a required input` });
        }
        if (transaction_id === undefined || transaction_id === "") {
            console.log(`${config.get('bap_id')} ERROR : Invalid inputs transaction_id required`);
            return ({ message: `transaction_id is a required input` });
        }
    }
    const valid_use_case = await isValidUseCase(req.body.domain, req.body.use_case);
    if (!valid_use_case) {
        const use_cases = await getAllUseCases();
        console.log(`${config.get('bap_id')} ERROR : Invalid domain/use case`);
        return ({ message: "Invalid domain/use case. Please select a valid one", use_cases });
    }
    if (!use_case.split('/')[0].includes(api)) {
        return ({ message: `The specified use case (${use_case.split('/')[0]}) and triggered api (${api}) do not match` });
    }
    return ({ message: '' });
}