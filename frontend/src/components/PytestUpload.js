import React, { use, useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, IconButton, Box, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./navbar/Navbar";
import HttpIcon from "@mui/icons-material/Http";
import InputAdornment from "@mui/material/InputAdornment";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation } from "react-router-dom";

const PytestUpload = () => {
  const { user } = useAuth0();
  const [specData, setSpecData] = useState("");
  const [testResult, setTestResult] = useState("");
  const [specPath, setspecPath] = useState("");
  const [uuId, setuuId] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [testCases, setTestCases] = useState([
    { url: "", statusCode: "", response: "" },
  ]);
  const [previewData, setPreviewData] = useState("")
  const {pathname} = useLocation()

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
    const url = pathname === "/locust"? "http://127.0.0.1:8000/home/test?locust_flag=locust" :"http://127.0.0.1:8000/home/test"
    try {
      const response = await axios.post(
        url,
        {
          spec_content: specData,
          spec_file_path: specPath,
          spec_uuid: uuId,
          test_cases: testCases,
        },
        {
          responseType: "blob", // Treat the response as binary data (file)
        }
      );

      console.log('resp------',response.data)

      const reader = new FileReader();
      reader.onload = () => {
        console.log("File content as text:", reader.result);
        setPreviewData(reader.result)
      };
      reader.readAsText(response.data);
      setIsFileUploaded(true);
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
  const downloadPythonFile = () => {
    const fileContent = previewData; // Get the content of the TextField
    const fileName = pathname === "/locust"? "locust_script.py": "pytest_script.py"; // Desired file name

    // Create a Blob with the Python code and specify the MIME type
    const blob = new Blob([fileContent], { type: "text/x-python" });

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        className="w-full p-3"
      >
        <ToastContainer />
        <div className=" grid grid-cols-5 gap-y-4">
          <div className=" md:col-span-2 col-span-full">
          <TextField
          placeholder="OpenAPI Spec"
          variant="outlined"
          multiline
          InputLabelProps={{
            shrink: true, // Keep the label visible if both placeholder and label are used
          }}
          rows={22}
          value={specData}
          onChange={(e) => setSpecData(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "gray",
              },
              "&:hover fieldset": {
                borderColor: "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: "gray",
                borderWidth: "1px"
              },
            },
          }}
        />
          </div>
          <div className=" col-span-full md:col-span-1 flex flex-col items-center justify-center gap-3">
          <input
            type="file"
            onChange={handleUpload}
            style={{ display: "none" }}
            id="upload-file-input"
          />
            <label htmlFor="upload-file-input">
            <Button
              variant="contained"
              color="secondary"
              component="span"
              style={{width: '200px'}}
              startIcon={<CloudUploadIcon />}
            >
              Upload File
            </Button>
          </label>
          <Typography variant="body1">{fileName}</Typography>
          {specData && <Button variant="contained" color="secondary"               
          style={{ width: '200px'}}
          endIcon={ <ChevronRightIcon></ChevronRightIcon>}
          onClick={handleTest}>
            Preview
          </Button>}
          {previewData && (
            <Button
              variant="contained"
              color="secondary"
              onClick={downloadPythonFile}
              style={{ width: '200px'}}
              >
              Download
            </Button>
          )}
          </div>
          <div className=" md:col-span-2 col-span-full">
          <TextField
           placeholder={ pathname==="/locust"? "Locust File":"Pytest File"}
           variant="outlined"
           multiline
           InputLabelProps={{
             shrink: true, // Keep the label visible if both placeholder and label are used
           }}
           rows={22}
           value={previewData}
           onChange={(e) => setPreviewData(e.target.value)}
           fullWidth
           sx={{
             "& .MuiOutlinedInput-root": {
               "& fieldset": {
                 borderColor: "gray",
               },
               "&:hover fieldset": {
                 borderColor: "black",
               },
               "&.Mui-focused fieldset": {
                 borderColor: "gray",
                 borderWidth: "1px"
               },
             },
           }}
        />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PytestUpload;
