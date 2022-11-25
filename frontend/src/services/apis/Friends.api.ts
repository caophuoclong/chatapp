import axiosClient from "../axiosClient";

export default class FriendsApi{
    static async getFriends(){
        return axiosClient.get("/user/friends");
    }
    static async getFriendById(_id: string){
        return axiosClient.get("/user/friends/" + _id);
    }
    static async getUserByUsername(username: string){
        return axiosClient.get("/user/friend/username", {
            params: {
                username
            }
        })
    }
    static async addFriend(_id: string){
        return axiosClient.post("/user/friends/add", {
        },{
            params: {
                _id
            }
        })
    }
    static async handleAccept(friendShipId: string){
        return axiosClient.post("/user/friends/accept",{},{
            params: {
                _id: friendShipId
            }
        })

    }
    static async handleReject(friendShipId: string){
        return axiosClient.post("/user/friends/reject",{},{
            params: {
                _id: friendShipId
            }
        })

    }
    static async checkOnline(listId: Array<string>){
        return axiosClient.post("/user/friends/checkOnline",
            
        listId)
    }
}