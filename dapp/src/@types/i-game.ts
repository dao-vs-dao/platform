import { IPlayer } from "./i-player";

export interface IGame {
    lands: string[][][];
    players: IPlayer[];
}
