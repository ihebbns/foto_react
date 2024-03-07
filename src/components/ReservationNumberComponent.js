import React, { useState, useEffect } from 'react';
import './ReservationNumberComponent.css';

function ReservationNumberComponent() {
  const [reservationNumber, setReservationNumber] = useState(null);
  const [name, setName] = useState('');
  const [num, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false); // State variable for reservation state

  useEffect(() => {
    fetchReservationState(); // Fetch reservation state when component mounts
  }, []);

  async function fetchReservationState() {
    try {
      const response = await fetch('https://photograph-1.onrender.com/admin/auth/reservation-state');
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
  
    // Validate phone number format (exactly 8 digits)
    const numRegex = /^\d{8}$/;
    if (!numRegex.test(num)) {
      setError('يرجى إدخال رقم هاتف صحيح (8 أرقام).');
      return;
    }
  
    try {
      // Check if the phone number already exists in the database
      const response = await fetch(`https://photograph-1.onrender.com/clients/phone-number/${num}`);
      if (!response.ok) {
         await response.json();

      } else {
        
        throw new Error('Failed to check phone number availability.');
      }
  
      // If phone number is valid and not already in the database, make the reservation
      const reservationResponse = await fetch('https://photograph-1.onrender.com/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, num }),
      });
      if (!reservationResponse.ok) {
        throw new Error('فشل في إجراء الحجز');
      }
      const reservationData = await reservationResponse.json();
      setReservationNumber(reservationData.reservationNumber);
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
<div className="card">
  <div className="card-body">
<h4 className="text-center" style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap' }}> سجل باش تعمل احلى تصاور</h4>
    {/* Form to enter name */}
    <div className="mb-3">
      <label htmlFor="name" className="form-label">اسمك</label>
      <input type="text" id="name" className="form-control" value={name} onChange={handleNameChange} required/>
    </div>
    {/* Form to enter phone number */}
    <div className="mb-3">
      <label htmlFor="num" className="form-label">رقم هاتفك</label>
      <input type="text" id="num" className="form-control" value={num} onChange={handlePhoneNumberChange} />
    </div>
    {/* Button to make reservation */}
    <div className="text-center">
      {!isOpen ? (
        <button className="btn btn-secondary" disabled>
          نحن مغلقون الآن
        </button>
      ) : (
        <button onClick={handleReservationClick} className="btn btn-primary">
          إجراء الحجز
        </button>
      )}
    </div>
    <br></br>
    {/* Display reservation number if available */}
    <div class="container">
  <div class="row">
    <div class="col-md-12 text-center">
    {reservationNumber && (
      <h3 class="animate-charcter"> رقم حجزك هو <b>{reservationNumber} </b>يرجى الحضور إلى الاستديو عند اقترابه احفظه جيدا </h3>)}
    </div>
  </div>
</div>

    {/* Display error message if reservation failed */}
    {error && (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )}
  </div>
</div>

  );
}

export default ReservationNumberComponent;
