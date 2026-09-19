import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [draftBooking, setDraftBooking] = useState(() => {
    const saved = sessionStorage.getItem('staynest_draft_booking');
    return saved ? JSON.parse(saved) : null;
  });

  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(() => {
    const saved = sessionStorage.getItem('staynest_last_booking');
    return saved ? JSON.parse(saved) : null;
  });

  const saveDraft = (data) => {
    setDraftBooking(data);
    if (data) {
      sessionStorage.setItem('staynest_draft_booking', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('staynest_draft_booking');
    }
  };

  const saveConfirmed = (data) => {
    setLastConfirmedBooking(data);
    if (data) {
      sessionStorage.setItem('staynest_last_booking', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('staynest_last_booking');
    }
  };

  const clearBookingFlow = () => {
    setDraftBooking(null);
    sessionStorage.removeItem('staynest_draft_booking');
  };

  return (
    <BookingContext.Provider
      value={{
        draftBooking,
        saveDraft,
        lastConfirmedBooking,
        saveConfirmed,
        clearBookingFlow,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
