import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {

    interface Session extends DefaultSession {
        user: {
            id: string
            accessToken?: string
            refreshToken?: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        accessToken: string
        refreshToken: string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        userId: string
        accessToken: string
        refreshToken: string
        accessTokenExpires?: number
    }
}

export {};