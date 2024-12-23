import React, { useState } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./navbar/Navbar";
import RightSidebar from "./sidebar/RightSidebar";
import PytestEdit from "./PytestEdit";
import PytestDataTable from "./PytestTable";
import CustomModal from "./modal/CustomModal";
import EditableText from "./PytestTitle";
import client from "../client";

const initialValues = {
  endpoint: "",
  method: "GET",
  statusCode: "200",
  timeout: "30",
  headers: `
  {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer <token>",
  "Cache-Control": "no-cache"
  }`,
  payload: "",
  response: "",
};

const PytestManual = () => {
  const { user } = useAuth0();

  const [pytestTitle, setPytestTitle] = useState("PytestManual");
  const [pytestBaseURL, setPytestBaseURL] = useState("http://127.0.0.1:8000");

  const [endpointEditor, setEndpointEditor] = useState(false);
  const [pytestPreviewModal, setPytestPreviewModal] = useState(false);
  const [editorAction, setEditorAction] = useState("ADD");

  const [activeEndpointCase, setActiveEndpointCase] = useState(initialValues);
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);

  const [pytestPreviewText, setPytestPreviewText] = useState("");

  const handleNewEndpointEditorOpen = () => {
    setEndpointEditor(true);
    setEditorAction("ADD");
    setActiveEndpointCase(initialValues);
  };
  const handleEndpointEditorClose = () => setEndpointEditor(false);

  const [testCases, setTestCases] = useState([]);
  const addTestCases = (values) => {
    testCases.push(values);
  };

  const handleEndpointSubmit = (values) => {
    if (editorAction === "ADD") {
      const [sameTestCase] = testCases.filter(
        (testCase) =>
          testCase.endpoint === values.endpoint &&
          testCase.method === values.method &&
          testCase.statusCode === values.statusCode
      );
      if (!sameTestCase) {
        addTestCases(values);
      } else {
        toast.info("Testcase already exits");
        return;
      }
    } else {
      testCases[activeEndpointIndex] = values;
    }
    setEndpointEditor(false);
  };

  const handleEndpointEdit = (index) => {
    setEditorAction("EDIT");
    setActiveEndpointIndex(index);
    setActiveEndpointCase(testCases[index]);
    setEndpointEditor(true);
  };

  const handleEndpointDelete = (TIndex) => {
    const filteredTestCases = testCases.filter((_, index) => index !== TIndex);
    setTestCases(filteredTestCases);
  };

  const handlePreviewAPI = async (tempTestCases) => {
    const payload = {
      title: pytestTitle,
      base_url: pytestBaseURL,
      test_cases: tempTestCases.map((testCase) => {
        function generateString(method, endpoint, statusCode) {
          const endpointPath = endpoint.startsWith("/")
            ? endpoint.slice(1)
            : endpoint;

          const queryParams = endpoint.split("?")[1] || "";
          const formattedParams = queryParams
            .split("&")
            .map((param) => param.replace("=", "_"))
            .join("_");
          return `${method.toLowerCase()}_${statusCode}_${endpointPath}${
            formattedParams ? `_${formattedParams}` : ""
          }`;
        }
        testCase["headers"] = JSON.parse(testCase["headers"]);
        testCase["has_payload"] = !!testCase.payload;
        testCase["payload"] = testCase["has_payload"]
          ? JSON.parse(testCase["payload"])
          : {};
        testCase["response"] = JSON.parse(testCase["response"]);
        testCase["response_object_type"] = Array.isArray(testCase["response"])
          ? "list"
          : "dict";
        testCase["method_name"] = generateString(
          testCase.method,
          testCase.endpoint,
          testCase.statusCode
        );
        testCase["has_payload"] = !!testCase.payload;

        return testCase;
      }),
    };
    try {
      const response = await client.post("home/manual-test", payload, {
        responseType: "blob", // Treat the response as binary data (file)
      });
      console.log("resp------", response.data);

      const reader = new FileReader();
      reader.onload = () => {
        console.log("File content as text:", reader.result);
        setPytestPreviewText(reader.result);
      };
      reader.readAsText(response.data);
    } catch (error) {
      console.error("Error previewing the test cases:", error);
      toast.error("Error previewing the test cases");
    }
    setPytestPreviewModal(true);
  };

  const handlePreview = async () => {
    const tempTestCases = structuredClone(testCases);
    await handlePreviewAPI(tempTestCases);
  };

  const handleIndividualPreview = async (IIndex) => {
    const IndividualTestCase = structuredClone(
      testCases.filter((_, index) => index === IIndex)
    );
    await handlePreviewAPI(IndividualTestCase);
  };

  const handleDownload = () => {
    const fileContent = pytestPreviewText; // Get the content of the TextField
    const fileName = `${pytestTitle}.py`; // Desired file name

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

    setPytestPreviewModal(false);
  };

  return (
    <React.Fragment>
      <Navbar />
      <div
        className="grid grid-cols-1 gap-2 justify-items-center"
        style={{ padding: "10px" }}>
        <ToastContainer />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <h3>Hi {user.name}, you can generate&nbsp;</h3>
          <EditableText
            inputText={pytestTitle}
            handleInputText={setPytestTitle}
          />
          <h3>&nbsp;files with base URL:&nbsp;</h3>
          <EditableText
            inputText={pytestBaseURL}
            handleInputText={setPytestBaseURL}
          />
          <h3>&nbsp;here...</h3>
        </Box>
        <Box display="flex" justifyContent="center" marginBottom="16px" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNewEndpointEditorOpen}>
            Add new test
          </Button>
          {testCases.length !== 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePreview}>
              Preview
            </Button>
          )}
        </Box>
        <RightSidebar
          isOpen={endpointEditor}
          title="Edit Test Case"
          onClose={handleEndpointEditorClose}>
          <PytestEdit
            initialValues={activeEndpointCase}
            handleSubmit={handleEndpointSubmit}
          />
        </RightSidebar>
        {testCases.length !== 0 && (
          <PytestDataTable
            handleDelete={handleEndpointDelete}
            handleEdit={handleEndpointEdit}
            handleIndividualPreview={handleIndividualPreview}
            values={testCases}
          />
        )}
        <CustomModal
          title={<Typography variant="h6">Pytest Preview</Typography>}
          open={pytestPreviewModal}
          onClose={() => {
            setPytestPreviewModal(false);
          }}>
          <TextField
            multiline
            minRows={6}
            value={pytestPreviewText}
            fullWidth
            InputProps={{
              style: { fontFamily: "monospace" },
            }}
            variant="outlined"
          />
          <Box
            display="flex"
            position="absolute"
            justifyContent="end"
            bottom="0"
            width="100%">
            <Button
              sx={{ marginX: "40px", marginTop: "22px", marginBottom: "10px" }}
              variant="contained"
              color="secondary"
              onClick={handleDownload}>
              Download
            </Button>
          </Box>
        </CustomModal>
      </div>
    </React.Fragment>
  );
};

export default PytestManual;
