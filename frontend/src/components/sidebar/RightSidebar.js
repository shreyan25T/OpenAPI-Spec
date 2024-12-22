import React from "react";
import { Drawer, Box, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Sidebar({ isOpen, title, onClose, onSubmit, onReset, children }) {
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: "16px",
            paddingY: "12px",
            fontWeight: "fontWeightMedium",
            borderBottom: "2px solid #e0e0e0",
            backgroundColor: "#ED8109",
          }}>
          <Typography variant="h8">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            pt: 2,
          }}>
          {children}
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
