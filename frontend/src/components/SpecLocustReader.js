import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./navbar/Navbar";
import { Box } from "@mui/material";

const SpecLocustReader = () => {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const [specData, setSpecData] = useState("");
  const [testResult, setTestResult] = useState("");
  const [specPath, setspecPath] = useState("");
  const [uuId, setuuId] = useState("");
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
        setuuId(response.data.data.spec_uuid);
        console.log("specPath", response.data.data.spec_uuid);
        console.log(response.data.data);
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
        "http://127.0.0.1:8000/home/test?locust_flag=locust",
        { spec_content: specData, spec_file_path: specPath, spec_uuid: uuId },
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
        `http://127.0.0.1:8000/home/download-zip?unique_session_id=${encodeURIComponent(
          uuId
        )}`,
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

      <div className="grid grid-cols-1 gap-2 justify-items-center mt-20" style={{ padding: "10px" }}>
        <ToastContainer />
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"4px"}
          flexDirection={"column"}
        >
          <input
            type="file"
            onChange={handleUpload}
            style={{ display: "none" }}
            id="upload-file-input2"
          />
          <h3>Hi {user.name} you can generate locust files here </h3>
          <label htmlFor="upload-file-input2">
            <Button
              variant="contained"
              color="secondary"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload File
            </Button>
          </label>
          <Typography variant="body1">{fileName}</Typography>
        </Box>
        <TextField
          label="OpenAPI Spec"
          variant="outlined"
          multiline
          rows={4}
          value={specData}
          onChange={(e) => setSpecData(e.target.value)}
          fullWidth
        />
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"4px"}
          flexDirection={"column"}
        >
          <Button variant="contained" color="secondary" onClick={handleTest}>
            Test Spec
          </Button>
          {isFileUploaded && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadZip}
              style={{ marginLeft: "10px" }}
            >
              Download Test Files
            </Button>
          )}
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"4px"}
          flexDirection={"column"}
        >
          <Typography variant="body1">{testResult}</Typography>
        </Box>
      </div>
    </React.Fragment>
  );
};

export default SpecLocustReader;
