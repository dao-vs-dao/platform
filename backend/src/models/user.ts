import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { Document, Model, Schema } from "mongoose";
import { IUser } from "../@types/user";
import { utils } from "ethers";

const userSchema = new Schema({
    address: { type: String, required: true, set: utils.getAddress, index: { unique: true } }
});

mongooseUniqueValidator(userSchema);

export type IUserDocument = IUser & Document;

interface IUserModelSchema extends Model<IUserDocument> {
    build(address: string): IUserDocument;
    findOneOrCreate(address: string): Promise<IUserDocument>;
}

userSchema.statics.build = (address: string): IUserDocument => new User({ address });
userSchema.statics.findOneOrCreate = async (address: string): Promise<IUserDocument> => {
    const user = await User.findOne({ address });
    return user ?? (await User.build(address).save());
};

export const User = mongoose.model<IUserDocument, IUserModelSchema>("User", userSchema);
