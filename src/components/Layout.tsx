import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { 
  User, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut,
  Users,
  CreditCard,
  History,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clientNavItems = [
    { path: '/clients/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/clients/plans', label: 'Plans', icon: CreditCard },
    { path: '/clients/wallets', label: 'Portefeuilles', icon: Wallet },
    { path: '/clients/transactions', label: 'Transactions', icon: History },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'Utilisateurs', icon: Users },
    { path: '/admin/plans', label: 'Plans', icon: CreditCard },
    { path: '/admin/wallets', label: 'Portefeuilles', icon: Wallet },
    { path: '/admin/transactions', label: 'Transactions', icon: History },
    { path: '/admin/settings', label: 'Paramètres', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : clientNavItems;

  return (
    <div className="min-h-screen bg-gray-50">{/* ProRealTime Clean Background */}
      
      {/* ProRealTime Style Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">CryptoArb</h1>
              <p className="text-xs text-gray-500">Trading Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ProRealTime Style Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">CA</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">CryptoArb</span>
              <p className="text-xs text-gray-500 font-medium">Trading Platform</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                  isAdmin 
                    ? 'bg-red-50 border border-red-200 text-red-700' 
                    : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  {isAdmin ? 'Admin' : 'Client'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover-ring ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-500/15 to-blue-500/10 text-primary-300 border border-primary-500/30 elevate-glow'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-dark-700/60">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-dark-700/60"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-6 pt-20 lg:pt-6 container-page">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
