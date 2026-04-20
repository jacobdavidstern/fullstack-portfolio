import { DEMO_MODE } from '../demo';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { apiFetch } from '../api/api';
import { ui } from '../styles/ui';

const EditEvent = () => {
  const { client } = useAuth();
  const { eventNumber } = useParams();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    name: '',
    school: '',
    department: '',
    venue: '',
    start_at: '',
    end_at: '',
    total_tickets: '',
    published: true,
  });

  // Dropdowns
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [venues, setVenues] = useState([]);

  // Load event + dropdowns
  useEffect(() => {
    if (!client?.slug || !eventNumber) return;

    const load = async () => {
      try {
        // Fetch event
        const event = await apiFetch(`/${client.slug}/events/${eventNumber}`);

        // Fetch dropdowns
        const [sData, dData, vData] = await Promise.all([
          apiFetch(`/${client.slug}/schools`),
          apiFetch(`/${client.slug}/departments`),
          apiFetch(`/${client.slug}/venues`),
        ]);

        setSchools(sData);
        setDepartments(dData);
        setVenues(vData);

        // Populate form
        setForm({
          name: event.event_name ?? '',
          school: event.school?._id ?? '',
          department: event.department?._id ?? '',
          venue: event.venue?._id ?? '',
          start_at: event.start_at ? event.start_at.slice(0, 16) : '',
          end_at: event.end_at ? event.end_at.slice(0, 16) : '',
          total_tickets:
            event.total_tickets != null ? String(event.total_tickets) : '',
          published: event.published ?? true,
        });
      } catch (err) {
        console.error('Failed to load event:', err);
      }
    };

    load();
  }, [client?.slug, eventNumber]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save event (PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const toLocalISO = (value) => {
      const date = new Date(value);
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date - tzOffset).toISOString();
    };

    const start = new Date(form.start_at);
    const end = new Date(form.end_at);

    if (end <= start) {
      alert('End time must be after start time.');
      return;
    }

    try {
      await apiFetch(`/${client.slug}/events/${eventNumber}`, {
        method: 'PATCH',
        body: JSON.stringify({
          event_name: form.name,
          school: form.school,
          department: form.department,
          venue: form.venue,
          start_at: toLocalISO(form.start_at),
          end_at: toLocalISO(form.end_at),
          total_tickets: Number(form.total_tickets),
          published: form.published,
        }),
      });

      navigate(`/${client.slug}/events`);
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  return (
    <div style={ui.page}>
      <h1 style={ui.title}>Edit Event</h1>
      <p style={ui.subtitle}>{client?.name}</p>

      <div style={ui.card}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>Event Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label style={styles.label}>School</label>
          <select
            style={styles.input}
            name="school"
            value={form.school}
            onChange={handleChange}
          >
            <option value="">Select school...</option>
            {schools.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <label style={styles.label}>Department</label>
          <select
            style={styles.input}
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select department...</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <label style={styles.label}>Venue</label>
          <select
            style={styles.input}
            name="venue"
            value={form.venue}
            onChange={handleChange}
          >
            <option value="">Select venue...</option>
            {venues.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>

          <label style={styles.label}>Start Date</label>
          <input
            style={styles.input}
            type="datetime-local"
            name="start_at"
            value={form.start_at}
            onChange={handleChange}
          />

          <label style={styles.label}>End Date</label>
          <input
            style={styles.input}
            type="datetime-local"
            name="end_at"
            value={form.end_at}
            onChange={handleChange}
          />

          <label style={styles.label}>Total Tickets</label>
          <input
            style={styles.input}
            type="number"
            name="total_tickets"
            value={form.total_tickets}
            onChange={handleChange}
          />

          <label style={styles.label}>
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
            />
            Published
          </label>

          <button style={styles.submit}>Save Event</button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontWeight: 600,
    color: '#3a5a78',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  submit: {
    marginTop: '10px',
    background: '#3a5a78',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};
