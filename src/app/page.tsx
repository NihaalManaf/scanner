"use client"
import Link from "next/link";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useEffect } from "react";

export default function HomePage() {

  const [result,setResult] = useState(null)

  useEffect(()=>{
    const scanner = new Html5QrcodeScanner('reader',{
      qrbox:{
        width:450,
        height:450,
      },
      fps:24,
    })

    const success = (result) => {
      scanner.clear()
      setResult(result)
    }
  
    const error = (err) => {
      console.warn(err)
    }
    
    scanner.render(success,error);
  
 
  },[])
 

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-[5rem]">
          Scanner <span className="text-[hsl(280,100%,70%)]">Auth</span> App
        </h1>
        <div className="w-96 flex flex-col justify-center items-center" id="reader"></div>
      </div>
    </main>
  );
}
