import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, IconButton, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./navbar/Navbar";

const OpenAPISpecReader = () => {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const [specData, setSpecData] = useState("");
  const [testResult, setTestResult] = useState("");
  const [specPath, setspecPath] = useState("");
  const [uuId, setuuId] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [testCases, setTestCases] = useState([{ url: "", statusCode: "", response: "" }]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
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
      } else {
        toast.error(response.data.message);
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

  const handleAddTestCase = () => {
    setTestCases([...testCases, { url: "", statusCode: "", response: "" }]);
  };

  const handleDeleteTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="grid grid-cols-1 gap-2 justify-items-center mt-20" style={{ padding: "10px" }}>
        <ToastContainer />
        <Box display={"flex"} alignItems={"center"} gap={"4px"} flexDirection={"column"}>
          <input
            type="file"
            onChange={handleUpload}
            style={{ display: "none" }}
            id="upload-file-input"
          />
          <h3>Hi {user.name}, you can generate pytest files here</h3>
          <label htmlFor="upload-file-input">
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
        <Typography variant="h6">Test Cases</Typography>
        {testCases.map((testCase, index) => (
          <Box key={index} display="flex" alignItems="center" gap="8px" marginBottom="8px">
            <TextField
              label="URL endpoint"
              variant="outlined"
              value={testCase.url}
              onChange={(e) => handleTestCaseChange(index, "url", e.target.value)}
            />
            <TextField
              label="Status Code"
              variant="outlined"
              value={testCase.statusCode}
              onChange={(e) => handleTestCaseChange(index, "statusCode", e.target.value)}
            />
            <TextField
              label="Response"
              variant="outlined"
              value={testCase.response}
              onChange={(e) => handleTestCaseChange(index, "response", e.target.value)}
            />
            <IconButton color="secondary" onClick={() => handleDeleteTestCase(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button variant="contained" color="secondary" onClick={handleAddTestCase} startIcon={<AddCircleIcon />}>
          Add Test Case
        </Button>
        <Box display={"flex"} alignItems={"center"} gap={"4px"} flexDirection={"column"}>
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
        <Box display={"flex"} alignItems={"center"} gap={"4px"} flexDirection={"column"}>
          <Typography variant="body1">{testResult}</Typography>
        </Box>
      </div>
    </React.Fragment>
  );
};

export default OpenAPISpecReader;
