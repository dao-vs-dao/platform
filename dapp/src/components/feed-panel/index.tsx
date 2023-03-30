import React, { MutableRefObject, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { pyramidDistance } from "../../@types/i-coords";
import { INews } from "../../@types/i-feed";
import { IPlayer } from "../../@types/i-player";

import { closeFeedModal, setNewsAsRead, toggleFeedModal } from "../../state/slices/feed-slice";
import { PlayersDict } from "../../state/slices/game-slice";
import { RootState } from "../../state/store";
import { Tooltip, TooltipSize } from "../tooltip";
import { DVDEventListener } from "./dvd-event-listeners";
import { SCEventListener } from "./sc-event-listeners";
import "./styles.css";

export const FeedPanel = () => {
    const isModalOpen = useSelector((state: RootState) => state.newsFeed.isModalOpen);

    return <>
        <DVDEventListener />
        <SCEventListener />
        <ClosedFeedPanel />
        {isModalOpen ? <OpenFeedPanel /> : null}
    </>;
};

const ClosedFeedPanel = () => {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.newsFeed.isModalOpen);
    const unread = useSelector((state: RootState) => state.newsFeed.unread);

    const openPanel = () => dispatch(toggleFeedModal());

    return <div
        className={`news-feed-panel-bt ${isModalOpen ? "news-feed-panel-bt--pressed" : ""}`}
        onClick={openPanel}>
        <div className="news-feed-panel-bt__icon" />
        {unread > 0 ? <div className="news-feed-panel-bt__count">{unread}</div> : null}
    </div>;
};

const OpenFeedPanel = () => {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.newsFeed.isModalOpen);
    const feed = useSelector((state: RootState) => state.newsFeed.feed);
    const ref: MutableRefObject<any> = useRef(null);

    const closePanel = () => dispatch(closeFeedModal());

    useEffect(() => {
        dispatch(setNewsAsRead({}));

        const handleClickOutside = (event: any) => {
            if (isModalOpen && ref.current
                && !event.target?.className?.includes?.("news-feed-panel")
                && !ref.current.contains(event.target)) {
                closePanel();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return <div className="news-feed-panel" ref={ref}>
        <div className="news-feed-panel__close" onClick={closePanel} />
        <div className="news-feed-panel__title">News Feed</div>
        <div className="news-feed-panel__description">
            This section shows all recent game events in real-time,
            highlighting those closer to you while displaying more
            modestly events that took place in faraway lands.
        </div>

        {/* List of active chats */}
        <div className="news-feed-panel__chat-list">
            <div className="news-feed-panel__chat-list-title">Latest News:</div>

            {feed.length === 0
                ? <div className="news-feed-panel__no-msg-text">
                    No news for now. If something interesting happens, we'll let you know!
                </div>
                : <div className="news-feed-panel__news-list">
                    {feed.map((news, i) => <PieceOfNews news={news} key={news.id} />)}
                </div>
            }
        </div>
    </div>;
};

const PieceOfNews = ({ news }: { news: INews; }) => {
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const playersByAddress = useSelector((state: RootState) => state.game.playersByAddress);

    const distance = calculateDistance(news.epicenter, currentPlayer, playersByAddress) ?? 1000;
    const proximity = getProximity(distance);
    const proximityIcon = <div className="news__proximity" style={{ backgroundColor: getDistanceColor(distance) }} />;
    return <div
        className={`news ${news.unread ? "news--unread" : ""}`}
    >
        <div className="news__content">
            <Tooltip iconComponent={proximityIcon} size={TooltipSize.Small}>
                {getProximityMessage(proximity)}
            </Tooltip>
            <div className="news__text">{news.text}</div>
        </div>
        {news.timestamp ? <div className="news__date">{new Date(news.timestamp).toLocaleString()}</div> : null}
    </div>;
};

const calculateDistance = (
    epicenter: string | undefined,
    currentPlayer: IPlayer | null | undefined,
    playersByAddress: PlayersDict): number | undefined => {
    if (!epicenter || !currentPlayer || !playersByAddress[epicenter]) return undefined;
    return pyramidDistance(currentPlayer.coords, playersByAddress[epicenter].coords);
};

enum Proximity { You, Neighborhood, Close, Around, QuiteFar, NoIdeaWhere }
const getProximity = (distance?: number): Proximity =>
    distance === undefined ? Proximity.NoIdeaWhere
        : distance > 500 ? Proximity.QuiteFar
            : distance > 320 ? Proximity.Around
                : distance > 100 ? Proximity.Close
                    : distance > 0 ? Proximity.Neighborhood
                        : Proximity.You;

const getProximityMessage = (proximity: Proximity) => {
    switch (proximity) {
        case Proximity.You: return "You're on the news!";
        case Proximity.Neighborhood: return "Very close to you!";
        case Proximity.Close: return "In your visible area";
        case Proximity.Around: return "Just outside your visible area";
        case Proximity.QuiteFar: return "Very far from you";
        case Proximity.NoIdeaWhere: return "In a far away land";
        default: return "Wait.. where?";
    }
};

const getDistanceColor = (distance: number) => {
    if (distance === 0) return "#FFFFFF";
    if (distance >= 1000) return "#14746F";

    // const SCALE_START = "#6A040F";
    // const SCALE_END = "#14746F";
    const red1: number = 106; // parseInt(SCALE_START.substring(1, 3), 16);
    const green1: number = 4; // parseInt(SCALE_START.substring(3, 5), 16);
    const blue1: number = 15; // parseInt(SCALE_START.substring(5, 7), 16);
    const red2: number = 20; // parseInt(SCALE_END.substring(1, 3), 16);
    const green2: number = 116; // parseInt(SCALE_END.substring(3, 5), 16);
    const blue2: number = 111; // parseInt(SCALE_END.substring(5, 7), 16);
    const red: number = Math.round(red1 + (red2 - red1) * distance / 1000);
    const green: number = Math.round(green1 + (green2 - green1) * distance / 1000);
    const blue: number = Math.round(blue1 + (blue2 - blue1) * distance / 1000);
    return "#" + red.toString(16).padStart(2, "0") + green.toString(16).padStart(2, "0") + blue.toString(16).padStart(2, "0");
};
