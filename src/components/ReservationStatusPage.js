import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import './ReservationStatusPage.css'; // Import CSS for styling

function ReservationStatusPage() {
  const [firstClientReservationNumber, setFirstClientReservationNumber] = useState(null);

  useEffect(() => {
    fetchFirstClientReservationNumber(); // Fetch the reservation number of the first client when component mounts
    const intervalId = setInterval(fetchFirstClientReservationNumber, 5000); // Fetch first client's reservation number every 5 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  async function fetchFirstClientReservationNumber() {
    try {
      const response = await fetch('https://botdis.xyz/clients');
      const data = await response.json();
      if (data.length > 0) {
        setFirstClientReservationNumber(data[0].reservationNumber); // Set the reservation number of the first client
      }
    } catch (error) {
      console.error('Error fetching first client reservation number:', error);
    }
  }

  return (
    <div className="reservation-status-container">
      <Typography variant="h5" component="h2">الرقم الحالي </Typography>
      <div className="reservation-number-container">
        {firstClientReservationNumber && (
          <Box className="reservation-number-box">
            <Typography variant="h2" className="reservation-number">{firstClientReservationNumber}</Typography>
          </Box>
        )}
      </div>
    </div>
  );
}

export default ReservationStatusPage;
