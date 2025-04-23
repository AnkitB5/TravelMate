// src/components/TripDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Button, Card, Container } from 'react-bootstrap';

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    api.get(`/trips/${id}/`)
      .then((res) => setTrip(res.data))
      .catch((err) => console.error('Error fetching trip details', err));
  }, [id]);

  if (!trip) return <div>Loading trip details...</div>;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #FFDEE9, #B5FFFC)', 
      paddingTop: '50px' 
    }}>
      <Container>
        <Card className="mx-auto" style={{ maxWidth: '600px', borderRadius: '10px' }}>
          <Card.Body>
            <Card.Title style={{ fontWeight: 700, fontSize: '1.5rem' }}>
              Trip to {trip.destination}
            </Card.Title>
            <Card.Text>
              <strong>Travel Dates:</strong> {trip.travel_start} - {trip.travel_end}
              <br />
              <strong>Activities:</strong> {trip.activities || 'None'}
            </Card.Text>
            <h5 className="mt-4">Packing List</h5>
            <ul>
              {trip.packing_list && trip.packing_list.length > 0
                ? trip.packing_list.map((item, index) => <li key={index}>{item}</li>)
                : <li>No items. (AI suggestions would appear here.)</li>
              }
            </ul>
            <Button 
              variant="primary" 
              as={Link}
              to="/"
              style={{ borderRadius: '20px', marginTop: '1rem' }}
            >
              Back to Dashboard
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TripDetails;
