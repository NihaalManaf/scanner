import React, { useState, useEffect } from 'react';

interface responseType {
    status:string,
    name: string,
    auth:string,
    enterStatus:boolean,
    ticket_id: string,
    bookingId:string,
    ticket_number:string,
  }

type TicketComponentProps = {
  response: responseType | null,
  showResult: boolean,
  setShowResult: (value: boolean) => void,
};

const TicketModal: React.FC<TicketComponentProps> = ({ response, showResult, setShowResult }) => {

    console.log(response)
  const getMessage = () => {
    if (response?.status !== 'valid') {
      return 'Invalid QR';
    } else if (response?.status === 'valid' && !response?.enterStatus) {
      return 'Already Entered';
    } else {
      return 'Good to Enter';
    }
  };

  const handleConfirm = () => {
    setShowResult(false)
  }

  return showResult && (
    <div
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
  </div>
  );
};

export default TicketModal;
