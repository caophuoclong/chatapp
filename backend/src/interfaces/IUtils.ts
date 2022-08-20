export interface IUtils{
    hashPassword(password: string): Promise<{
        salt: string,
        hashedPassowrd: string;
    }>;
    verify(password: string, salt: string, hashedPassword: string): Promise<boolean>;
}
export const IUtils1 = Symbol("IUtils");