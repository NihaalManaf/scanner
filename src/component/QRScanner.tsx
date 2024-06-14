"use client"
import { Html5QrcodeScanner, Html5QrcodeResult } from "html5-qrcode";
import { useState, useEffect } from "react";

const QRScanner = () => {

    const handleAuth = (code:string) =>{
    alert("Valid QR : code")
  }
  
  const [scanResult, setResult] = useState<string | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
          'reader',
          {
            qrbox: {
              width: 250,
              height: 250,
            },
            fps: 24,
            disableFlip: false
          },
          false
        );
    
        const success = (result: string) => {
          setResult(result);
          handleAuth(result);
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
        <div className="w-96 flex flex-col justify-center items-center" id="reader"></div>
      );
}

export default QRScanner