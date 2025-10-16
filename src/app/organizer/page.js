"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EventForm from '../../components/EventForm';
import { getOrganizerEvents } from '../../lib/events';

export default function OrganizerPage() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) return;
    getOrganizerEvents(user.uid).then(setEvents).catch(console.error);
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div className="p-6">Please <button onClick={signInWithGoogle} className="underline">sign in with Google</button></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
        <div>
          <span className="mr-4">{user.displayName}</span>
          <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Create Event</h2>
        <EventForm organizerId={user.uid} onAdded={(id) => { setEvents(prev=>[{id, name:'(new)', location:{}, time:'', price:0, attendees:0}, ...prev]); }} />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Your Events</h2>
        <div className="grid gap-4 mt-3">
          {events.map(ev => (
            <div key={ev.id} className="p-3 border rounded">{ev.name} - {ev.attendees || 0} attendees</div>
          ))}
        </div>
      </div>
    </div>
  );
}
