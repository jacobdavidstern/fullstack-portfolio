import { DEMO_MODE } from '../demo';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ui } from '../styles/ui';

const adminTheme = {
  sidebarBg: '#fef2f2',
  headerBg: '#fef2f2',
  accent: '#991b1b',
  signOut: '#b91c1c',
};

const AdminLayout = () => {
  const { logout, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={ui.loading}>Loading Admin Profile...</div>;

  return (
    <div style={ui.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={ui.navGroup}>
          <div style={styles.userName}>System Admin</div>

          <Link
            to="/admin"
            style={{
              ...ui.navLink,
              color: adminTheme.accent,
              ...(location.pathname === '/admin'
                ? styles.navLinkActiveAdmin
                : {}),
            }}
          >
            <i className="fa-solid fa-gauge" style={ui.icon}></i>
            Dashboard
          </Link>
        </div>

        <button onClick={logout} style={styles.signOut}>
          <i className="fa-solid fa-right-from-bracket" style={ui.icon}></i>
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <div style={ui.main}>
        <header style={styles.header}>
          <h3>Platform Control</h3>
          <h3>TicketFire 🔥</h3>
        </header>

        <div style={ui.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

const styles = {
  sidebar: {
    width: '240px',
    minWidth: '240px',
    maxWidth: '240px',
    background: adminTheme.sidebarBg,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #ddd',
  },

  header: {
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    borderBottom: '1px solid #ddd',
    background: adminTheme.headerBg,
    color: adminTheme.accent,
  },

  userName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '20px',
    fontWeight: 700,
    fontSize: '1.1rem',
    color: adminTheme.accent,
  },

  signOut: {
    fontSize: '1rem',
    marginTop: 'auto',
    background: 'transparent',
    border: 'none',
    color: adminTheme.signOut,
    cursor: 'pointer',
    textAlign: 'left',
    padding: '8px 12px',
  },

  navLinkActiveAdmin: {
    fontWeight: 600,
    border: `1.5px solid ${adminTheme.accent}`,
    background: 'transparent',
  },
};
