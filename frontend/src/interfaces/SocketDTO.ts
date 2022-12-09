import { IMessage } from './IMessage';
export interface MarkReceiveMessage {
    conversationId: string,
    messagesId: Array<string>,
}
