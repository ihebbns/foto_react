import React, { useState, useEffect } from 'react';
import { TextField, Button, Alert, Card, CardContent, Typography, Container } from '@mui/material';
import './ReservationNumberComponent.css';

function ReservationNumberComponent() {
  const [reservationNumber, setReservationNumber] = useState(null);
  const [name, setName] = useState('');
  const [num, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchReservationState(); // Fetch reservation state when component mounts
  }, []);

  async function fetchReservationState() {
    try {
      const response = await fetch('https://botdis.xyz/admin/auth/reservation-state', {
        headers: {
          'x-secret-key': 'studiohoussem00001s'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setIsOpen(data.isOpen);
      } else {
        throw new Error('Failed to fetch reservation state');
      }
    } catch (error) {
      console.error('Error fetching reservation state:', error);
    }
  }

  const handleReservationClick = async () => {
    if (!name || !num) {
      setError('يرجى ملء كل الحقول.');
      return;
    }
  
    const numRegex = /^\d{8}$/;
    if (!numRegex.test(num)) {
      setError('يرجى إدخال رقم هاتف صحيح (8 أرقام).');
      return;
    }

    try {
      // Check if the phone number already exists in the database
      const response = await fetch(`https://botdis.xyz/clients/phone-number/${num}`, {
        headers: {
          'x-secret-key': 'studiohoussem00001s'
        }
      });

      if (response.ok) {
        // If the phone number already exists, show an error
        setError('الرقم موجود بالفعل.');
        return;
      }

      // If phone number is valid and not already in the database, make the reservation
      const reservationResponse = await fetch('https://botdis.xyz/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': 'studiohoussem00001s'
        },
        body: JSON.stringify({ name, num }),
      });
      if (reservationResponse.ok) {
        const reservationData = await reservationResponse.json();
        setReservationNumber(reservationData.reservationNumber);
      } else {
        throw new Error('فشل في إجراء الحجز');
      }
    } catch (error) {
      console.error('خطأ في إجراء الحجز:', error.message);
      setError('فشل في إجراء الحجز . الرقم موجود بالفعل.');
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardContent>
          <Typography variant="h4" align="center" style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap' }}>
            سجل باش تعمل احلى تصاور
          </Typography>
          <TextField
            fullWidth
            label="اسمك"
            value={name}
            onChange={handleNameChange}
            variant="outlined"
            margin="normal"
            required
            style={{ textAlign: 'right' }}
          />
          <TextField
            fullWidth
            label="رقم هاتفك"
            value={num}
            onChange={handlePhoneNumberChange}
            variant="outlined"
            margin="normal"
            required
            style={{ textAlign: 'right' }}
          />
          {isOpen ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleReservationClick}
            >
              إجراء الحجز
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              disabled
            >
              نحن مغلقون الآن
            </Button>
          )}
          {reservationNumber && (
            <Alert severity="success" style={{ marginTop: '20px', padding: '20px', fontSize: '20px', lineHeight: '30px' }}>
              رقم حجزك هو <b>{reservationNumber}</b>. يرجى الحضور إلى الاستوديو عند اقترابه احفظه جيدا.
            </Alert>
          )}
          {error && (
            <Alert severity="error" style={{ marginTop: '20px' }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ReservationNumberComponent;
