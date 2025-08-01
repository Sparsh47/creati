import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const {prompt, nodes, edges} = body;

        if (!prompt || !nodes || !edges) {
            return NextResponse.json(
                { error: 'Missing required fields: prompt, nodes, edges' },
                { status: 400 }
            );
        }

        const response = await axios.post(
            `${process.env.BACKEND_URL}/designs/create`,
            {
                prompt,
                nodes,
                edges,
                email: session.user?.email,
            },
            {
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error creating design:', error);

        if (error.response) {
            return NextResponse.json(
                {
                    error: error.response.data?.message || 'Backend error',
                    details: error.response.data
                },
                { status: error.response.status }
            );
        } else {
            return NextResponse.json(
                { error: 'Failed to connect to backend', details: error.message },
                { status: 500 }
            );
        }
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await axios.get(
            `${process.env.BACKEND_URL}/designs/user-designs/${session.user.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json(response.data);

    }  catch (error: any) {
        console.error('Error creating design:', error);

        if (error.response) {
            return NextResponse.json(
                {
                    error: error.response.data?.message || 'Backend error',
                    details: error.response.data
                },
                { status: error.response.status }
            );
        } else {
            return NextResponse.json(
                { error: 'Failed to connect to backend', details: error.message },
                { status: 500 }
            );
        }
    }
}