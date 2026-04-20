import { DEMO_MODE } from '../demo';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useAuth } from '../auth/useAuth';
import formatDate from '../utils/formatDate';
import { ui } from '../styles/ui';

const ClientEvents = () => {
  const { slug } = useParams();
  const { client, setClient, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiFetch(`/${slug}/events`);
        setEvents(data.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [slug, setClient]);

  if (loading) return <div>Loading...</div>;

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.start_at);
    const dateB = new Date(b.start_at);
    return ascending ? dateA - dateB : dateB - dateA;
  });

  return (
    <div style={ui.page}>
      <h1 style={ui.title}>{client?.name} Events</h1>
      <p style={ui.subtitle}>View all events</p>

      <button style={ui.iconButton} onClick={() => setAscending(!ascending)}>
        {ascending ? (
          <i className="fa-solid fa-arrow-down-wide-short"></i>
        ) : (
          <i className="fa-solid fa-arrow-up-wide-short"></i>
        )}
      </button>

      <div style={ui.card}>
        <div style={ui.tableHeader}>
          <div>EVENT NAME</div>
          <div>SCHOOL</div>
          <div>STATUS</div>
          <div>TICKET SALES</div>
          <div>EVENT DATE</div>
          <div style={{ textAlign: 'center' }}>ACTIONS</div>
        </div>

        {sortedEvents.map((event, index) => {
          // Determine whether the current user has event edit access
          // If not, provide a lock, rather than an edit icon
          const canEdit =
            user?.isPlatformAdmin || ['owner', 'official'].includes(user?.role);

          return (
            <div key={index} style={ui.tableRow}>
              <div>{event.event_name}</div>
              <div>{event.school?.name}</div>
              <StatusBadge event={event} />
              <div style={ui.center}>
                {event.tickets_sold ?? 0} / {event.total_tickets}
              </div>

              <div>{formatDate(event.start_at)}</div>

              {/* Dynamic Action Column */}
              <div style={ui.center}>
                {/* DEMO MODE: always show view-only eyeball */}
                {DEMO_MODE ? (
                  <Link
                    to={`/${slug}/events/${event.eventNumber}`}
                    style={ui.actionLink}
                    title="View Event (Demo Mode)"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </Link>
                ) : canEdit ? (
                  // Admin / Owner / Official > Edit link
                  <Link
                    to={`/${slug}/events/${event.eventNumber}/edit`}
                    style={ui.actionLink}
                    title="Edit Event"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                ) : user?.role === 'staff' ? (
                  // Staff > View details link
                  <Link
                    to={`/${slug}/events/${event.eventNumber}`}
                    style={ui.actionLink}
                    title="View Event Details"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </Link>
                ) : (
                  // Everyone else > Lock icon
                  <i
                    className="fa-solid fa-lock"
                    style={ui.icon}
                    title="No access"
                  ></i>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatusBadge = ({ event }) => {
  let label = event.published ? 'Active' : 'Paused';

  if (event.tickets_sold >= event.total_tickets) {
    label = 'Sold Out';
  }

  const colors = {
    Active: '#d1fae5',
    Paused: '#fef3c7',
    'Sold Out': '#fee2e2',
  };

  return (
    <div
      style={{
        background: colors[label] || '#eee',
        padding: '4px 8px',
        borderRadius: '4px',
      }}
    >
      {label}
    </div>
  );
};

export default ClientEvents;
