import { expect } from "chai";
import itParam from "mocha-param";
import { corsOptions } from "../cors-whitelisting";

describe("CorsWhitelisting", () => {
    const allowedOrigins = new Set(["foo.com", "bar.com"]);

    itParam(
        "behaves as expected: ${value.origin}",
        [
            { origin: undefined, expectedError: null, expectedAllow: true },
            { origin: "foo.com", expectedError: null, expectedAllow: true },
            { origin: "bar.com", expectedError: null, expectedAllow: true },
            {
                origin: "baz.net",
                expectedError: "Not allowed by cors. Origin: baz.net",
                expectedAllow: false
            }
        ],
        async ({ origin, expectedError, expectedAllow }: any) => {
            let error: string | null = null;
            let allow: boolean | undefined;
            const callback = (_error: any, _allow?: boolean) => {
                error = _error;
                allow = _allow;
            };

            const options = corsOptions(allowedOrigins);
            options.origin(origin, callback);

            expect(error).to.equal(expectedError);
            expect(allow).to.equal(expectedAllow);
        }
    );
});
