import { NetworkSettings } from "../db/models/NetworkSettings.model";
import { network_settings_list } from "../config/config"

const createKeyValueArray = (settings: any) : keyValueSettings[] => {
    let result : keyValueSettings[] = []
    for (let key of Object.keys(settings)) {
        result.push({ setting: key, value: settings[key] })
    }
    return result;
}

type keyValueSettings = {
    "value": string,
    "setting": string
}

const createObjectFromArray = (settings: keyValueSettings[]) => {
    const result: { [key: string]: any } = {}
    for (let setting of settings) {
        result[setting.setting] = setting.value
    }
    return result;
}

export const getSettingValues = async () => {
    try {
        const result = []
        for(let setting of network_settings_list) {
            const found_settings = await NetworkSettings.findCreateFind({ where: { setting }, defaults: { value: "" } });
            result.push(found_settings[0])
        }
        return createObjectFromArray(result);
    } catch (error) {
        throw error;
    }
}

export const setSettingsValue = async (settings: any) => {
    let results = []
    for (let setting of createKeyValueArray(settings)) {
        try {
            const result = await NetworkSettings.upsert(setting);
            results.push(result[0])
        } catch (error) {
            results.push(error);
        }
    }
    return results;
}