import { Request, response, Response } from "express";


type NullableObject = Object | null;
type Callback = (err: NullableObject, result: NullableObject) => Object
const listeners: Map<string, Callback> = new Map();

export function publish(result: Request) {
    const messageId = result.context.messageId;
    if (listeners.get(messageId)) {
        listeners.get(messageId)(null, result);
        listeners.delete(messageId);
    }
}

export function subscribe(messageId: string, callback: Callback, timeout?: number) {
    listeners.set(messageId, callback);
    expire(messageId, timeout ? timeout: 10000);
}

function expire(messageId: string, time: number) {
    setTimeout(() => {
        const listener = listeners.get(messageId);
        if (listener) {
            listener("Timed out", null);
            listeners.delete(messageId);
        }
    }, time);
}
