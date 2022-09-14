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
    static async refreshToken(){
        return await axiosClient.get("/auth/refresh-token");
    }
}