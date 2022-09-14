export interface IUser {
    _id: string;
    name: string,
    username: string,
    avatarUrl: string,
    email: string,
    phone: string,
    birthday: string,
    gender: boolean | null
    isOnline: boolean,
}