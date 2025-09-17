// Service CoinGecko pour les prix crypto
const COINGECKO_API_KEY = 'CG-5HJFKZxRNBnbs67jZByrkzVH';
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache simple pour éviter trop d'appels API
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_DURATION = 60000; // 60 secondes

// Mapping des assets vers les IDs CoinGecko
const ASSET_TO_COINGECKO_ID: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'USDC': 'usd-coin',
};

export const coinapiService = {
  // Récupérer le prix d'une crypto en EUR
  getPrice: async (asset: string): Promise<number> => {
    const cacheKey = `${asset}_EUR`;
    const cached = priceCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    try {
      const coinGeckoId = ASSET_TO_COINGECKO_ID[asset];
      if (!coinGeckoId) {
        console.warn(`Asset ${asset} non supporté par CoinGecko`);
        return getDefaultPrice(asset);
      }

      const response = await fetch(
        `${BASE_URL}/simple/price?ids=${coinGeckoId}&vs_currencies=eur&x_cg_demo_api_key=${COINGECKO_API_KEY}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch price for ${asset}: ${response.status}`);
      }

      const data = await response.json();
      const price = data[coinGeckoId]?.eur;

      if (price === undefined) {
        throw new Error(`Price not found for ${asset}`);
      }

      // Mettre en cache
      priceCache.set(cacheKey, {
        price,
        timestamp: Date.now(),
      });

      return price;
    } catch (error) {
      console.error(`Error fetching price for ${asset}:`, error);
      // Retourner un prix par défaut en cas d'erreur
      return getDefaultPrice(asset);
    }
  },

  // Récupérer les prix de plusieurs cryptos
  getPrices: async (assets: string[]): Promise<Record<string, number>> => {
    const prices: Record<string, number> = {};
    const now = Date.now();

    // Vérifier le cache pour tous les assets
    const uncachedAssets: string[] = [];
    for (const asset of assets) {
      const cacheKey = `${asset}_EUR`;
      const cached = priceCache.get(cacheKey);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        prices[asset] = cached.price;
      } else {
        uncachedAssets.push(asset);
      }
    }

    // Si tous les prix sont en cache, retourner directement
    if (uncachedAssets.length === 0) {
      return prices;
    }

    try {
      // Construire la liste des IDs CoinGecko
      const coinGeckoIds = uncachedAssets
        .map(asset => ASSET_TO_COINGECKO_ID[asset])
        .filter(Boolean);

      if (coinGeckoIds.length === 0) {
        // Si aucun ID valide, utiliser les prix par défaut
        for (const asset of uncachedAssets) {
          prices[asset] = getDefaultPrice(asset);
        }
        return prices;
      }

      // Appel API CoinGecko
      const ids = coinGeckoIds.join(',');
      const response = await fetch(
        `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=eur&x_cg_demo_api_key=${COINGECKO_API_KEY}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Traiter les résultats
        for (const asset of uncachedAssets) {
          const coinGeckoId = ASSET_TO_COINGECKO_ID[asset];
          if (coinGeckoId && data[coinGeckoId] && data[coinGeckoId].eur) {
            const price = data[coinGeckoId].eur;
            // Mettre en cache
            const cacheKey = `${asset}_EUR`;
            priceCache.set(cacheKey, { price, timestamp: now });
            prices[asset] = price;
          } else {
            // Utiliser une valeur par défaut
            prices[asset] = getDefaultPrice(asset);
          }
        }
      } else {
        console.error('Erreur API CoinGecko:', response.status);
        // Utiliser les prix par défaut
        for (const asset of uncachedAssets) {
          prices[asset] = getDefaultPrice(asset);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des prix CoinGecko:', error);
      // Utiliser les prix par défaut
      for (const asset of uncachedAssets) {
        prices[asset] = getDefaultPrice(asset);
      }
    }

    return prices;
  },

  // Convertir un montant d'une crypto vers EUR
  convertToEUR: async (amount: number, asset: string): Promise<number> => {
    const price = await coinapiService.getPrice(asset);
    return amount * price;
  },

  // Convertir un montant EUR vers une crypto
  convertFromEUR: async (amountEUR: number, asset: string): Promise<number> => {
    const price = await coinapiService.getPrice(asset);
    return amountEUR / price;
  },

  // Calculer le ROI d'un investissement
  calculateROI: async (investedAmount: number, _asset: string, yieldPercent: number, durationMonths: number): Promise<number> => {
    const monthlyYield = yieldPercent / 100 / 12;
    const totalYield = monthlyYield * durationMonths;
    return investedAmount * totalYield;
  },

  // Nettoyer le cache
  clearCache: () => {
    priceCache.clear();
  },
};

// Prix par défaut en cas d'erreur API
const getDefaultPrice = (asset: string): number => {
  const defaultPrices: Record<string, number> = {
    'BTC': 45000,
    'ETH': 3000,
    'USDT': 0.92,
    'USDC': 0.92,
  };
  return defaultPrices[asset] || 1;
};