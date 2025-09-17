import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { 
  TrendingUp, 
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
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-900 to-[#0E132A]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-800 border-b border-dark-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Crypto-Arbitrage</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-800/80 backdrop-blur-sm border-r border-dark-700/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b border-dark-700/60">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Crypto-Arbitrage</span>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-dark-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  isAdmin 
                    ? 'bg-red-500/15 border border-red-500/20 text-red-400' 
                    : 'bg-green-500/15 border border-green-500/20 text-green-400'
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
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30 shadow-sm'
                          : 'text-gray-300 hover:bg-dark-700/60 hover:text-white'
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
        <main className="p-4 lg:p-6 pt-20 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
