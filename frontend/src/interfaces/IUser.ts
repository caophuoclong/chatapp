export interface IUser {
    _id: string;
    name: "",
    username: "",
    avatarUrl: "",
    email: "",
    phone: "",
    birthday: {
        day: number,
        month: number,
        year: number
    },
}