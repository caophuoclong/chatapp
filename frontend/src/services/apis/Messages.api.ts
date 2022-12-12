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
    static async getMessageImage(conversationId: string){
        return await axiosClient.get("/message/images", {
            params: {
                conversationId
            }
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
    static async sendFileMessage(data: FormData, func: (e: ProgressEvent)=>void){
        return new Promise<{
            message: IMessage,
            tempId: string
        }>(async(resolve, reject)=>{
            try{
                const response = await axiosClient.post("/message/file", data, {
                    onUploadProgress: func
                }
                );
                resolve(response.data);
            }catch(error){
                reject(error);
            }
        })
    }
}