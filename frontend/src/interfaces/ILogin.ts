
interface ILoginRequest {
    username: string;
    password: string;

}
interface ILoginResponse {
    token: string;
    expired_time: string;
}

export type { ILoginRequest, ILoginResponse };