import * as dotenv from "dotenv";
dotenv.config();

export const databaseConfig  = ()=>({
    database_host: process.env.DB_HOST,
    database_user: process.env.DB_USER,
    database_password: process.env.DB_PASSWORD,
    database_database: process.env.DB_NAME,
    database_port: process.env.DB_PORT,
})

export const config = ()=>({
    jwtSecret: process.env.JWT_SECRET,
    pepper: process.env.PEPPER,
    expiredAccessToken: process.env.EXPIRED_ACCESS_TOKEN,
    expiredRefreshToken: process.env.EXPIRED_REFRESH_TOKEN
})
export const redisConfig = ()=>({
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_password: process.env.REDIS_PASSWORD,
})
export const mailConfig = ()=>({
    mail_host: process.env.MAIL_HOST,
    mail_port: process.env.MAIL_PORT,
    mail_user: process.env.MAIL_USER,
    mail_password: process.env.MAIL_PASSWORD,
    mail_from: process.env.MAIL_FROM,
})
export const appConfig = ()=>({
    client_host: process.env.CLIENT_HOST,
})