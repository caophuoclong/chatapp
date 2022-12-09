import { Injectable } from '@nestjs/common';
import { SocketService, roomConversation } from '../socket/socket.service';
import { MessageService } from './message.service';
import { SocketEvent } from '../constants/socketEvent';
import { Message } from './entities/message.entity';
@Injectable()
export class MessageSocket {
  constructor(private readonly socketService: SocketService) {}
  /**
   * It takes an object with keys that are strings of the form `senderId_conversationId` and values
   * that are arrays of message ids. It then emits a `MARK_RECEIVED_MESSAGE` event to each sender with
   * the conversation id and the array of message ids
   * @param messagesGroupBySenderAndDestination - { [key: string]: [] }
   */
  async markReceivedMessage(messagesGroupBySenderAndDestination: { [key: string]: string[] }) {
    const keys = Object.keys(messagesGroupBySenderAndDestination);
    keys.forEach(async (Sender_Destination) => {
      const [senderId, conversationId] = Sender_Destination.split('_');
      const messagesId = messagesGroupBySenderAndDestination[Sender_Destination];
      await this.socketService.emitToUser(senderId, SocketEvent.MARK_RECEIVED_MESSAGE, {
        conversationId,
        messagesId,
      });
    });
  }
  async sendMessage(message: Omit<Message, "destination"> & {destination: string}) {
    const { destination } = message;
    this.socketService.emitToRoomExcludeSener(
      roomConversation(destination),
      SocketEvent.NEW_MESSAGE,
      message,
      message.sender._id,
    );
  }
  async recallMessage(message: Message){
    console.log("🚀 ~ file: message.socket.ts:36 ~ MessageSocket ~ recallMessage ~ message", message)
    const {destination, sender, _id} = message;
    this.socketService.emitToRoomExcludeSener(roomConversation(destination._id), SocketEvent.RECALL_MESSAGE,{
      messageId: _id,
      conversationId: destination._id
    }, sender._id)
  }
}
