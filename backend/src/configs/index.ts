import * as dotenv from "dotenv";
dotenv.config();

export const databaseConfig  = ()=>({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

export const config = ()=>({
    jwtSecret: process.env.JWT_SECRET,
    pepper: process.env.PEPPER,
    expireTokenTime: process.env.EXPIRE_TOKEN_TIME,
})
export const redisConfig = ()=>({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
})