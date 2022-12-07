import { IRegisterRequest } from "~/interfaces/IRegister";
import axiosClient from "../axiosClient";
import { ILoginRequest, ILoginResponse } from '~/interfaces/ILogin';
import { Http2ServerResponse } from "http2";

export default class Auth{
    static async login({username,password}: ILoginRequest){
        try{
            const response = await axiosClient.post<ILoginResponse>("/auth/login", {
                username,
                password
            })
            return response;
        }catch(error: any){
            throw new Error(error.response.data.message)
        }
    }
    static async register(data:Omit<IRegisterRequest, "confirmPassword">){
        return axiosClient.post("/auth/register", data)
    }
    static async  refreshToken(){
        try{
            const response = await axiosClient.get("/auth/refresh-token");
            return response;
        }catch(error: any){
            if(error.response.status === 404){
                window.localStorage.clear();
                window.location.href = "/login";
            }
            if(error.response.status === 401){
                alert("Token expired. Please login again");
                window.localStorage.clear();
                window.location.href = "/login";
            }
            if(error.response.status === 400){
                alert("Something wrong!");
                window.localStorage.clear();
                window.location.href ="/login";
            }
        }

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
    static async getSokcetToken(){
        return await axiosClient.get("/auth/socket")
    }
}