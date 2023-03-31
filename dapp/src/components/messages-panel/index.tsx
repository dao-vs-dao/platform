import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { IMessage } from "../../@types/i-message";
import { compactAddress } from "../../data/compact-address";

import { wssBackendUrl } from "../../services/backend-url-fetcher";
import { setThreadAsReadInBackend } from "../../services/messaging";
import { closeMessagingModal, deleteMessages, openMessagingModal, pushMessages, setThreadAsRead, toggleMessagingModal } from "../../state/slices/messaging-slice";
import { RootState } from "../../state/store";
import { errorToast } from "../toaster";
import "./styles.css";

export const MessagesPanel = () => {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.messaging.isModalOpen);
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    const ws: React.MutableRefObject<null | WebSocket> = useRef(null);

    const connectSocket = () => {
        if (ws.current !== null) {
            console.warn("Trying to reconnect with open socket. Closing old one.");
            ws.current.close();
            ws.current = null;
        }

        // if user is not authenticated, we should NOT establish a connection
        if (!currentPlayer) {
            ws.current = null;
            return;
        }

        const socket = new WebSocket(wssBackendUrl);
        socket.onopen = () => console.debug("Messaging socket opened");
        socket.onclose = () => {
            dispatch(deleteMessages());
            console.debug("Messaging socket closed, trying to reconnect...");
            connectSocket();
        };
        socket.onmessage = (event) => {
            const messages: IMessage[] = JSON.parse(event.data);
            dispatch(pushMessages({ player: currentPlayer.userAddress, messages }));
        };
        ws.current = socket;
    };

    useEffect(() => {
        dispatch(deleteMessages());
        connectSocket();
        return () => {
            ws.current?.close();
        };
    }, [currentPlayer?.userAddress]);

    return <>
        <ClosedMessagesPanel />
        {isModalOpen ? <OpenMessagesPanel ws={ws} /> : null}
    </>;
};

const ClosedMessagesPanel = () => {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.messaging.isModalOpen);
    const unread = useSelector((state: RootState) => state.messaging.unread);
    const countUnread = Object.values(unread).reduce((prev, next) => prev + next, 0);

    const openPanel = () => dispatch(toggleMessagingModal());

    return <div
        className={`messages-panel-bt ${isModalOpen ? "messages-panel-bt--pressed" : ""}`}
        onClick={openPanel}>
        <div className="messages-panel-bt__icon" />
        {countUnread > 0 ? <div className="messages-panel-bt__count">{countUnread}</div> : null}
    </div>;
};

const OpenMessagesPanel = ({ ws }: { ws: React.MutableRefObject<null | WebSocket>; }) => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const isModalOpen = useSelector((state: RootState) => state.messaging.isModalOpen);
    const chat = useSelector((state: RootState) => state.messaging.chat);
    const unread = useSelector((state: RootState) => state.messaging.unread);
    const selected = useSelector((state: RootState) => state.messaging.selectedChat);
    const ref: MutableRefObject<any> = useRef(null);
    const [text, setText] = useState<string>("");

    const hasMessages = Object.keys(chat).length > 0;
    const closePanel = () => dispatch(closeMessagingModal());
    const setSelected = (address?: string) => dispatch(openMessagingModal({ otherPlayer: address }));

    const sendMessage = () => {
        const trimmed = text.trim();
        if (!trimmed || !selected || !address || !ws.current) {
            errorToast("Something went wrong 🤷");
            return;
        }

        // send message through the socket.
        // It will be pushed to the list once echoed.
        const message = {
            from: address,
            to: selected,
            read: false,
            message: trimmed
        };
        ws.current.send(JSON.stringify(message));
        setText("");
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isModalOpen && ref.current
                && !event.target?.className?.includes?.("messages-panel")
                && !event.target?.className?.includes?.("cell-stats__button")
                && !ref.current.contains(event.target)) {
                closePanel();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        document.getElementById("id-msg-textarea")?.focus();
        const chatroom = document.getElementById("id-chatroom-messages") as HTMLDivElement;
        if (chatroom) chatroom.scrollTop = chatroom.scrollHeight;
        if (selected) {
            dispatch(setThreadAsRead({ thread: selected }));
            setThreadAsReadInBackend(selected);
        }

    }, [selected]);

    useEffect(() => {
        // scroll to the bottom each time new messages are loaded
        const chatroom = document.getElementById("id-chatroom-messages") as HTMLDivElement;
        if (chatroom) chatroom.scrollTop = chatroom.scrollHeight;
        if (selected) {
            dispatch(setThreadAsRead({ thread: selected }));
            setThreadAsReadInBackend(selected);
        }

    }, [chat[selected ?? ""]]);

    return <div className="messages-panel" ref={ref}>
        <div className="messages-panel__close" onClick={closePanel} />
        <div className="messages-panel__title">Messages</div>
        <div className="messages-panel__description">
            You can only message your direct neighbors and messages will be pruned after
            48 hours.
            <br /><br />
            Rules:
            <br />
            *Be nice!
            <br />
            *Messages are NOT encrypted
            <br />
            *Messages are rate limited (200/48h)
        </div>

        {/* List of active chats */}
        <div className="messages-panel__chat-list">
            <div className="messages-panel__chat-list-title">Active Chats</div>

            {!hasMessages
                ? <div className="messages-panel__no-msg-text">
                    No messages. It's time to meet your neighbors!
                </div>
                : <div className="messages-panel__threads">
                    {Object.keys(chat).map(otherUserAddress =>
                        <div key={otherUserAddress}
                            className={`msg-header ${selected === otherUserAddress ? "msg-header--selected" : ""}`}
                            onClick={() => {
                                const nextSelected = selected === otherUserAddress ? undefined : otherUserAddress;
                                setSelected(nextSelected);
                                setText("");
                                document.getElementById("id-msg-textarea")?.focus();
                            }}>
                            <div className="msg-header__address">{compactAddress(otherUserAddress)}</div>
                            {
                                unread[otherUserAddress] > 0
                                    ? <div className="msg-header__unread">{unread[otherUserAddress]}</div>
                                    : null
                            }
                        </div>
                    )}
                </div>
            }
        </div>

        {/* Chatroom */}
        {!selected ? null :
            <div className="chatroom">
                <div className="chatroom__messages" id="id-chatroom-messages">
                    {selected
                        ? (chat[selected] ?? []).map((msg, i) =>
                            <Message
                                key={`${msg.date}-${i}`}
                                message={msg}
                                currentUser={address!}
                            />
                        )
                        : null
                    }
                </div>
                <div className="chatroom__input-area">
                    <textarea
                        id="id-msg-textarea"
                        disabled={!selected}
                        className="chatroom__input"
                        maxLength={180}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        disabled={!selected || text.trim().length < 3}
                        className="chatroom__input-bt"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        }
    </div>;
};

const Message = ({ message, currentUser }: { message: IMessage, currentUser: string; }) => (
    <div className={`message ${message.from !== currentUser ? "message--received" : ""}`}>
        <div className="message__text">{message.message}</div>
        <div className="message__date">{new Date(message.date).toLocaleString()}</div>
    </div>
);
