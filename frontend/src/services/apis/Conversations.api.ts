import axiosClient from '../axiosClient';
export default class ConversationsApi{
    static async getConversation(){
        const response = await axiosClient.get("/user/conversations")
        return response;
    }
    static async createConversationByFriendShip(friendShipId: string){
        const response = await axiosClient.post("/conversation/create/direct",{
            friendShipId: friendShipId
        })
        return response;
    }
    static async createGroupConversation(name: string, participants: Array<string>, avatarUrl: string = "https://picsum.photos/200", visible: boolean = false){
        const response = await axiosClient.post("/conversation/create/group",{
            name,
            participants,
            avatarUrl,
            visible
        })
        return response;
    }
}
