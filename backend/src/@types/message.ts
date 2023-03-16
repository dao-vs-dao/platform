export interface IMessage {
    to: string;
    from: string;
    message: string;
    date: Date;
    read: boolean;
}
