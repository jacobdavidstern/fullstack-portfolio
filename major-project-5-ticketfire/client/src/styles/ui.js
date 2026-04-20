import { theme } from './theme';

export const ui = {
  // Layout
  page: {
    background: '#f5f7fa',
    minHeight: '100vh',
    padding: '20px 30px',
  },
  container: {
    display: 'flex',
    height: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  loginPage: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fa',
  },

  // Typography
  title: {
    color: theme.colors.primary,
    fontSize: '28px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  subtitle: {
    color: theme.colors.subtitle,
    fontWeight: 600,
    marginBottom: '20px',
  },

  // Cards
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardLarge: {
    background: '#fff',
    borderRadius: '12px',
    padding: '60px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    color: '#3a5a78',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '600px',
  },
  cardLargeContent: {
    maxWidth: '400px',
  },
  loginCard: {
    width: '300px',
    height: '500px',
    background: 'white',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    color: '#343a40',
    flexDirection: 'column',
  },

  // Navigation
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navLink: {
    fontSize: '1rem',
    color: '#4a5568',
    textDecoration: 'none',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '6px',
  },
  navLinkActive: {
    background: '#3A5A78',
    color: 'white',
    fontWeight: 600,
  },
  icon: {
    marginRight: '8px',
  },

  // Tables
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '3.5fr 1.2fr 0.6fr 1.2fr 1.2fr 0.5fr',
    fontWeight: 600,
    color: '#3A5A78',
    borderBottom: '2px solid #E2E8F0',
    paddingBottom: '12px',
    marginBottom: '12px',
    fontSize: '14px',
    letterSpacing: '0.5px',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '3.5fr 1.2fr 0.6fr 1.2fr 1.2fr 0.5fr',
    fontWeight: 500,
    padding: '14px 0',
    borderBottom: '1px solid #EDF2F7',
    fontSize: '15px',
    color: '#2D3748',
    alignItems: 'center',
  },

  // Forms
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    flex: 1,
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
  },

  // Utilities
  rowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '50px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconXLMuted: {
    fontSize: '3rem',
    color: '#cbd5e0',
    marginBottom: '20px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#3A5A78',
    fontSize: '18px',
    marginBottom: '10px',
  },
};
