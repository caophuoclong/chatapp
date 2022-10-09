interface IRegisterRequest{
    username: string;
    password: string;
    email: string;
    name: string;
    confirmPassword: string;
    lan?: "en" | "vn";

}
interface IRegisterResponse{

}
export type {IRegisterRequest, IRegisterResponse};