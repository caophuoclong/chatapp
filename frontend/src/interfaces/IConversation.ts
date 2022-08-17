export default interface IConversation{
    _id: string,
    name: string;
    avatarUrl: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadMessageCount: number;
}