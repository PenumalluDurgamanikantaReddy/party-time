"use client";
import { useState } from 'react';
import { addEvent } from '../lib/events';

export default function EventForm({ organizerId, onAdded }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('0');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const id = await addEvent({
      organizerId,
      name,
      time,
      price: Number(price),
      location: { address, lat: Number(lat), lng: Number(lng) },
      features: [],
      photos: [],
    });
    setName(''); setTime(''); setPrice('0'); setAddress(''); setLat(''); setLng('');
    if (onAdded) onAdded(id);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Event name" className="w-full p-2 border" />
      <input value={time} onChange={e => setTime(e.target.value)} placeholder="Time" className="w-full p-2 border" />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border" />
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="w-full p-2 border" />
      <div className="flex gap-2">
        <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Lat" className="w-1/2 p-2 border" />
        <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Lng" className="w-1/2 p-2 border" />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Event</button>
    </form>
  );
}
