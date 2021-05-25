import axios from "axios";
import { Platform } from "../db/models/Platform.model";
import { getSettingValues } from "./networkSettings";

function combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
};

const getErrorFromResponse = (error: any) => {
    if (error.response) {
        if (error.response.data) {
            return { status: "error", message: error.response.data };
        }
    }
    return { status: "error", message: error.message };
};

export const createNewPlatform = async (body: Platform) => {
    const platform = new Platform(body);
    const saved_item = await platform.save();
    return saved_item;
}

export const getAllPlatforms = async () => {
    const results = Platform.findAll();
    return results;
}

export const getAllBAPs = async () => {
    const results = Platform.findAll({ where: { platform_type: "BAP", active: true } });
    return results;
}

export const getAllBPPs = async () => {
    const results = Platform.findAll({ where: { platform_type: "BPP", active: true } });
    return results;
}

export const getAllMockBPPs = async () => {
    const results = Platform.findAll({ where: { platform_type: "BPP", active: true, is_mock: true } });
    return results;
}

export const getAllMockPlatforms = async () => {
    const results = Platform.findAll({ where: { active: true, is_mock: true } });
    return results;
}

export const triggerSync = async (platforms: Platform[]) => {
    const network_settings = await getSettingValues();
    const promises = [];
    for (let platform of platforms) {
        const data: { [key: string]: any } = {
            bpp_id: platform.platform_name
        }
        if(platform.platform_type === "BPP") {
            data.bpp_uri = platform.platform_endpoint;
        } else {
            data.bap_uri = platform.platform_endpoint;
        }
        for (let key of Object.keys(network_settings)) {
            data[key] = network_settings[key];
        }
        promises.push(setPlatformSettings(platform, data));
    }
    const results = await Promise.allSettled(promises);
    return results;
}

export const updatePlatform = async (body: Platform) => {
    try {
        const record = await Platform.update(body, { where: { id: body.id } });
        if (record[0] === 0) {
            return false;
        }
        return true;
    } catch (error) {
        throw (error);
    }
}

export const deletePlatform = async (body: Platform) => {
    try {
        const record = await Platform.destroy({ where: { id: body.id } });
        if (record === 0) {
            return false;
        }
        return true;
    } catch (error) {
        throw (error);
    }
}

export const setPlatformSettings = async (platform: Platform, data: any) => {
    const url = platform.platform_endpoint;
    if (data?.delay) {
        data.delay = parseInt(data.delay);
    }
    try {
        const response = await axios({
            method: "post",
            url: combineURLs(url, '/admin/settings'),
            data
        });
        return { platform, status: "complete", data: response.data };
    } catch (error) {
        return { platform, ...getErrorFromResponse(error) };
    }
};