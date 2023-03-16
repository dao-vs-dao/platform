import { NextFunction, Request, Response } from "express";

/**
 * Middleware checking whether the request is made from an authenticated user
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) =>
    isAuthenticatedMockable(req, res, next);

/**
 * logic for `isAuthenticated`
 * @dev by placing the logic in a separate function, it is much easier to prevent
 * express from establishing a reference to the original code before it is mocked
 */
export const isAuthenticatedMockable = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?._id) {
        return res.sendStatus(403);
    }
    next();
};
