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
import logoUrl from '../assets/crypto-logo.svg?url';

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
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 panel-glass border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">CryptoArb</h1>
              <p className="text-xs text-gray-400">Trading Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-xl panel hover-ring transition-all duration-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 panel border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl elevate-glow">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-gradient-primary tracking-tight">CryptoArb</span>
              <p className="text-xs text-gray-400 font-medium">Trading Platform</p>
            </div>
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
