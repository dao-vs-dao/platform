import { expect } from "chai";
import Sinon from "sinon";
import { makeOTP } from "../OTP-maker";

describe("OTP-maker", () => {
    const userAddress = "0x25ace71c97b33cc4729cf772ae268934f7ab5fa1";

    afterEach(async () => {
        Sinon.restore();
    });

    it("returns predictable results", async () => {
        const now = Date.now();
        Sinon.stub(Date, "now").returns(now);

        const opts = [];
        for (let i = 0; i < 100; i++) opts.push(makeOTP(userAddress));

        expect(new Set(opts).size).to.equal(1);
    });

    it("returns the OTP of the previous time slot when the 'previous' flag is added", async () => {
        Sinon.stub(Date, "now").returns(1670680055000); // Sat Dec 10 2022 13:47:35 GMT+0000
        const prevOTP = makeOTP(userAddress);

        Sinon.restore();
        Sinon.stub(Date, "now").returns(1670680065000); // Sat Dec 10 2022 13:47:45 GMT+0000 (+10s)
        const currentOTP = makeOTP(userAddress);

        expect(prevOTP).to.not.equal(currentOTP);
        expect(prevOTP).to.equal(makeOTP(userAddress, true));
    });

    it("returns different OTPs using different addresses", async () => {
        const now = Date.now();
        Sinon.stub(Date, "now").returns(now);

        const user1OTP = makeOTP(userAddress);
        const user2OTP = makeOTP("0x6dea879e2eebf245ce11e8b24ecffd197d206aad");

        expect(user1OTP).to.not.equal(user2OTP);
    });
});
