import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomModal = ({ title, children, open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}>
        {/* Header */}
        <Box
          sx={{
            padding: 2,
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <>{title}</>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            padding: 2,
            overflowY: "auto",
            marginBottom: "40px",
          }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
