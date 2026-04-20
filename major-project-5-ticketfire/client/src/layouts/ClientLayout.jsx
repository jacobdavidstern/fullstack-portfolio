import { DEMO_MODE } from '../demo';
import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { apiFetch } from '../api/api';
import { ui } from '../styles/ui';
import { useParams } from 'react-router-dom';

const ClientLayout = () => {
  const { user, client, setClient, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams(); // Extract slug from route params

  // Client Preload
  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await apiFetch(`/${slug}`);
        setClient(data);
      } catch (err) {
        console.error('Failed to load client:', err);
      }
    };

    loadClient();
  }, [slug, setClient]);

  // Determine which sidebar item should be highlighted
  const section = location.pathname.split('/')[2];
  const activeSection = section === 'events' ? 'events' : 'dashboard';

  // Use the user's name as a fallback so it's snappy on first render
  const displayName = client?.name || user?.name || 'Loading...';

  // Redirect if URL slug doesn't match authenticated client's slug
  useEffect(() => {
    if (!client) return; // still loading auth

    if (slug !== client.slug) {
      navigate(`/${client.slug}`, { replace: true });
    }
  }, [client, slug, navigate]);

  // New Event only in real mode
  const handleNewEvent = async () => {
    if (DEMO_MODE) {
      alert('Demo Mode: Creating new events is disabled.');
      return;
    }

    try {
      const data = await apiFetch(`/${client.slug}/events`, {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const eventNumber = data.eventNumbers?.[0];

      if (eventNumber) {
        navigate(`/${client.slug}/events/${eventNumber}/edit`);
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  // Prevent rendering until client is loaded
  if (!client) return <div>Loading...</div>;

  return (
    <div style={ui.container}>
      <aside style={styles.sidebar}>
        <div style={ui.navGroup}>
          <div style={styles.clientName}>{displayName}</div>

          <Link
            to={`/${client?.slug}`}
            style={{
              ...ui.navLink,
              ...(activeSection === 'dashboard' ? ui.navLinkActive : {}),
            }}
          >
            <i className="fa-solid fa-gauge" style={ui.icon}></i> Dashboard
          </Link>

          <Link
            to={`/${client?.slug}/events`}
            style={{
              ...ui.navLink,
              ...(activeSection === 'events' ? ui.navLinkActive : {}),
            }}
          >
            <i className="fa-solid fa-ticket" style={ui.icon}></i> Events
          </Link>

          <button
            onClick={handleNewEvent}
            style={{
              ...ui.navLink,
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-square-plus" style={ui.icon}></i>
            New Event
          </button>
        </div>

        <button onClick={logout} style={styles.signOut}>
          <i className="fa-solid fa-right-from-bracket" style={ui.icon}></i>
          Sign Out
        </button>
      </aside>

      <div style={ui.main}>
        <header style={styles.header}>
          <h3>{displayName} Portal</h3>
          <h3 style={{ color: '#3A5A78' }}>TicketFire 🔥</h3>
        </header>
        <div style={ui.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;

const styles = {
  sidebar: {
    width: '240px',
    minWidth: '240px',
    maxWidth: '240px',
    background: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #ddd',
  },
  header: {
    height: '60px',
    display: 'flex',
    color: '#3a5a78',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    borderBottom: '1px solid #ddd',
  },
  clientName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '20px',
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#2d3748',
  },
  signOut: {
    fontSize: '1rem',
    marginTop: 'auto',
    background: 'transparent',
    border: 'none',
    color: '#e53e3e',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '8px 12px',
  },
};
