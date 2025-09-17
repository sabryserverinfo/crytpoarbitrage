import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientPlans from './pages/client/ClientPlans';
import ClientWallets from './pages/client/ClientWallets';
import ClientTransactions from './pages/client/ClientTransactions';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminWallets from './pages/admin/AdminWallets';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <ClientDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Client routes */}
          <Route path="/clients/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <ClientDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/clients/plans" element={
            <ProtectedRoute>
              <Layout>
                <ClientPlans />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/clients/wallets" element={
            <ProtectedRoute>
              <Layout>
                <ClientWallets />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/clients/transactions" element={
            <ProtectedRoute>
              <Layout>
                <ClientTransactions />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/plans" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminPlans />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/wallets" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminWallets />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/transactions" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminTransactions />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/settings" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminSettings />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
