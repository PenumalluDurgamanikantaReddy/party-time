import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

const EVENTS_COL = 'events';

export async function addEvent(eventData) {
  // eventData: { organizerId, name, description, time, price, location: {lat,lng,address}, features:[], photos:[] }
  if (!db) throw new Error('Firestore not initialized');
  const col = collection(db, EVENTS_COL);
  const docRef = await addDoc(col, {
    ...eventData,
    createdAt: new Date().toISOString(),
    attendees: 0,
  });
  return docRef.id;
}

export async function getOrganizerEvents(organizerId) {
  if (!db) return [];
  const q = query(collection(db, EVENTS_COL), where('organizerId', '==', organizerId), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllEvents(limitCount = 50) {
  if (!db) return [];
  const q = query(collection(db, EVENTS_COL), orderBy('createdAt', 'desc'), limit(limitCount));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Note: Firestore doesn't support geo queries natively. For nearby events you can
// either store geohash and use a library, or fetch client-side and filter by distance.
export async function getNearbyEvents(center, radiusKm = 50) {
  // simple client-side filter after fetching nearby (this fetches all, so not ideal)
  const events = await getAllEvents(200);
  const toRad = (deg) => deg * Math.PI / 180;
  function distanceKm(a, b) {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat/2);
    const sinDLon = Math.sin(dLon/2);
    const aa = sinDLat*sinDLat + sinDLon*sinDLon * Math.cos(lat1)*Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
    return R * c;
  }
  return events.filter(ev => {
    if (!ev.location || !ev.location.lat) return false;
    const d = distanceKm(center, ev.location);
    return d <= radiusKm;
  });
}
