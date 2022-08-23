import axiosClient from "../axiosClient";

export default class FriendsApi{
    static async getFriends(){
        return axiosClient.get("/user/friends");
    }
}