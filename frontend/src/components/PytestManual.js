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
import HttpIcon from "@mui/icons-material/Http";
import InputAdornment from "@mui/material/InputAdornment";

const PytestManual = () => {
  const { user } = useAuth0();
  const [testResult, setTestResult] = useState("");
  const [testCases, setTestCases] = useState([
    { url: "", statusCode: "", response: "" },
  ]);

  const handleTest = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/home/manual-test",
        {
          test_cases: testCases,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setTestResult("Test cases got generated successfully.");
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
          "uuId"
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
      <div
        className="grid grid-cols-1 gap-2 justify-items-center mt-20"
        style={{ padding: "10px" }}
      >
        <ToastContainer />
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"4px"}
          flexDirection={"column"}
        >
          <h3>Hi {user.name}, you can generate pytest files here</h3>
        </Box>
        <Typography variant="h6">Test Cases</Typography>
        <Box display="flex" justifyContent="center" marginBottom="16px">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleIcon />}
            onClick={handleAddTestCase}
          >
            Add Test Case
          </Button>
        </Box>
        {testCases.map((testCase, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            gap="8px"
            marginBottom="8px"
          >
            <TextField
              label="URL endpoint"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpIcon />
                  </InputAdornment>
                ),
              }}
              value={testCase.url}
              onChange={(e) =>
                handleTestCaseChange(index, "url", e.target.value)
              }
            />
            <TextField
              label="Status Code"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpIcon />
                  </InputAdornment>
                ),
              }}
              value={testCase.statusCode}
              onChange={(e) =>
                handleTestCaseChange(index, "statusCode", e.target.value)
              }
            />
            <TextField
              label="Response"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpIcon />
                  </InputAdornment>
                ),
              }}
              value={testCase.response}
              onChange={(e) =>
                handleTestCaseChange(index, "response", e.target.value)
              }
            />
            <IconButton
              color="secondary"
              onClick={() => handleDeleteTestCase(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"4px"}
          flexDirection={"column"}
        >
          <Button variant="contained" color="secondary" onClick={handleTest}>
            Test Spec
          </Button>
          {
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadZip}
              style={{ marginLeft: "10px" }}
            >
              Download Test Files
            </Button>
          }
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

export default PytestManual;
