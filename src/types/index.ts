export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface Wallet {
  user_id: string;
  asset: string;
  balance: number;
  deposit_address: string;
}

export interface Plan {
  id: string;
  name: string;
  asset: string;
  yield_percent: number;
  min_eur: number;
  max_eur: number;
  duration_months: number;
  description: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'INVEST' | 'PROFIT';
  asset: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  timestamp: string;
  description?: string;
  plan_id?: string;
  reason?: string;
}

export interface Settings {
  coingecko_api_key: string;
  cache_duration: number;
  supported_assets: string[];
  default_currency: string;
  app_name: string;
  version: string;
  maintenance_mode: boolean;
  features: {
    arbitrage_simulation: boolean;
    real_time_prices: boolean;
    admin_panel: boolean;
    user_registration: boolean;
  };
}

export interface CryptoPrice {
  asset_id: string;
  price: number;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalBalance: number;
  totalROI: number;
  pendingTransactions: number;
}

export interface UserStats {
  totalBalance: number;
  totalROI: number;
  activeInvestments: number;
  pendingTransactions: number;
}
