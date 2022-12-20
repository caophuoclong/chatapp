import { Gender, IUser } from "~/interfaces/IUser";
import axiosClient from "../axiosClient";
import { AxiosResponse } from 'axios';
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
    static async updatePassword(data: {
        oldPassword: string,
        newPassword: string
    }){
        return await axiosClient.patch("/user/update-password", {
            ...data
        })
    }
    static updateAvatar(data: FormData, func: (e: ProgressEvent)=>void){
        return new Promise<{
            fileName: string
        }>(async(resolve, reject)=>{
            try{
                const response = await axiosClient.post("/user/update-avatar", data, {
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