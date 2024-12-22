import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const EditableText = ({
  inputText,
  handleInputText,
  placeholder = "Pytest",
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    console.log(e.target.value);
    handleInputText(e.target.value);
  };

  const saveText = () => {
    setIsEditing(false);
  };

  const handleBlur = () => {
    saveText();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveText();
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {isEditing ? (
        <TextField
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          variant="standard"
          fullWidth
          placeholder={placeholder}
          InputProps={{
            style: { borderBottom: "1px solid #1976d2" }, // Bottom border in blue
          }}
        />
      ) : (
        <Typography
          variant="h6"
          onClick={() => setIsEditing(true)}
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
            display: "flex",
            alignItems: "center",
            color: "#ED8109",
          }}>
          {inputText || placeholder}
          <EditIcon sx={{ marginLeft: 1, color: "#ED8109" }} />
        </Typography>
      )}
    </Box>
  );
};

export default EditableText;
