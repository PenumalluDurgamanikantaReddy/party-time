"use client";
import { useEffect, useState } from 'react';
import { getAllEvents } from '../../lib/events';
import EventCard from '../../components/EventCard';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAllEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events Near You</h1>
      <div className="grid gap-4">
        {events.map(ev => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}
