export interface IMessage {
    id: number;
    to: string;
    from: string;
    message: string;
    date: string;
    read: boolean;
}
