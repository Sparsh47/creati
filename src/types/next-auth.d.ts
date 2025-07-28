import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User {
        accessToken: string
        refreshToken: string
    }

    interface Session extends DefaultSession {
        user: {
            accessToken: string
            refreshToken: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        accessToken: string
        refreshToken: string
    }
}
