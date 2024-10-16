"use client";
import { useState, useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

interface responseType {
  status: string;
  name: string;
  auth: string;
  enterStatus: boolean;
  ticket_id: string;
  bookingId: string;
  ticket_number: string;
}

const QRScanner = () => {
  const [showResult, setShowResult] = useState<boolean>(false);
  const [response, setResponse] = useState<responseType | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const lastScannedCode = useRef<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null); // UseRef for qrScanner instance
  const [apiDuration, setApiDuration] = useState<number | null>(null); // To store API call duration

  const handleConfirm = () => {
    setShowResult(false);
    setIsPending(false);
    lastScannedCode.current = null; // Reset the last scanned code
  };

  const getMessage = () => {
    if (response?.status !== "valid") {
      return "Invalid QR";
    } else if (response?.status === "valid" && !response?.enterStatus) {
      return "Already Entered";
    } else {
      return "Good to Enter";
    }
  };

  useEffect(() => {
    const handleAuth = async (fromqr: string) => {
      const data = { code: fromqr };

      try {
        const startTime = Date.now(); // Start timing the API call
        console.log(`API call started at: ${new Date(startTime).toLocaleTimeString()}`);

        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result: responseType = await res.json();
        const endTime = Date.now(); // End timing the API call
        const duration = endTime - startTime;

        setApiDuration(duration);
        setShowResult(true);
        setResponse(result);

        console.log(`API call ended at: ${new Date(endTime).toLocaleTimeString()}`);
        console.log(`Time taken for API response: ${duration}ms`);
        console.log("API Response:", result);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    const processSuccess = async (result: string) => {
      setIsPending(true);
      console.log(`QR code scanned: ${result}`);
      await handleAuth(result);
    };

    const success = (result: string) => {
      if (!showResult && result !== lastScannedCode.current && !isPending) {
        lastScannedCode.current = result;
        void processSuccess(result);
      }
    };

    const error = (err: Error) => {
      console.warn(err.message);
    };

    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => success(result.data),
        {
          returnDetailedScanResult: true,
          preferredCamera: "environment", // Use the rear camera for better focus on phones
        }
      );
      qrScannerRef.current.start().catch(error);
    }

    return () => {
      qrScannerRef.current?.stop();
      qrScannerRef.current = null;
    };
  }, [isPending, showResult]);

  return (
    <>
      <div className="w-96 flex flex-col justify-center items-center">
        <video ref={videoRef} style={{ width: "250px", height: "250px" }} />
      </div>
      {showResult && (
        <div
          className={`fixed top-0 left-0 w-full h-full flex justify-center items-center ${
            response?.status === "valid" && response?.enterStatus
              ? "bg-green-500"
              : "bg-red-500"
          } bg-opacity-50`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex flex-col items-start mb-2">
              <h1 className="mt-2 font-bold text-2xl">
                🎫 Ticket-ID # {response?.ticket_id}
              </h1>
              <p className="text-gray-500">Booking ID : {response?.bookingId}</p>
              <p className="mt-4">
                <b>Name</b> : {response?.name} # <b>{response?.ticket_number}</b>
              </p>
            </div>
            <p className="font-bold text-2xl text-center m-8">{getMessage()}</p>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-200 hover:shadow-xl active:scale-95 mr-2"
              onClick={handleConfirm}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QRScanner;
