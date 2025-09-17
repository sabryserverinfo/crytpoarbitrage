import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import { Button } from './ui/button';
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
    <div className="min-h-screen bg-gray-900" style={{
      background: `
        radial-gradient(ellipse at top, rgba(247, 147, 26, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(98, 126, 234, 0.1) 0%, transparent 50%),
        #0a0b0d
      `
    }}>
      
      {/* Modern Crypto Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 crypto-panel border-b border-orange-500/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">₿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CryptoArb</h1>
              <p className="text-xs text-orange-400">Trading Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-lg crypto-card hover:border-orange-500 transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
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

      {/* Modern Crypto Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 crypto-panel border-r border-orange-500/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Professional Crypto Logo */}
          <div className="flex items-center space-x-4 p-6 border-b border-orange-500/20">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">₿</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">CryptoArb</span>
              <p className="text-xs text-gray-400 font-medium">Professional Trading</p>
            </div>
          </div>

          {/* Enhanced User Info */}
          <div className="p-4 border-b border-orange-500/20">
            <div className="crypto-card p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{user?.name}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                    isAdmin 
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                      : 'bg-green-500/20 border border-green-500/30 text-green-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isAdmin ? 'bg-red-400' : 'bg-green-400'}`}></div>
                    {isAdmin ? 'Administrator' : 'Trader'}
                  </span>
                </div>
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
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'crypto-glow text-white font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 crypto-card'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-orange-500 text-white shadow-lg' 
                          : 'bg-gray-700 text-gray-400 group-hover:bg-orange-500/20 group-hover:text-orange-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Enhanced Logout */}
          <div className="p-4 border-t border-orange-500/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl crypto-card hover:border-red-500/50 hover:bg-red-500/10 transition-all group"
            >
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-400 group-hover:text-white">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        <main className="p-6 lg:p-8 pt-24 lg:pt-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
