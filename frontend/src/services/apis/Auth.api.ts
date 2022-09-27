import { IRegisterRequest } from "~/interfaces/IRegister";
import axiosClient from "../axiosClient";
import { ILoginRequest, ILoginResponse } from '~/interfaces/ILogin';

export default class Auth{
    static async login({username,password}: ILoginRequest){
        const response = await axiosClient.post<ILoginResponse>("/auth/login", {
            username,
            password
        })
        
        return response;
    }
    static async register({
        username,
        password,
        email,
        name,
    }:IRegisterRequest){
        return axiosClient.post("/auth/register", {
            username,
            password,
            email,
            name,
        })
    }
    static refreshToken(){
        return axiosClient.get("/auth/refresh-token");
    }
    static async forgotPassword(email: string){
        console.log(email);
        return await axiosClient.post("/auth/create_forgot_token", {
            email
        })
    }
    static async resetPassword(token: string, newPassword: string){
        return await axiosClient.post(`/auth/createNewPassword/${token}`,{
            newPassword
        })
    }
}