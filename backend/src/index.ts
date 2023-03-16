import dotenv from "dotenv";
dotenv.config();

/**
 * Environment variables are checked here so we can freely instantiate app
 * in test without the need of giving a value for each variable.
 */
if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL was not set");
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET was not set");
if (!process.env.ENCRYPTION_SECRET) throw new Error("ENCRYPTION_SECRET was not set");
if (!process.env.MONGO_DB_CONN_STRING) throw new Error("MONGO_DB_CONN_STRING was not set");

if (!process.env.POLYGON_RPC) throw new Error("POLYGON_RPC was not set");
if (!process.env.MUMBAI_RPC) throw new Error("MUMBAI_RPC was not set");

import mongoose from "mongoose";
import { app } from "./app";

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_DB_CONN_STRING!).then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.debug({ message: `Started on port ${port}` });
    });
});
