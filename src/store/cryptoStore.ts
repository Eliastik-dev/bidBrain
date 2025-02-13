import { create } from 'zustand';
import axios from 'axios';
import type { CryptoAsset } from '../types';

interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
  selectedTimeframe: '1h' | '24h' | '7d' | '30d';
  fetchAssets: () => Promise<void>;
  fetchPriceHistory: (id: string) => Promise<any>;
  setTimeframe: (timeframe: '1h' | '24h' | '7d' | '30d') => void;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  assets: [],
  loading: false,
  error: null,
  selectedTimeframe: '24h',
  setTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  fetchAssets: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'eur',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        }
      );
      set({ assets: response.data, loading: false, error: null });
    } catch (error) {
      set({ error: 'Erreur lors de la récupération des cryptos', loading: false });
    }
  },
  fetchPriceHistory: async (id: string) => {
    const timeframe = get().selectedTimeframe;
    const days = timeframe === '1h' ? 1 : timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: 'eur',
            days: days,
            interval: timeframe === '1h' ? 'hourly' : 'daily',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des prix:', error);
      return null;
    }
  },
}));