"use client"
import { Html5QrcodeScanner, Html5QrcodeScannerState, Html5QrcodeScanType } from "html5-qrcode";
import { useState, useEffect } from "react";

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
  const [isPaused,setPaused] = useState<boolean>(false);

  const handleConfirm = () => {
    setShowResult(false)
  }

  const getMessage = () => {
    if (response?.status !== 'valid') {
      return 'Invalid QR';
    } else if (response?.status === 'valid' && !response?.enterStatus) {
      return 'Already Entered';
    } else {
      return 'Good to Enter';
    }
  };


    const handleGateway = (code:string) => {
      if(showResult){
        setShowResult(true)
        return;
      }else{
      // eslint-disable-next-line  @typescript-eslint/no-floating-promises
        handleAuth(code)
      }
    }

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
   
  }
  
  const check = (scanner : Html5QrcodeScanner){
    if(scanner.getState()==Html5QrcodeScannerState.PAUSED && !showResult){
      scanner.resume()
    }
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
            disableFlip: false,
            rememberLastUsedCamera: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
          },
          false,
        );
    
        const processSuccess =  (result: string) => {      
                                    // eslint-disable-next-line  @typescript-eslint/no-floating-promises
                                    scanner.pause()
             handleGateway(result)
        }

        const success = (result: string) => {
                          // eslint-disable-next-line  @typescript-eslint/no-floating-promises
            processSuccess(result)
        };
    
        const error = (err: string) => {
          console.warn(err);
        };

        check(scanner)
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
              (<div
                className={`fixed top-0 left-0 w-full h-full flex justify-center items-center ${
                  response?.status === 'valid' && response?.enterStatus ? 'bg-green-500' : 'bg-red-500'
                } bg-opacity-50`}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="flex flex-col items-start mb-2">
                  <h1 className='mt-2 font-bold text-2xl'> 🎫 Ticket-ID # {response?.ticket_id}</h1>
                  <p className='text-gray-500'>Booking ID : {response?.bookingId}</p>
                  <p className='mt-4'> <b>Name</b> : {response?.name} # <b>{response?.ticket_number} </b> </p>
                  </div>
                  <p className="font-bold text-2xl text-center m-8"> {getMessage()}</p>
                  <button
                        className="bg-black text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-200 hover:shadow-xl active:scale-95 mr-2"
                        onClick={handleConfirm}
                      >
                         Next
                      </button>
                </div>
              </div>)
}
    
      
        </>
      );
}

export default QRScanner