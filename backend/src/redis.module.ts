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
            useFactory: async(configService: ConfigService)=>{
                let client;                
                if(configService.get("node_env") === "production"){
                    client  = createClient({
                        url: "redis://"+configService.get("redis_host")+":"+configService.get("redis_port"),
                        password: configService.get("redis_password")
                    })
                }else{
                    client = createClient({
                    socket: {
                        host: configService.get("redis_host"),
                        port: configService.get("redis_port"),
                    },
                    password: configService.get("redis_password"),
                })
                }
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