import { DEMO_MODE } from '../demo';
import { useAuth } from '../auth/useAuth';
import { ui } from '../styles/ui';

const adminTheme = {
  accent: '#991b1b',
};

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={ui.page}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={ui.title}>System Overview</h1>
        <p style={ui.subtitle}>
          Welcome back, {user?.name || 'Administrator'}. Here is what's
          happening across the platform.
        </p>
      </header>

      {/* Admin Stats (Client-style small cards) */}
      <div style={styles.cards}>
        <div style={ui.card}>
          <h3 style={styles.cardNumber}>12</h3>
          <p style={styles.cardLabel}>Total Clients</p>
        </div>

        <div style={ui.card}>
          <h3 style={styles.cardNumber}>48</h3>
          <p style={styles.cardLabel}>Active Events</p>
        </div>

        <div style={ui.card}>
          <h3 style={styles.cardNumber}>1,204</h3>
          <p style={styles.cardLabel}>Tickets Sold</p>
        </div>

        <div style={ui.card}>
          <h3 style={styles.cardNumber}>Healthy</h3>
          <p style={styles.cardLabel}>System Status</p>
        </div>
      </div>

      {/* Large Placeholder Card */}
      <div style={ui.cardLarge}>
        <div style={ui.cardLargeContent}>
          <i className="fa-solid fa-chart-line" style={ui.iconXLMuted}></i>
          <h3>Advanced Reporting Coming Soon</h3>
          <p>
            This area will eventually house client onboarding logs and detailed
            system telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

const styles = {
  cards: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
  },
  cardNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: adminTheme.accent,
    marginBottom: '6px',
  },
  cardLabel: {
    color: '#6b7a8c',
    fontWeight: 500,
  },
};
