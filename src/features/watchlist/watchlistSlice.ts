import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store/index";

import api from "../../api/axios";

import { getFormattedTime } from "../../utils/formatTime";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  holdings: number;
  sparkline: number[];
  image: string;
  lastUpdated: string;
}

interface WatchlistState {
  trending: Token[];
  searchResults: { id: string; name: string; symbol: string; image: string }[];
  tokens: Token[];
  loading: boolean;
  lastUpdated?: string;
  error: string | null;
}

// Loading watchlist from localStorage for a specific user
const loadState = (): WatchlistState => {
  // const key = `watchlist_${address}`;

  //  Temporarily disabling the address check (not required now)
  // if (!address) {
  //   return {
  //     tokens: [],
  //     trending: [],
  //     searchResults: [],
  //     loading: false,
  //     error: null,
  //   };
  // }
  const key = "watchlist";
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        tokens: parsed.tokens || [],
        trending: [],
        searchResults: [],
        loading: false,
        error: null,
      };
    }
  } catch (err) {
    console.error("Error loading watchlist:", err);
  }

  return {
    tokens: [],
    trending: [],
    searchResults: [],
    loading: false,
    error: null,
  };
};

const saveState = (state: WatchlistState) => {
  const key = "watchlist";
  // not required as of now
  // if (!address) return;
  try {
    localStorage.setItem(key, JSON.stringify({ tokens: state.tokens }));
  } catch (err) {
    console.error("Error saving watchlist:", err);
  }
};

// ---- Thunks ----

// Fetch top trending tokens for modal
export const fetchTrending = createAsyncThunk(
  "watchlist/fetchTrending",
  async () => {
    const response: any = await api.get("/search/trending", {});

    return response.data.coins?.map((c: any) => ({
      id: c.item.coin_id,
      name: c.item.name,
      sparkline: c.item.data.sparkline,
      symbol: c.item.symbol,
      price: c.item.data.price,
      change24h: c.item.data.price_change_percentage_24h.usd,
      holdings: 0,
      image: c.item.small,
    }));
  }
);

// This api is not giving the desired result means it is not giving other required keys like "sparkline", "price";
// export const searchTokens = createAsyncThunk(
//   "watchlist/searchTokens",
//   async (query: string) => {
//     if (!query.trim()) return [];
//     const res = api.get(`v3/search?query=${query}`);
//     return (await res).data.coins.map((c: any) => ({
//       id: c.id,
//       name: c.name,
//       symbol: c.symbol,
//       image: c.large,
//     }));
//   }
// );

// Refresh watchlist prices
export const refreshWatchlist = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("watchlist/refreshWatchlist", async (_arg, { getState, dispatch }) => {
  const names = getState().watchlist.tokens.map((t) => t.name);

  if (names.length === 0) return;

  const response = await api.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      names: names.join(","),
    },
  });

  response.data.forEach((c: any) => {
    dispatch(
      updateTokenPrices({
        id: c.id,
        name: c.name,
        sparkline: c.sparkline_in_7d.price,
        symbol: c.symbol,
        price: c.current_price,
        change24h: c.price_change_percentage_24h,
        holdings: 0,
        image: c.image,
      })
    );
  });
});

const initialState: WatchlistState = loadState();

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToken: (
      state,
      action: PayloadAction<{ token: Token; address?: string }>
    ) => {
      if (!state.tokens.find((t) => t.id === action.payload.token.id)) {
        state.tokens.push({
          ...action.payload.token,
          holdings: action.payload.token.holdings ?? 0,
        });
        saveState(state);
      }
    },
    removeToken: (
      state,
      action: PayloadAction<{ id: string; address?: string }>
    ) => {
      state.tokens = state.tokens.filter((t) => t.id !== action.payload.id);
      saveState(state);
    },
    updateHoldings: (
      state,
      action: PayloadAction<{ id: string; holdings: number; address?: string }>
    ) => {
      const token = state.tokens.find((t) => t.id === action.payload.id);
      if (token) {
        token.holdings = action.payload.holdings;
        saveState(state);
      }
    },
    updateTokenPrices: (
      state,
      action: PayloadAction<Partial<Token> & { id: string }>
    ) => {
      const token = state.tokens.find((t) => t.id === action.payload.id);
      if (token) {
        if (action.payload.price !== undefined) {
          token.price = action.payload.price;
        }
        if (action.payload.change24h !== undefined) {
          token.change24h = action.payload.change24h;
        }
        if (action.payload.image !== undefined) {
          token.image = action.payload.image;
        }
        if (action.payload.name !== undefined) {
          token.name = action.payload.name;
        }
        saveState(state);
      }
    },
    setSearchResults: (
      state,
      action: PayloadAction<
        { id: string; name: string; symbol: string; image: string }[]
      >
    ) => {
      state.searchResults = action.payload;
    },
    loadWatchlist: (state) => {
      const loaded = loadState();
      state.tokens = loaded.tokens;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all tokens
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
        state.lastUpdated = getFormattedTime();
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tokens";
      })

      // Refresh watchlist
      .addCase(refreshWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastUpdated = getFormattedTime();
      })
      .addCase(refreshWatchlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refreshWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to refresh watchlist";
      });
  },
});

export const { addToken, removeToken, updateHoldings, updateTokenPrices } =
  watchlistSlice.actions;

// ---- Selectors ----
export const selectPortfolioTotal = (state: RootState) =>
  state.watchlist.tokens.reduce((sum, t) => sum + t.holdings * t.price, 0);

export default watchlistSlice.reducer;
