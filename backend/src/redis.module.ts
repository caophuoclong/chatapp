import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {createClient} from "redis"
@Module({
    imports: [
        ConfigModule
    ],
    providers: [
        {
            provide: "REDIS_CLIENT",
            useFactory: async(option:{
                redis_host: string,
                redis_port: number,
                redis_password: string
            })=>{
                const client = createClient({
                    socket: {
                        host: option.redis_host,
                        port: option.redis_port,
                    },
                    password: option.redis_password,
                })
                await client.connect();
                return client;
            },
            inject: [ConfigService]
        }
    ],
    exports: [
        "REDIS_CLIENT"
    ],

}
)
export class RedisModule{}