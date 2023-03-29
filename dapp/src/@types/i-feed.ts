export interface INews {
    id: string;
    timestamp?: number;
    block: number;
    text: string;
    epicenter?: string;
    unread: boolean;
}
