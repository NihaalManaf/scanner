"use client"
import { useState, useEffect } from "react";
import { env } from "~/env";
import QRScanner from "~/component/QRScanner";

interface AuthResponse {
  authorized: boolean;
}

export default function HomePage() {

  const [phrase, setPhrase] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const handlePhraseSubmit = async () => {
    const response = await fetch('/api/phrase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.NEXT_PUBLIC_API_KEY || ''
      },
      body: JSON.stringify({ phrase })
    });
    if (response.status === 401) {
      console.error('Unauthorized');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: AuthResponse = await response.json();
    if (data.authorized) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect phrase. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-[5rem]">
           <span className="text-[hsl(280,100%,70%)]">BrownRoast </span> Ticket Scanner
        </h1>

        {!isAuthorized && (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Authorization phrase"
              className="p-2 w-64 border border-gray-300 rounded"
            />
            <button
              onClick={handlePhraseSubmit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        )}

        {isAuthorized && (<QRScanner />)}

      </div>
    </main>
  );
}
