import React, { useState } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store";
import { addToken } from "../../features/watchlist/watchlistSlice";

import {
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Radio,
  Divider,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";

import useBreakpoints from "../../hooks/useBreakpoints";

import AppTypography from "../common/AppTypography";
import AppButton from "../common/AppButton";

interface TokenModalProps {
  open: boolean;
  onClose: () => void;
  allTokens?: any;
  loading: boolean;
  error: string | null;
  walletAddress: string | undefined;
}

const TokenModal: React.FC<TokenModalProps> = ({
  open,
  onClose,
  allTokens = [],
  loading,
  error,
  walletAddress,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const { isMobile } = useBreakpoints();

  const filteredTokens = allTokens?.filter(
    (t: { name: string; symbol: string }) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (selectedTokens.length > 0) {
      setLoadingSave(true);
      selectedTokens.forEach((tokenId) => {
        const token = allTokens.find((t: { id: string }) => t.id === tokenId);
        if (token) {
          dispatch(
            addToken({
              token: { ...token, holdings: 0 },
              address: walletAddress,
            })
          );
        }
      });
      setTimeout(() => {
        setLoadingSave(false);
        setSelectedTokens([]);
        setSearch("");
        onClose();
      }, 1000);
    } else {
      onClose();
    }
  };

  const toggleToken = (tokenId: string) => {
    setSelectedTokens((prev) =>
      prev.includes(tokenId)
        ? prev.filter((id) => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          height: isMobile ? "100%" : "80vh",
          backgroundColor: "#212124",
          border: "1px solid #212124D9",
        },
      }}
    >
      {/* Search + List */}
      <DialogContent
        dividers
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          //   p: 2,
          p: 0,
        }}
      >
        {/* Fixed Search Field */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            borderBottom: "1px solid #71717A",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search tokens (e.g., ETH, SOL)..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              sx: {
                p: "10px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& input::placeholder": {
                  color: "gray",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Trending label */}
        <AppTypography
          variant="subtitle"
          color="#71717A"
          sx={{ ml: "10px", p: "10px" }}
        >
          Trending
        </AppTypography>
        <Divider sx={{ mb: 1 }} />

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",

            "&::-webkit-scrollbar": {
              width: 0, //removed scrollbar space
              background: "transparent",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {loading ? (
            <CircularProgress sx={{ color: "#A9E851" }} />
          ) : error ? (
            <AppTypography variant="body" color="red">
              {error}
            </AppTypography>
          ) : (
            <List disablePadding>
              {filteredTokens.map((token: any) => {
                const isSelected = selectedTokens.includes(token.id);

                return (
                  <ListItem
                    key={token.id}
                    secondaryAction={
                      isSelected ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            width: "77px",
                          }}
                        >
                          <StarIcon sx={{ color: "#A9E851" }} />

                          <CheckCircleIcon sx={{ color: "#A9E851" }} />
                        </Box>
                      ) : (
                        <Radio
                          checked={isSelected}
                          onChange={() => toggleToken(token.id)}
                          sx={{
                            color: "gray",
                            "&.Mui-checked": { color: "#A9E851" },
                          }}
                        />
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={token.image} alt={token.name} />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <span
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <AppTypography
                            variant="subtitle"
                            sx={{ color: "#ffffff" }}
                          >
                            {token.name}
                          </AppTypography>
                          <AppTypography
                            variant="body"
                            sx={{ color: "#ffffff" }}
                          >
                            {`(${token.symbol.toUpperCase()})`}
                          </AppTypography>
                        </span>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>

      {/* Fixed Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#27272A",
        }}
      >
        {isMobile && (
          <AppButton
            label="Cancel"
            onClick={onClose}
            border="10px"
            bgColor="#52525B"
          />
        )}

        <AppButton
          label={
            loadingSave ? (
              <CircularProgress size={18} sx={{ color: "#52525B" }} />
            ) : (
              "Add to Wishlist"
            )
          }
          bgColor="#A9E851"
          disabled={selectedTokens?.length === 0 || loadingSave}
          border="10px"
          onClick={handleSave}
        />
      </Box>
    </Dialog>
  );
};

export default TokenModal;
