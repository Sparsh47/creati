import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const {pathname} = req.nextUrl;

    if(!token) {
        if(pathname==="/" || pathname==="/signin") {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    if(pathname==="/" && token) {
        return NextResponse.redirect(new URL("/flow", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|signin).*)"],
};