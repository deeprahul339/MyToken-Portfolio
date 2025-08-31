import React, { useState } from "react";

import type { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hook";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  Box,
} from "@mui/material";

import {
  removeToken,
  updateHoldings,
} from "../features/watchlist/watchlistSlice";

import AppPagination from "./common/AppPagination";
import ActionMenu from "./common/ActionMenu";
import TokenRow from "./TokenRow";
import AppTypography from "./common/AppTypography";

interface WatchListTableProps {
  isWalletConnected: boolean;
  walletAddress: string | undefined;
}

const WatchlistTable: React.FC<WatchListTableProps> = ({
  isWalletConnected,
  walletAddress,
}) => {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector((state: RootState) => state.watchlist.tokens);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedToken, setSelectedToken] = useState<any>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleHoldings = (token: { id: any }) => {
    if (!isNaN(Number(editValue))) {
      dispatch(
        updateHoldings({
          id: token.id,
          holdings: Number(editValue),
          address: walletAddress,
        })
      );
    }
    setEditingId(null);
  };
  const paginatedTokens = tokens.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    token: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedToken(token);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (selectedToken) {
      setEditingId(selectedToken.id);
      setEditValue(selectedToken.holdings.toString());
    }
    handleMenuClose();
  };

  const handleRemoveClick = () => {
    if (selectedToken) {
      dispatch(removeToken({ id: selectedToken.id, address: walletAddress }));
    }
    handleMenuClose();
  };

  const tableCellHeaderStyle = {
    color: "#9e9e9e",
    fontWeight: 600,
    borderBottom: "none",
  };
  const tableCellStyle = {
    color: "#ffffff",
  };

  if (!isWalletConnected) {
    return (
      <Box
        sx={{
          mt: 3,
          p: 4,
          textAlign: "center",
          backgroundColor: "#121212",
          borderRadius: 2,
        }}
      >
        <AppTypography variant="h3" color="#9ca3af">
          Please connect your wallet to view your watchlist 🔑
        </AppTypography>
      </Box>
    );
  }

  if (tokens.length === 0) {
    return (
      <Box
        sx={{
          mt: 3,
          p: 4,
          textAlign: "center",
          backgroundColor: "#121212",
          borderRadius: 2,
        }}
      >
        <AppTypography variant="h3" color="#9ca3af">
          No tokens in your watchlist yet. Add some to start tracking 👀
        </AppTypography>
      </Box>
    );
  }
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          border: "1px solid #333",
          boxShadow: "none",
          backgroundColor: "#121212",
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            borderCollapse: "separate",
            borderSpacing: "0",
            "& td, & th": {
              borderBottom: "none",
            },
          }}
        >
          {/* HEADER */}
          <TableHead sx={{ backgroundColor: "#27272A" }}>
            <TableRow>
              <TableCell sx={tableCellHeaderStyle}>Token</TableCell>
              <TableCell sx={tableCellHeaderStyle}>Price</TableCell>
              <TableCell sx={tableCellHeaderStyle}>24h %</TableCell>
              <TableCell sx={tableCellHeaderStyle}>Sparkline (7d)</TableCell>
              <TableCell sx={tableCellHeaderStyle}>Holdings</TableCell>
              <TableCell sx={tableCellHeaderStyle}>Value</TableCell>
              <TableCell align="center" sx={tableCellHeaderStyle}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {paginatedTokens.map((token) => (
              <TokenRow
                key={token.id}
                token={token}
                editingId={editingId}
                editValue={editValue}
                setEditValue={setEditValue}
                handleHoldings={handleHoldings}
                handleMenuOpen={handleMenuOpen}
              />
            ))}
          </TableBody>

          {/* FOOTER */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} sx={{ ...tableCellStyle, p: 0 }}>
                <AppPagination
                  count={tokens.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* ACTION MENU */}
      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onEdit={handleEditClick}
        onRemove={handleRemoveClick}
      />
    </>
  );
};

export default WatchlistTable;
