import React, { type ReactNode } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import AppTypography from "./AppTypography";

interface AppButtonProps {
  label: ReactNode;
  bgColor?: string;
  textColor?: string;
  icon?: string;
  border?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  bgColor = "#A9E851",
  textColor = "black",
  icon,
  border,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      sx={{
        backgroundColor: bgColor,
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderRadius: border ? border : "100px",
        px: 2,
        py: 1,
        "&:hover": {
          backgroundColor: bgColor,
        },
      }}
    >
      {icon && (
        <Box
          component="img"
          src={icon}
          alt="button-icon"
          sx={{ width: "20px", height: "20px" }}
        />
      )}
      <AppTypography variant="subtitle" color={textColor}>
        {label}
      </AppTypography>
    </Button>
  );
};

export default AppButton;
