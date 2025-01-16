import { NextRequest, NextResponse } from 'next/server';
import { env } from "~/env";

interface ResponseType {
  status: string;
  name: string;
  enterStatus: boolean;
  ticket_id: string;
  bookingId: string;
  ticket_number: string;
}

export async function POST(req: NextRequest) {
  console.log('Received a request at:', new Date().toISOString());

  const startTime = Date.now(); // Start time for measuring response time

  try {
    const { code } = await req.json() as { code: string };

    const data = {
      auth: env.SECRET_API_KEY,
      qr: code
    };

    console.log('Sending request to external API with code:', code);

    const response = await fetch("https://nes-ac486dca6167.herokuapp.com/scan", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const endTime = Date.now(); // End time after fetching the response
    console.log('Received response from external API in:', endTime - startTime, 'ms');

    // Check if the response is OK
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Error from external API:', errorMessage || 'Failed to fetch data from external API');
      return new NextResponse(JSON.stringify({ message: errorMessage || 'Failed to fetch data from external API' }), { status: response.status });
    }

    // Ensure we correctly cast the response
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: ResponseType = await response.json();
  
    console.log('Sending back response at:', new Date().toISOString(), 'with data:', result);

  
    console.log(result)
    
    return new NextResponse(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ message: 'An error occurred while processing your request' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

