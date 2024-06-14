import { NextRequest, NextResponse } from 'next/server';
import { env } from "~/env";

export async function POST(req: NextRequest) {
  const { phrase } = await req.json();
  const apiKey = req.headers.get('x-api-key');
  const serverKey = env.SERVER_API_KEY;
  const authPhrase = env.SECRET_PHRASE;

  if (phrase !== authPhrase || (apiKey+"7d7c8e5f7e22") !== serverKey) {
    return new NextResponse(JSON.stringify({ authorized: false }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  return new NextResponse(JSON.stringify({ authorized: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}