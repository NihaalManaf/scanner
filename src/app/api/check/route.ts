import { NextRequest, NextResponse } from 'next/server';
import { env } from "~/env";

interface ResponseType {
  status: string;
  name: string;
  enterStatus: boolean;
  ticket_id: string;
  bookingId: string,
  ticket_number: string;
}

export async function POST(req: NextRequest) {
  try {
    const {code } = await req.json() as { code: string };

    const data = {
      auth: env.SECRET_API_KEY,
      qr: code
    };

    const response = await fetch("https://suntamed-f34d18fb4c60.herokuapp.com/scan", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      return new NextResponse(JSON.stringify({ message: 'Failed to fetch data from external API' }), { status: response.status });
    }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: ResponseType = await response.json();
    console.log(response)

    return new NextResponse(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ message: 'An error occurred while processing your request' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
