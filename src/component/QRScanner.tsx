"use client"
import { Html5QrcodeScanner, Html5QrcodeResult } from "html5-qrcode";
import { useState, useEffect } from "react";
import TicketModal from "./TicketModal";

interface responseType {
  status:string,
  name: string,
  auth:string,
  enterStatus:boolean,
  ticket_id: string,
  bookingId:string,
  ticket_number:string,
}
//true when they just got registered
const QRScanner = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [response, setResponse] = useState<responseType | null>(null);
    const handleAuth = async (code:string) =>{
    
        const data = {
          code: code
    };

    const res = await fetch('/api/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: responseType = await res.json();
    setShowResult(true)
    setResponse(result)
    console.log(response)
  }
  


  const handleConfirm = () => {
    setShowResult(false)
  }
 
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
          'reader',
          {
            qrbox: {
              width: 250,
              height: 250,
            },
            fps: 10,
            disableFlip: false
          },
          false
        );
    
        const success = async (result: string) => {
          if (isProcessing) return; // Prevent multiple calls
    
          setIsProcessing(true); // Set processing flag
          await handleAuth(result); // Handle the scanned result
    
          // Pause scanning
          scanner.pause();
    
          // Resume scanning after 2 seconds
          setTimeout(() => {
            setIsProcessing(false); // Reset processing flag
            scanner.resume();
          }, 1000);
        };
    
        const error = (err: string) => {
          console.warn(err);
        };
    
        scanner.render(success, error);
    
        return () => {
          scanner.clear().catch(error => {
            console.error("Failed to clear ", error);
          });
        };
      }, []);

      return(
        <>
        <div className="w-96 flex flex-col justify-center items-center" id="reader"></div>
        {showResult && 
              (<TicketModal response={response} showResult={showResult} setShowResult={setShowResult} />)
}
      
        </>
      );
}

export default QRScanner