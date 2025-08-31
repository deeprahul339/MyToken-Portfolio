import React from "react";

import { Box } from "@mui/material";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

import AppTypography from "./common/AppTypography";

import useBreakpoints from "../hooks/useBreakpoints";

interface PortfolioCardProps {
  total: number;
  lastUpdated?: string;
  data: { name: string; value: number; color: string }[];
  isWalletConnected: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  total,
  lastUpdated,
  data,
  isWalletConnected,
}) => {
  const { isMobile, isTablet } = useBreakpoints();

  const hasTokens = data && data.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile || isTablet ? "column" : "row",
        justifyContent: "space-between",
        backgroundColor: "#27272A",
        borderRadius: "15px",
        p: "16px",
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <AppTypography variant="subtitle" color="#9ca3af">
            Portfolio Total
          </AppTypography>
          <AppTypography variant="h1" color="white" sx={{ mt: 1 }}>
            {isWalletConnected ? `$${total.toLocaleString()}` : "--"}
          </AppTypography>
        </Box>
        {isWalletConnected && (
          <Box>
            <AppTypography
              variant="caption"
              color="#9ca3af"
              sx={{ mt: 2, display: "block" }}
            >
              Last updated: {lastUpdated}
            </AppTypography>
          </Box>
        )}
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          mt: isMobile || isTablet ? "20px" : 0,
          width: isTablet ? "500px" : isMobile ? "320px" : "600px",
          height: isMobile ? "380px" : "200px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {" "}
        <AppTypography variant="subtitle" color="#9ca3af">
          Portfolio Total
        </AppTypography>
        {isWalletConnected ? (
          hasTokens ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout={isMobile ? "horizontal" : "vertical"}
                  align={isMobile ? "left" : "right"}
                  verticalAlign={isMobile ? "bottom" : "top"}
                  content={({ payload }) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        maxHeight: "180px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        pr: 1,
                        "&::-webkit-scrollbar": { display: "none" },
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {payload?.map((entry: any, index: number) => (
                        <Box
                          key={`legend-${index}`}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: isMobile
                              ? "300px"
                              : isTablet
                              ? "250px"
                              : "400px",
                            flex: isMobile ? "1 1 45%" : "1 1 auto",
                            px: 1,
                          }}
                        >
                          <AppTypography
                            variant="body"
                            sx={{ color: entry.color }}
                          >
                            {entry.value}
                          </AppTypography>
                          <AppTypography
                            variant="body"
                            sx={{ color: "#A1A1AA" }}
                          >
                            {entry.payload.value}%
                          </AppTypography>
                        </Box>
                      ))}
                    </Box>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <AppTypography
              variant="h3"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: "40px",
              }}
              color="#9ca3af"
            >
              No tokens in your portfolio yet. Add some to see your chart 📊
            </AppTypography>
          )
        ) : (
          <AppTypography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: "40px",
            }}
            color="#9ca3af"
          >
            Connect your wallet to view portfolio 📌
          </AppTypography>
        )}
      </Box>
    </Box>
  );
};

export default PortfolioCard;
