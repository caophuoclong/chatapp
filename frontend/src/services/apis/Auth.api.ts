import { IRegisterRequest } from "~/interfaces/IRegister";
import axiosClient from "../axiosClient";
import { ILoginRequest, ILoginResponse } from '~/interfaces/ILogin';

export default class Auth{
    static async login({username,password}: ILoginRequest){
        try{

            const response = await axiosClient.post<ILoginResponse>("/auth/login", {
                username,
                password
            })
            console.log(response);
            return response;
        }catch(error: any){
            if(error.response.data.statusCode === 403 && error.response.data.message === "User not active"){
                throw new Error("NotActive")
            }
            throw error;
        }
    }
    static async register(data:Omit<IRegisterRequest, "confirmPassword">){
        return axiosClient.post("/auth/register", data)
    }
    static refreshToken(){
        return axiosClient.get("/auth/refresh-token");
    }
    static async forgotPassword(email: string, lan: "en" | "vn"){
        console.log(email);
        return await axiosClient.post("/auth/create_forgot_token", {
            email,
            lan
        })
    }
    static async resetPassword(token: string, newPassword: string){
        return await axiosClient.post(`/auth/createNewPassword/${token}`,{
            newPassword
        })
    }
    static async verifyAccount(token: string){
        return await axiosClient.post(`/auth/verifyAccount`,{
            token
        })
    }
}