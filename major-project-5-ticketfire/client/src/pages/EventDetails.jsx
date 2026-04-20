import { useAuth } from '../auth/useAuth';
import { ui } from '../styles/ui';

const EventDetails = ({ event }) => {
  const { client } = useAuth();

  return (
    <div style={ui.page}>
      <h1 style={ui.title}>{event.event_name}</h1>
      <p style={ui.subtitle}>
        Event #{event.event_number ?? event.eventNumber} — {client?.name}
      </p>

      <div style={ui.card}>
        <div style={styles.row}>
          <strong>School:</strong> {event.school?.name || '—'}
        </div>

        <div style={styles.row}>
          <strong>Department:</strong> {event.department?.name || '—'}
        </div>

        <div style={styles.row}>
          <strong>Venue:</strong> {event.venue?.name || '—'}
        </div>

        <div style={styles.row}>
          <strong>Start:</strong>{' '}
          {event.start_at ? new Date(event.start_at).toLocaleString() : '—'}
        </div>

        <div style={styles.row}>
          <strong>End:</strong>{' '}
          {event.end_at ? new Date(event.end_at).toLocaleString() : '—'}
        </div>

        <div style={styles.row}>
          <strong>Total Tickets:</strong> {event.total_tickets}
        </div>

        <div style={styles.row}>
          <strong>Published:</strong> {event.published ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

const styles = {
  row: {
    marginBottom: '12px',
    fontSize: '16px',
    color: 'black',
  },
  loading: {
    padding: '20px',
    fontSize: '18px',
  },
  error: {
    padding: '20px',
    fontSize: '18px',
    color: 'red',
  },
};
