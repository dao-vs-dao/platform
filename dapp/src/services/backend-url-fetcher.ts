// define backend URL depending on frontend URL
const isTest = typeof window === "undefined";
const isDev = !isTest && window.location.href.includes("localhost");

const LOCAL_BACKEND_URL = "http://localhost:5000/api";
const PROD_BACKEND_URL = "https://backend.daovsdao.xyz/api";

/** The backend API endpoint URL */
export const backendUrl = isTest || isDev ? LOCAL_BACKEND_URL : PROD_BACKEND_URL;

const LOCAL_BACKEND_WS = "ws://localhost:5000/";
const PROD_BACKEND_WS = "wss://backend.daovsdao.xyz/";

/** The backend WSS endpoint URL */
export const wssBackendUrl = isTest || isDev ? LOCAL_BACKEND_WS : PROD_BACKEND_WS;
