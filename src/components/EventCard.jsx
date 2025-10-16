export default function EventCard({ event }) {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-semibold">{event.name}</h3>
      <div className="text-sm text-gray-600">{event.location?.address}</div>
      <div className="text-sm">Time: {event.time}</div>
      <div className="text-sm">Price: {event.price}</div>
      <div className="text-sm">Attendees: {event.attendees || 0}</div>
    </div>
  );
}
