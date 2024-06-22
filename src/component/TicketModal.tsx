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
    <></>
  );
};

export default TicketModal;
