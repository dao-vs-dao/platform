import { NextFunction, Request } from "express";
import * as ws from "ws";

/**
 * Middleware checking whether the request is made from an authenticated user
 * @dev to apply to WebSocket connections
 */
export const isAuthenticatedWs = (ws: ws, req: Request, next: NextFunction) =>
    isAuthenticatedMockableWs(ws, req, next);

/**
 * logic for `isAuthenticatedWs`
 * @dev by placing the logic in a separate function, it is much easier to prevent
 * express from establishing a reference to the original code before it is mocked
 */
export const isAuthenticatedMockableWs = (ws: ws, req: Request, next: NextFunction) => {
    if (!req.user?._id) {
        ws.send(`Not authenticated. The WSS connection will be closed`);
        ws.close();
        return;
    }

    next();
};
