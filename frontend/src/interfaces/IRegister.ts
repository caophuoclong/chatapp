interface IRegisterRequest{
    username: string;
    password: string;
    email: string;
    name: string;
    confirmPassword: string;

}
interface IRegisterResponse{

}
export type {IRegisterRequest, IRegisterResponse};