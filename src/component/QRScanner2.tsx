"use client";
import { useState, useEffect, useRef } from "react";
import QrScanner from "qr-scanner";
import { Card, CardTitle, CardContent,CardHeader } from "~/components/ui/card";


interface responseType {
  status: string;
  name: string;
  auth: string;
  enterStatus: boolean;
  ticket_id: string;
  bookingId: string;
  ticket_number: string;
  multi_ticket: string;
}

const QRScanner = () => {
  const [showResult, setShowResult] = useState<boolean>(false);
  const [response, setResponse] = useState<responseType | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const lastScannedCode = useRef<string | null>(null);
  const videoRef = useRef<HTMLVideoElement  | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null); // UseRef for qrScanner instance
  const [apiDuration, setApiDuration] = useState<number | null>(null); // To store API call duration
  const [count,setCount] = useState<number>(0);

  const handleConfirm = () => {
    setShowResult(false);
    setIsPending(false);
    lastScannedCode.current = null; // Reset the last scanned code
    setCount(count+1)
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
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result: responseType = await res.json();
  
        setShowResult(true);
        setResponse(result);
  
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
  
    const processSuccess = async (result: string) => {
      setIsPending(true);
      await handleAuth(result);
    };
  
    const success = (result: string) => {
      if (!showResult && result !== lastScannedCode.current && !isPending) {
        lastScannedCode.current = result;
        void processSuccess(result);
        qrScannerRef.current?.stop()
      }
    };
    
    const error = (err: Error) => {
      console.warn(err.message);
    }
      
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => success(result.data),
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          preferredCamera: "environment", // Use the rear camera for better focus on phones
        }
      );
      qrScannerRef.current.start().catch(error);
    }

    return () =>{
      qrScannerRef.current?.stop();
      qrScannerRef.current=null
    }

  }, [count]);

  return (
    <>
      <Card className="w-[17rem] overflow-hidden">
        <CardHeader className="p-4 bg-muted">
            <CardTitle className="text-2xl font-bold text-center">Scanner</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <video ref={videoRef} className="w-64 h-64" />
        </CardContent>
    </Card>
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
              <p className="mt-4">
                <b>MULTI_TICKET</b> : {response?.multi_ticket}
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
