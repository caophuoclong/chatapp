import { IUser } from "~/interfaces/IUser";
import axiosClient from "../axiosClient";

export default class UserApi{

    static async getMe(){
        return await axiosClient.get<IUser>("/user");
    }
}