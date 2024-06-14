import { NextRequest, NextResponse } from 'next/server';
import { env } from "~/env";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const serverKey = env.SERVER_API_KEY;
  const authPhrase = serverKey;

  if (!apiKey || (apiKey+"7d7c8e5f7e22") !== serverKey) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  return new NextResponse(JSON.stringify({ authPhrase: authPhrase }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}