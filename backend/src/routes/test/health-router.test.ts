import { connectToTestDb, closeTestDb, clearTestDb } from "../../test/test-db-handler";
import supertest from "supertest";
import { app } from "../../app";
import { expect } from "chai";

describe("GET /health", () => {
    before(async () => await connectToTestDb());
    afterEach(async () => await clearTestDb());
    after(async () => await closeTestDb());

    it("returns 200", async () => {
        const response = await supertest(app).get(`/health`);
        expect(response.status).to.equal(200);
    });
});
