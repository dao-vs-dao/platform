import mongoose from "mongoose";
import { IUserDocument } from "./src/models/user";

declare global {
    namespace Express {
        interface User extends IUserDocument {}
    }
}
