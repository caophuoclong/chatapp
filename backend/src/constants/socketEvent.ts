export enum SocketEvent {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    ONLINE="online",
    OFFLINE="offline",
    LEAVE_CONVERSATION="leaveConversation",
    JOIN_CONVERSATION="joinConversation",
    REFRESH_TOKEN="refreshToken",
    INVALID_TOKEN="invalidToken",
    RECEIVE_MESSAGE="receiveMessage",
    SOMETHING_WENT_WRONG="somethingWentWrong",
    AUTHENTICATE="authenticate",
    RECALL_MESSAGE="recallMessage",
    MARK_RECEIVED_MESSAGE="markReceivedMessage",
    RECEIVED_MESSAGE="receivedMessage",
    NEW_MESSAGE="newMessage",
}

export abstract class FriendShipStatus{
    static ACCEPT = {
        code: "a",
        name: "Accept"
    }
    static PENDING = {
        code: "p",
        name: "Pending"
    }
    static BLOCK = {
        code: "b",
        name: "Block"
    }
}