export enum Gender{
    MALE="male",
    FEMALE="female",
    OTHER="other"
}
export interface IUser {
    _id: string;
    name: string,
    username: string,
    avatarUrl: string,
    email: string,
    phone: string,
    birthday: string,
    gender: Gender,
    isOnline: boolean,
    lastOnline: number
}