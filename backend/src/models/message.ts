import mongoose from "mongoose";
import { IMessage } from "../@types/message";
import { Document, Model, Schema } from "mongoose";
import { getAddress } from "ethers/lib/utils";

const messagesSchema = new Schema({
    to: { type: String, required: true, set: getAddress, index: true },
    from: { type: String, required: true, set: getAddress, index: true },
    message: { type: String, required: true, index: true },
    date: { type: Date, required: false, default: () => new Date() },
    read: { type: Boolean, required: false, default: false }
});

export type IMessageDocument = IMessage & Document;

interface IMessageModelSchema extends Model<IMessageDocument> {
    build(message: IMessage): IMessageDocument;
}

messagesSchema.statics.build = (message: IMessage): IMessageDocument => new Message(message);

export const Message = mongoose.model<IMessageDocument, IMessageModelSchema>(
    "Message",
    messagesSchema
);
