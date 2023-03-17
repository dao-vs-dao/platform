import { IUser } from "../@types/i-user";
import { backendUrl } from "./backend-url-fetcher";

export const getMessageToSign = async (address: string): Promise<string> => {
    const url = `${backendUrl}/auth/message-to-sign/${address}`;
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include"
    };

    const res = await fetch(url, requestOptions as any);
    const message = (await res.json()).message;
    return message;
};

export const login = async (signedMessage: string, address: string): Promise<Response> => {
    const url = `${backendUrl}/auth/login`;
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ signedMessage, userAddress: address })
    };

    return await fetch(url, requestOptions as any);
};

export const getLoggedUser = async (): Promise<IUser | null> => {
    const url = `${backendUrl}/auth/logged-user`;
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include"
    };

    const res = await fetch(url, requestOptions as any);
    const user =  await res.json();
    return "address" in user ? user : null;
};

export const logout = async (): Promise<void> => {
    const url = `${backendUrl}/auth/logout`;
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include"
    };

    await fetch(url, requestOptions as any);
};
