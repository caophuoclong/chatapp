import { Gender, IUser } from "~/interfaces/IUser";
import axiosClient from "../axiosClient";
export interface UpdateInfomationDTO{
    name: string,
    email: string,
    phone: string,
    birthday: string,
    avatarUrl: string,
    gender: Gender
}
export default class UserApi{

    static async getMe(){
        return await axiosClient.get<IUser>("/user");
    }
    static async updateInfoMation(data: Partial<UpdateInfomationDTO>){
        return await axiosClient.patch("/user/update-info", {
            ...data
        })
    }
}