
interface ILoginRequest {
    username: string;
    password: string;

}
interface ILoginResponse {
    access_token: string;
    expiredTime: string;
}

export type { ILoginRequest, ILoginResponse };