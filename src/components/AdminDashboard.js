import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css';

function AdminDashboard() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 20;

  useEffect(() => {
    fetchClients(); // Fetch clients data when component mounts
    fetchReservationState(); // Fetch reservation state when component mounts
    const intervalId = setInterval(fetchClients, 5000); // Fetch clients data every 5 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    // Filter clients when the searchTerm changes
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.num.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  // Calculate index of the first client on the current page
  const indexOfFirstClient = (currentPage - 1) * clientsPerPage;

  // Calculate index of the last client on the current page
  const indexOfLastClient = indexOfFirstClient + clientsPerPage;

  // Get current clients to display based on pagination
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  async function fetchClients() {
    try {
      const response = await fetch('https://botdis.xyz/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }

  async function fetchReservationState() {
    try {
      const response = await fetch('https://botdis.xyz/admin/auth/reservation-state');
      const data = await response.json();
      setIsOpen(data.isOpen);
    } catch (error) {
      console.error('Error fetching reservation state:', error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`https://botdis.xyz/clients/${id}`, {
        method: 'DELETE',
      });
      // Update the reservation numbers for remaining users
      const updatedClients = clients.filter((client) => client.id !== id);
      setClients(updatedClients);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const toggleReservation = async () => {
    try {
      const response = await fetch('https://botdis.xyz/admin/auth/toggle-reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOpen: !isOpen }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsOpen(data.isOpen); // Update reservation state if the request is successful
      } else {
        console.error('Failed to toggle reservation state');
      }
    } catch (error) {
      console.error('Error toggling reservation:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Button
        className={`reservation-button ${isOpen ? 'close-button' : 'open-button'}`}
        onClick={toggleReservation}
        variant="contained"
        color={isOpen ? 'error' : 'success'}
      >
        {isOpen ? 'Close Reservation' : 'Open Reservation'}

      </Button><br></br><br></br>

      <div className="search-container">
        <TextField
          type="text"
          label="Search by name or num"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setSearchTerm('')} variant="contained">
          Clear
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Reservation Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.num}</TableCell>
                <TableCell>{client.reservationNumber}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(client.id)} variant="contained" color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination">
        <Button onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }, (_, index) => {
          const pageNumber = index + 1;
          const startPage = currentPage > 3 ? currentPage - 2 : 1;
          const endPage = startPage + 4 > Math.ceil(filteredClients.length / clientsPerPage) ? Math.ceil(filteredClients.length / clientsPerPage) : startPage + 4;
          if (pageNumber >= startPage && pageNumber <= endPage) {
            return (
              <Button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                variant={currentPage === pageNumber ? 'contained' : 'outlined'}
                color="primary"
              >
                {pageNumber}
              </Button>
            );
          } else {
            return null;
          }
        })}
        <Button onClick={() => setCurrentPage(currentPage < Math.ceil(filteredClients.length / clientsPerPage) ? currentPage + 1 : Math.ceil(filteredClients.length / clientsPerPage))} disabled={currentPage === Math.ceil(filteredClients.length / clientsPerPage)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    </div>
  );
}

export default AdminDashboard;
