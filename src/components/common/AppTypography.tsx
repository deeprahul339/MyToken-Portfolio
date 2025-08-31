import React, { type ReactNode } from "react";

import Typography from "@mui/material/Typography";
import type { SxProps } from "@mui/material";

type Variant = "h1" | "h2" | "h3" | "subtitle" | "body" | "caption";

interface AppTypographyProps {
  variant: Variant;
  children: ReactNode;
  color?: string;
  className?: string;
  sx?: SxProps;
  component?: any;
}

const variantStyles: Record<Variant, object> = {
  h1: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: {
      xs: "24px", // mobile
      sm: "28px", // tablet
      md: "32px", // desktop
    },
    lineHeight: {
      xs: "32px",
      sm: "36px",
      md: "40px",
    },
  },
  h2: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: {
      xs: "20px",
      sm: "22px",
      md: "24px",
    },
    lineHeight: {
      xs: "28px",
      sm: "30px",
      md: "32px",
    },
  },
  h3: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: {
      xs: "18px",
      sm: "19px",
      md: "20px",
    },
    lineHeight: {
      xs: "22px",
      sm: "23px",
      md: "24px",
    },
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: {
      xs: "14px",
      md: "16px",
    },
    lineHeight: {
      xs: "20px",
      md: "22px",
    },
  },
  body: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: {
      xs: "12px",
      md: "13px",
    },
    lineHeight: {
      xs: "18px",
      md: "20px",
    },
  },
  caption: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "16px",
  },
};

const AppTypography: React.FC<AppTypographyProps> = ({
  variant,
  children,
  color = "white",
  className,
  sx = {},
  component,
}) => {
  return (
    <Typography
      sx={{ ...variantStyles[variant], color, ...sx }}
      className={className}
      component={component}
    >
      {children}
    </Typography>
  );
};

export default AppTypography;
