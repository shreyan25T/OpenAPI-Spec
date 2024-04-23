import React, { useState } from "react";
import axios from "axios";
import { Button, Grid, TextField, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./Navbar";

const OpenAPISpecReader = () => {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const [specData, setSpecData] = useState("");
  const [testResult, setTestResult] = useState("");
  const [specPath, setspecPath] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // if (isAuthenticated) throw new Error("ERROR CAUGHT");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // Set the file name for display
    setFileName(file.name);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/home/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        let fileContent = response.data.data.spec_content;
        fileContent = fileContent.replace(/"/g, "");
        setSpecData(fileContent);
        setspecPath(response.data.data.spec_file_path);
      } else {
        toast.error(response.data.message); // Show error message from backend
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    }
  };

  const handleTest = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/home/test",
        { spec_content: specData, spec_file_path: specPath },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setTestResult("Test cases got generated successfully.");
        setIsFileUploaded(true);
      } else {
        setTestResult("Error generating test cases.");
      }
    } catch (error) {
      console.error("Error testing spec:", error);
      setTestResult("Error testing spec.");
    }
  };

  const handleDownloadZip = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/home/download-zip",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "test_files.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading zip file:", error);
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <ToastContainer />
        <Grid item xs={12}>
          <input
            type="file"
            onChange={handleUpload}
            style={{ display: "none" }}
            id="upload-file-input"
          />
          <h1>Hi {user.name}</h1>
          <label htmlFor="upload-file-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload File
            </Button>
          </label>
          <Typography variant="body1">{fileName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="OpenAPI Spec"
            variant="outlined"
            multiline
            rows={4}
            value={specData}
            onChange={(e) => setSpecData(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleTest}>
            Test Spec
          </Button>
          {isFileUploaded && (
            <Button
              variant="contained"
              onClick={handleDownloadZip}
              style={{ marginLeft: "10px" }}
            >
              Download Test Files
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{testResult}</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default OpenAPISpecReader;
