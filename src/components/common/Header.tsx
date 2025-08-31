import React from "react";

import Box from "@mui/material/Box";

import AppTypography from "./AppTypography";

import useBreakpoints from "../../hooks/useBreakpoints";

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  icon?: string;
}

const Header: React.FC<HeaderProps> = ({ title, actions, icon }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon && (
            <img
              src={icon}
              alt="token-icon"
              style={{ height: "32px", width: "32px" }}
            />
          )}
          <AppTypography
            variant="h3"
            sx={{ width: isMobile ? "80px" : "150px" }}
          >
            {title}
          </AppTypography>
        </Box>
        {/* Right side */}
        <Box display="flex" alignItems="center" gap={2}>
          {actions}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
