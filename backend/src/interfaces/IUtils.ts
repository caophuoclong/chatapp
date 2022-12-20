export interface IUtils{
    hashPassword(password: string): Promise<{
        salt: string,
        hashedPassowrd: string;
    }>;
    verify(password: string, salt: string, hashedPassword: string): Promise<boolean>;
    hashToken(): string;
    randomToken(): string;
    updatePassword(password: string, salt: string): Promise<{
        hashedPassowrd: string;
    }>;
}
export const IUtils1 = Symbol("IUtils");