import { DEMO_MODE } from '../demo';
import { useAuth } from '../auth/useAuth';
import { ui } from '../styles/ui';

const ClientDashboard = () => {
  const { client } = useAuth();

  return (
    <div style={ui.page}>
      <h1 style={ui.title}>{client?.name} Dashboard</h1>
      <p style={ui.subtitle}>Overview of your activity</p>

      <div style={styles.cards}>
        <div style={ui.card}>
          <h3 style={styles.cardNumber}>12</h3>
          <p style={styles.cardLabel}>Total Events</p>
        </div>

        <div style={ui.card}>
          <h3 style={styles.cardNumber}>1,240</h3>
          <p style={styles.cardLabel}>Tickets Sold</p>
        </div>

        <div style={ui.card}>
          <h3 style={styles.cardNumber}>$18,920</h3>
          <p style={styles.cardLabel}>Total Revenue</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

const styles = {
  cards: {
    display: 'flex',
    gap: '20px',
  },
  cardNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#3a5a78',
    marginBottom: '6px',
  },
  cardLabel: {
    color: '#6b7a8c',
    fontWeight: 500,
  },
};
