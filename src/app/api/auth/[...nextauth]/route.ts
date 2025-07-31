import NextAuth, {AuthOptions} from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import axios from "axios";

const ACCESS_TOKEN_TTL = 15 * 60 * 1000;

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {strategy: "jwt"},

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any) {
                try {
                    const {data} = await axios.post(
                        `${process.env.BACKEND_URL}/auth/login`,
                        {email: credentials.email, password: credentials.password}
                    );

                    if(data?.user && data?.accessToken) {
                        return {
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken
                        };
                    }
                    return null;
                } catch {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.email) {
                try {
                    const {data} = await axios.post(`${process.env.BACKEND_URL}/auth/oauth/google`, {
                        email: user.email,
                        name: user.name,
                        googleAccessToken: account.access_token,
                        googleRefreshToken: account.refresh_token,
                    });

                    if(data?.accessToken && data?.refreshToken) {
                        user.accessToken = data.accessToken;
                        user.refreshToken = data.refreshToken;
                    }

                    return true;
                } catch (err) {
                    console.error("Failed to upsert Google user in backend:", err);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user, account }): Promise<JWT> {
            if (account && user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL
                };
            }

            if (Date.now() < (token as any).accessTokenExpires) {
                return token;
            }

            try {
                const { data } = await axios.post(
                    `${process.env.BACKEND_URL}/auth/refresh`,
                    { refreshToken: token.refreshToken }
                );
                return {
                    ...token,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL
                };
            } catch (err: any) {
                console.error("Refresh endpoint failed:", err.response?.status, err.response?.data || err.message);
                return token;
            }
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            };
            return session;
        },
    },
    events: {
        async signOut({token}) {
            try {
                if(token.refreshToken) {
                    await axios.post(
                        `${process.env.BACKEND_URL}/auth/logout`,
                        {refreshToken: token.refreshToken}
                    )
                }
            } catch (e) {
                console.error("Failed to revoke refresh token:", e);
            }
        }
    }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};