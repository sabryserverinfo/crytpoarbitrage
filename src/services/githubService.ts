import type { User, Wallet, Plan, Transaction, Settings } from '../types';

// Accès via Netlify Functions (proxy GitHub). Aucune clé côté client.
const API_BASE = '/api';

// Fonction générique pour lire un fichier JSON via fonction Netlify
export const readJsonFile = async <T>(filename: string): Promise<T[]> => {
  try {
    const res = await fetch(`${API_BASE}/data?filename=${encodeURIComponent(filename)}`);
    if (!res.ok) {
      throw new Error(`Remote read failed: ${res.status}`);
    }
    const json = await res.json();
    return json as T[];
  } catch (error) {
    console.error(`Error reading ${filename} from Netlify API:`, error);
    // Fallback vers les données locales (sans double extension)
    try {
      const local = await import(`../../data/${filename}`);
      return (local as any).default as T[];
    } catch (e) {
      console.error(`Local fallback failed for ${filename}:`, e);
      return [] as T[];
    }
  }
};

// Fonction générique pour écrire un fichier JSON via fonction Netlify
export const writeJsonFile = async <T>(filename: string, data: T[]): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, data }),
    });
    if (!res.ok) {
      const msg = await res.text();
      console.error('Write failed:', msg);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error writing ${filename} via Netlify API:`, error);
    return false;
  }
};

// Services spécifiques
export const userService = {
  getAll: () => readJsonFile<User>('users.json'),
  create: async (user: User) => {
    const users = await readJsonFile<User>('users.json');
    users.push(user);
    return writeJsonFile('users.json', users);
  },
  update: async (userId: string, updates: Partial<User>) => {
    const users = await readJsonFile<User>('users.json');
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return writeJsonFile('users.json', users);
    }
    return false;
  },
  delete: async (userId: string) => {
    const users = await readJsonFile<User>('users.json');
    const filtered = users.filter(u => u.id !== userId);
    return writeJsonFile('users.json', filtered);
  },
};

export const walletService = {
  getAll: () => readJsonFile<Wallet>('wallets.json'),
  getByUserId: async (userId: string) => {
    const wallets = await readJsonFile<Wallet>('wallets.json');
    return wallets.filter(w => w.user_id === userId);
  },
  update: async (userId: string, asset: string, updates: Partial<Wallet>) => {
    const wallets = await readJsonFile<Wallet>('wallets.json');
    const index = wallets.findIndex(w => w.user_id === userId && w.asset === asset);
    if (index !== -1) {
      wallets[index] = { ...wallets[index], ...updates };
      return writeJsonFile('wallets.json', wallets);
    }
    return false;
  },
  create: async (wallet: Wallet) => {
    const wallets = await readJsonFile<Wallet>('wallets.json');
    wallets.push(wallet);
    return writeJsonFile('wallets.json', wallets);
  },
};

export const planService = {
  getAll: () => readJsonFile<Plan>('plans.json'),
  create: async (plan: Plan) => {
    const plans = await readJsonFile<Plan>('plans.json');
    plans.push(plan);
    return writeJsonFile('plans.json', plans);
  },
  update: async (planId: string, updates: Partial<Plan>) => {
    const plans = await readJsonFile<Plan>('plans.json');
    const index = plans.findIndex(p => p.id === planId);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates };
      return writeJsonFile('plans.json', plans);
    }
    return false;
  },
  delete: async (planId: string) => {
    const plans = await readJsonFile<Plan>('plans.json');
    const filtered = plans.filter(p => p.id !== planId);
    return writeJsonFile('plans.json', filtered);
  },
};

export const transactionService = {
  getAll: () => readJsonFile<Transaction>('transactions.json'),
  getByUserId: async (userId: string) => {
    const transactions = await readJsonFile<Transaction>('transactions.json');
    return transactions.filter(t => t.user_id === userId);
  },
  create: async (transaction: Transaction) => {
    const transactions = await readJsonFile<Transaction>('transactions.json');
    transactions.push(transaction);
    return writeJsonFile('transactions.json', transactions);
  },
  update: async (transactionId: string, updates: Partial<Transaction>) => {
    const transactions = await readJsonFile<Transaction>('transactions.json');
    const index = transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      return writeJsonFile('transactions.json', transactions);
    }
    return false;
  },
};

export const settingsService = {
  get: async (): Promise<Settings> => {
    const settings = await readJsonFile<Settings>('settings.json');
    return settings[0];
  },
  update: async (updates: Partial<Settings>) => {
    const settings = await readJsonFile<Settings>('settings.json');
    const updated = { ...settings[0], ...updates };
    return writeJsonFile('settings.json', [updated]);
  },
};
