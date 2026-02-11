"use client";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
}

export const AuroraBackground = ({
  className,
  children,
}: AuroraBackgroundProps) => {
  return (
    <Box
      className={`aurora-bg ${className || ""}`}
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuroraBackground;
