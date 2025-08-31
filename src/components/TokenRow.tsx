import React from "react";

import { TableRow, TableCell, Box, IconButton, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import AppButton from "./common/AppButton";
import AppTypography from "./common/AppTypography";

interface TokenRowProps {
  token: any;
  editingId: string | null;
  editValue: string;
  setEditValue: (val: string) => void;
  handleHoldings: (token: any) => void;
  handleMenuOpen: (e: React.MouseEvent<HTMLButtonElement>, token: any) => void;
}

const TokenRow: React.FC<TokenRowProps> = React.memo(
  ({
    token,
    editingId,
    editValue,
    setEditValue,
    handleHoldings,
    handleMenuOpen,
  }) => {
    const tableCellStyle = { color: "#fff" };

    return (
      <TableRow
        key={token.id}
        sx={{
          color: "white",
          "& td, & th": { border: 0 },
        }}
        hover
      >
        <TableCell
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ...tableCellStyle,
          }}
        >
          <Box
            component="img"
            src={token?.image}
            alt={token.name}
            sx={{ width: 28, height: 28, borderRadius: "50%" }}
          />
          <AppTypography variant="subtitle">
            {token.name}
            <AppTypography
              variant="body"
              component="span"
              sx={{ color: "#9ca3af", ml: 0.5 }}
            >
              ({token.symbol.toUpperCase()})
            </AppTypography>
          </AppTypography>
        </TableCell>

        <TableCell sx={tableCellStyle}>
          ${token?.price.toLocaleString()}
        </TableCell>

        <TableCell sx={{ fontWeight: 600, ...tableCellStyle }}>
          {token.change24h.toFixed(2)}%
        </TableCell>

        <TableCell sx={tableCellStyle}>
          <Box sx={{ width: "80px", height: "40px" }}>
            <img
              src={token.sparkline}
              alt={`${token.name} sparkline`}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </TableCell>

        <TableCell sx={{ ...tableCellStyle, width: 200 }}>
          {editingId === token.id ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                value={editValue}
                type="number"
                onChange={(e) => setEditValue(e.target.value)}
                sx={{
                  width: "100px",
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.875rem",
                    padding: "10px",
                  },
                  "& .MuiOutlinedInput-root": { backgroundColor: "#1e1e1e" },
                }}
              />
              <AppButton
                label="Save"
                bgColor="#A9E851"
                border="10px"
                textColor="black"
                onClick={() => handleHoldings(token)}
              />
            </Box>
          ) : (
            <AppTypography variant="body">
              {token.holdings.toFixed(4)}
            </AppTypography>
          )}
        </TableCell>

        <TableCell sx={tableCellStyle}>
          ${(token.price * token.holdings).toLocaleString()}
        </TableCell>

        <TableCell align="center" sx={tableCellStyle}>
          <IconButton onClick={(e) => handleMenuOpen(e, token)}>
            <MoreVertIcon sx={{ color: "#9e9e9e" }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
);

export default TokenRow;
