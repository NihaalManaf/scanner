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
  const [showResult, setShowResult] = useState<boolean>(false);
  const [response, setResponse] = useState<responseType | null>(null);

    const handleAuth = async (code:string) =>{
    
        const data = {
          code: code
    };

    if(showResult){
      return;
    }

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
    
        const processSuccess = async (result: string) => {               
            await handleAuth(result)
        }

        const success = (result: string) => {
            if(!showResult){
                          // eslint-disable-next-line  @typescript-eslint/no-floating-promises
            processSuccess(result)
            }
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