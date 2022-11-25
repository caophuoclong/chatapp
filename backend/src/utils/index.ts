import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {IUtils} from "~/interfaces/IUtils";
import { randomBytes, scrypt } from "crypto"
import {promisify} from "util"
import { User } from "~/user/entities/user.entity";
import * as jwt from "json-web-token";
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
    removeEmpyObject<T>(obj: T){
        for(const key in obj){
            if(obj[key] === null || obj[key] === undefined || (obj[key] as any).length < 1){
                delete obj[key];
            }
        }
        return obj;
    }
    hashToken(){
        return randomBytes(48).toString("hex");
    }
    randomToken(){
        return randomBytes(48).toString("hex");
    }

}
