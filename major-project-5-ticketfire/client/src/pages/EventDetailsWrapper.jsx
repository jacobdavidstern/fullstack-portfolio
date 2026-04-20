import { DEMO_MODE } from '../demo';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import { useAuth } from '../auth/useAuth';
import EventDetails from './EventDetails';

export default function EventDetailsWrapper() {
  const { slug, eventNumber } = useParams();
  const { client } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (DEMO_MODE) {
          // Load full list and find event by eventNumber
          const data = await apiFetch(`/${slug}/events`);
          const found = data.events.find(
            (e) => String(e.eventNumber) === String(eventNumber)
          );
          setEvent(found || null);
        } else {
          // Real backend: fetch single event
          const data = await apiFetch(`/${slug}/events/${eventNumber}`);
          setEvent(data.event || data);
        }
      } catch (err) {
        console.error(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, eventNumber]);

  if (loading) return <div>Loading…</div>;
  if (!event) return <div>Event not found.</div>;

  return <EventDetails event={event} />;
}
