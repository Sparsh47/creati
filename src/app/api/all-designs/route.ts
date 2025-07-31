import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions);

        if(session) {
            const response = await axios.get(`${process.env.BACKEND_URL}/designs/get-all-designs`, {
                headers: {
                    "Authorization": `Bearer ${session.user.accessToken}`
                }
            });

            return NextResponse.json({
                status: 200,
                data: response.data
            });
        } else {
            return NextResponse.json({
                status: 403,
                data: {
                    error: "Unauthorized"
                }
            })
        }
    } catch (e: any) {
        return NextResponse.json({
            status: 500,
            data: {
                error: "Internal Server Error " + e.message
            }
        })
    }
}