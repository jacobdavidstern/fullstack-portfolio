import { DEMO_MODE } from '../demo';
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { ui } from '../styles/ui';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Demo Mode redirect
  useEffect(() => {
    if (DEMO_MODE) {
      navigate('/summit');
    }
  }, [navigate]);

  if (DEMO_MODE) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data);

      const { user } = data;

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate(`/${user.client.slug}/events`);
      } else {
        navigate(`/${user.client.slug}`);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={ui.loginPage}>
      <div style={ui.loginCard}>
        <div style={ui.rowBetween}>
          <h2 style={{ margin: 0 }}>Secure Login</h2>
          <h2 style={{ margin: 0 }}>TicketFire 🔥</h2>
        </div>

        <form onSubmit={handleSubmit} style={ui.formColumn}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              ...ui.button,
              background: '#007bff',
              color: 'white',
              width: '40%',
              marginTop: '10px',
            }}
          >
            Sign In
          </button>

          <div style={styles.forgot}>Forgot Password?</div>

          <hr />

          <div style={styles.footer}>TICKETFIRE — SECURE ACCESS</div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  button: {
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    width: '40%',
  },
  forgot: {
    fontSize: '0.9rem',
    color: '#007bff',
    cursor: 'pointer',
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: '0.8rem',
    letterSpacing: '1px',
  },
};

export default Login;
