import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {IUtils} from "~/interfaces/IUtils";
import { randomBytes, scrypt } from "crypto"
import {promisify} from "util"
@Injectable()
export default class Utils implements IUtils{
    constructor(
        private readonly configService: ConfigService
    ){}
    async hashPassword(password: string): Promise<{
        salt: string,
        hashedPassowrd: string;
    }>{
        const salt = randomBytes(16).toString("hex");
        const encrypt = promisify(scrypt);
        const hashedPassowrd = await encrypt(password, salt, 64) as Buffer;
        return {
            salt: salt,
            hashedPassowrd: hashedPassowrd.toString("hex")
        };
    }
    async verify(password: string, salt: string, hashedPassword: string): Promise<boolean>{
        const encrypt = promisify(scrypt);
        const hashedPassowrd = await encrypt(password, salt, 64) as Buffer;
        return hashedPassowrd.toString("hex") === hashedPassword;
    }

}
