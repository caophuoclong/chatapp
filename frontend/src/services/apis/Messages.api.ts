import { IMessage } from "~/interfaces/IMessage";
import axiosClient from "../axiosClient";

export default class MessagesApi{
    static async markReceivedMessage(message: Omit<IMessage, "destination"> & {destination: {_id: string}}){
        const response = await axiosClient.post("/message/received",{
            message
        })
        return response;
    }
    static async getMessages(conversationId: string, skip: number = 0){
        const response = await axiosClient.get("/message/conversation/"+conversationId,{
            params:{
                limit: 20,
                skip: skip,
            }
        });
        return response;
    }
    static async recallMessage(messageId: string){
        return await axiosClient.patch("/message/recallmessage",{
            messageId
        })
    }
    static async sendMessage(message: IMessage & {
        updateAt: number
    }){
        const response = await axiosClient.post<{
            message: IMessage,            
            tempId: string
        }>("/message",message)
        return response;
    }
}