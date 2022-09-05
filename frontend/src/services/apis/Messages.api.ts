import { IMessage } from "~/interfaces/IMessage";
import axiosClient from "../axiosClient";

export default class MessagesApi{
    static async getMessages(conversationId: string, skip: number = 0){
        const response = await axiosClient.get("/message/conversation/"+conversationId,{
            params:{
                limit: 20,
                skip: skip,
            }
        });
        return response;
    }
    static async sendMessage(message: {
        destination: string,
        content: string,
        attachment?: string[],
        parentMessage: string | null,
    }){
        const response = await axiosClient.post<{
            data: IMessage,            
        }>("/message",message)
        return response;
    }
}