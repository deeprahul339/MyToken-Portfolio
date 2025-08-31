import React from "react";

import { Box, Button } from "@mui/material";

interface PaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

const PaginationActions: React.FC<PaginationActionsProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const disableNextButton = page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <Box sx={{ flexShrink: 0, mr: 2, display: "flex" }}>
      <Button
        onClick={handleBack}
        disabled={page === 0}
        sx={{
          textTransform: "none",
          color: "#A1A1AA",
          "&.Mui-disabled": {
            color: "#52525B",
          },
        }}
      >
        Prev
      </Button>
      <Button
        onClick={handleNext}
        disabled={disableNextButton}
        sx={{
          textTransform: "none",
          color: "#A1A1AA",
          "&.Mui-disabled": {
            color: "#52525B",
          },
        }}
      >
        Next
      </Button>
    </Box>
  );
};

export default PaginationActions;
