import { NextResponse } from 'next/server';

const TARGET_URL = 'http://46.137.220.6:5096/api/v1';

async function handleRequest(request, context) {
    try {
        const { params } = context;
        // Correct way to access params in Next.js 15+ is awaiting them if they are dynamic
        const unwrappedParams = await params;
        const pathArray = unwrappedParams.path || [];
        const path = pathArray.join('/');

        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        // Construct the final backend URL
        const url = `${TARGET_URL}/${path}${queryString ? `?${queryString}` : ''}`;

        // Forward headers, excluding 'host' to avoid SSL/DNS issues
        const headers = new Headers(request.headers);
        headers.delete('host');

        // Extract body for non-GET/HEAD requests
        let body;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            body = await request.text();
        }

        const response = await fetch(url, {
            method: request.method,
            headers: headers,
            body: body,
            // Force no-cache to ensure proxy doesn't return stale data
            cache: 'no-store'
        });

        // Get the response content
        const data = await response.text();

        // Return the response with original status and relevant headers
        return new NextResponse(data, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
            },
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { error: 'Proxy Request Failed', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request, context) {
    return handleRequest(request, context);
}

export async function POST(request, context) {
    return handleRequest(request, context);
}

export async function PUT(request, context) {
    return handleRequest(request, context);
}

export async function PATCH(request, context) {
    return handleRequest(request, context);
}

export async function DELETE(request, context) {
    return handleRequest(request, context);
}
