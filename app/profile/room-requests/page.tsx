"use client"


import { useState, useEffect } from 'react';
import Spinner from '@/app/components/Spinner';
import RequestCard from '@/app/components/RequestCard';



export default function RoommateRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/requests', {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        setRequests(data);
      } catch (error) {
        console.error('Error fetching room requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Roommate Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600 h-screen">No roommate requests at the moment.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((request: any) => (
            <RequestCard key={request?.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
