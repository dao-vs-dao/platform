import { expect } from "chai";
import { isAuthenticated } from "../authentication";
import itParam from "mocha-param";

describe("Authentication Middleware", () => {
    it("detects authenticated requests", async () => {
        const request = { user: { _id: "YOLO" } };
        let pass = false;
        const next = () => (pass = true);

        isAuthenticated(request as any, {} as any, next);
        expect(pass).to.equal(true);
    });

    it("stops un-authenticated requests", async () => {
        const request = { user: {} };
        let status = 0;
        const response = {
            sendStatus: (_status: number) => {
                status = _status;
            }
        };
        const next = () => {
            throw new Error("this should not happen");
        };

        isAuthenticated(request as any, response as any, next);
        expect(status).to.equal(403);
    });
});
