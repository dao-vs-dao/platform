/**
 * If the origin is in `allowed`, we allow CORS in all responses.
 */
export const corsOptions = (allowed: Set<string>) => ({
    methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    origin: (origin: string | undefined, callback: (error: any, allow?: boolean) => void) => {
        if (!origin || allowed.has(origin)) {
            callback(null, true);
        } else {
            callback(`Not allowed by cors. Origin: ${origin}`, false);
        }
    },
    credentials: true
});
