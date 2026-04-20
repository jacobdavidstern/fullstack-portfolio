import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ClientEvents from './pages/ClientEvents';
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvent';
import EventDetailsWrapper from './pages/EventDetailsWrapper';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin world */}
          <Route path="/admin/*" element={<ProtectedRoute adminOnly />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Client world */}
          <Route path="/:slug/*" element={<ProtectedRoute />}>
            <Route element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="events" element={<ClientEvents />} />
              <Route
                path="events/:eventNumber"
                element={<EventDetailsWrapper />}
              />
              <Route path="events/:eventNumber/edit" element={<EditEvent />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
