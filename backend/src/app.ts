import express from "express";
import ExpressWs from "express-ws";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import dotenv from "dotenv";

import { corsOptions } from "./middlewares/cors-whitelisting";
import { healthRouter } from "./routes/health-router";
import { authRouter } from "./routes/authentication";
import { isAuthenticatedWs } from "./middlewares/authentication-ws";
import { authenticatedMessagesWs } from "./routes-ws";

dotenv.config();
const isProduction = !process.env.FRONTEND_URL!.includes("localhost");

export const app = ExpressWs(express()).app;

const corsWhitelist: Set<string> = new Set([process.env.FRONTEND_URL!]);
app.use(cors(corsOptions(corsWhitelist) as any));
app.use(cookieParser());
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_CONN_STRING! }),
        cookie: isProduction ? { domain: "daovsdao.xyz" } : {}
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(healthRouter);
app.use("/api/auth", authRouter);
app.ws("/", isAuthenticatedWs, authenticatedMessagesWs);
