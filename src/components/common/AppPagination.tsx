import React from "react";

import { Box, TablePagination } from "@mui/material";

import PaginationActions from "./PaginationActions";
import AppTypography from "./AppTypography";

interface AppPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
}

const AppPagination: React.FC<AppPaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <TablePagination
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]} // hide dropdown
      // Left text
      labelDisplayedRows={({ from, to, count }) =>
        `${from} – ${to} results of ${count}`
      }
      // Right controls
      ActionsComponent={(props) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AppTypography
            variant="body"
            color="#A1A1AA"
            sx={{ minWidth: "100px" }}
          >
            {page + 1} of {totalPages} pages
          </AppTypography>
          <PaginationActions {...props} />
        </Box>
      )}
      sx={{
        color: "#9e9e9e",
        width: "100%",
        overflow: "hidden",
        borderTop: "1px solid #333",

        ".MuiTablePagination-displayedRows": {
          color: "#9e9e9e",
          margin: 0,
          p: 2,
          order: -1,
        },
      }}
    />
  );
};

export default AppPagination;
