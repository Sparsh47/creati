import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import axios from "axios";
import {authOptions} from "@/lib/auth";

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
                },
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        );

        if (response.status === 429) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    message: 'You have reached your creation limit. Please try again later.',
                    retryAfter: response.headers['retry-after'] || null
                },
                { status: 429 }
            );
        }

        if (response.status >= 400 && response.status < 500) {
            return NextResponse.json(
                {
                    error: response.data?.message || 'Client error',
                    details: response.data
                },
                { status: response.status }
            );
        }

        return NextResponse.json(response.data);

    } catch (error: any) {
        if (error.response) {
            return NextResponse.json(
                {
                    error: error.response.data?.message || 'Server error',
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
            `${process.env.BACKEND_URL}/designs/user-designs/`,
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