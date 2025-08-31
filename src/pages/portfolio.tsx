import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

import tokenHeaderIcon from "../assets/svg/token-header.svg";
import starIcon from "../assets/svg/star.svg";
import refreshIcon from "../assets/svg/cached.svg";

import {
  fetchTrending,
  refreshWatchlist,
  selectPortfolioTotal,
} from "../features/watchlist/watchlistSlice";
import { useAppSelector } from "../store/hook";
import { useAppDispatch } from "../store/hook";

import Header from "../components/common/Header";
import PortfolioCard from "../components/PortfolioCard";
import AppButton from "../components/common/AppButton";
import WatchlistTable from "../components/WatchlistTable";
import TokenModal from "../components/modal/TokenModal";
import WalletSection from "../components/WalletSection";

import useBreakpoints from "../hooks/useBreakpoints";
import { useAccount } from "wagmi";

const COLORS = [
  "#10B981",
  "#A78BFA",
  "#60A5FA",
  "#18C9DD",
  "#FB923C",
  "#FB7185",
];
const Portfolio = () => {
  const { isDesktop } = useBreakpoints();
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { trending, loading, error, lastUpdated } = useAppSelector(
    (state) => state.watchlist
  );
  const { address, isConnected } = useAccount();
  const tokens = useAppSelector((state) => state.watchlist.tokens);
  const portfolioTotal = useAppSelector(selectPortfolioTotal);

  const pieData = useMemo(() => {
    if (!tokens?.length) return [];

    const tokenValues = tokens.map((token, i) => {
      const holdings = token.holdings || 0;
      return {
        name: `${token.name} (${token.symbol})`,
        value: token.price * holdings,
        color: COLORS[i % COLORS.length],
      };
    });

    const total = tokenValues.reduce((sum, t) => sum + t.value, 0);

    return tokenValues.map((t) => ({
      ...t,
      value: total > 0 ? parseFloat(((t.value / total) * 100).toFixed(2)) : 0,
    }));
  }, [tokens]);

  useEffect(() => {
    dispatch(fetchTrending());
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      dispatch({ type: "watchlist/loadWatchlist", payload: { address } });
    }
  }, [isConnected, address, dispatch]);

  const handleRefresh = () => {
    dispatch(refreshWatchlist());
  };

  return (
    <Box>
      <Box sx={{ padding: "16px" }}>
        <Header
          icon={tokenHeaderIcon}
          title="Token Portfolio"
          actions={<WalletSection />}
        />
      </Box>
      <Box sx={{ marginTop: "20px", padding: "12px" }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={250} />
          </Box>
        ) : (
          <PortfolioCard
            total={portfolioTotal}
            lastUpdated={lastUpdated}
            data={pieData}
            isWalletConnected={isConnected}
          />
        )}
        <Box sx={{ mt: "20px" }}>
          <Header
            title="WatchList"
            icon={starIcon}
            actions={
              <>
                <AppButton
                  label={isDesktop ? "Refresh" : ""}
                  icon={refreshIcon}
                  border="10px"
                  bgColor="#27272A"
                  textColor="#ffffff"
                  onClick={handleRefresh}
                />

                <AppButton
                  label="+ Add Token"
                  border="10px"
                  onClick={() => {
                    setOpen(true);
                  }}
                  textColor="black"
                />
              </>
            }
          />
        </Box>
        <Box sx={{ mb: "10px" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <WatchlistTable
              walletAddress={address}
              isWalletConnected={isConnected}
            />
          )}
        </Box>
        <TokenModal
          open={open}
          loading={loading}
          error={error}
          walletAddress={address}
          onClose={() => setOpen(false)}
          allTokens={trending}
        />
      </Box>
    </Box>
  );
};

export default Portfolio;
