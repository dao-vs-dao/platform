import { backendUrl } from "./backend-url-fetcher";

export const setThreadAsReadInBackend = async (thread: string): Promise<void> => {
    const url = `${backendUrl}/messaging/set-read/${thread}`;
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include"
    };

    await fetch(url, requestOptions as any);
};
