import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./navbar/Navbar";
import RightSidebar from "./sidebar/RightSidebar";
import PytestEdit from "./PytestEdit";
import PytestDataTable from "./PytestTable";
import CustomModal from "./modal/CustomModal";
import EditableText from "./PytestTitle";

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

  const [endpointEditor, setEndpointEditor] = useState(false);
  const [pytestPreviewModal, setPytestPreviewModal] = useState(false);
  const [editorAction, setEditorAction] = useState("ADD");

  const [activeEndpointCase, setActiveEndpointCase] = useState(initialValues);
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);

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
      console.log(sameTestCase);
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

  const handlePreview = () => {
    setPytestPreviewModal(true);
  };

  const handleDownload = () => {
    alert("Downloaded Successfully");
  };

  return (
    <React.Fragment>
      <Navbar />
      <div
        className="grid grid-cols-1 gap-2 justify-items-center"
        style={{ padding: "10px" }}>
        <ToastContainer />
        <Box display="flex">
          <h3>Hi {user.name}, you can generate&nbsp;</h3>
          <EditableText
            inputText={pytestTitle}
            handleInputText={setPytestTitle}
          />
          <h3>&nbsp;files here...</h3>
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
            values={testCases}
          />
        )}
        <CustomModal
          title={<Typography variant="h6">Pytest Preview</Typography>}
          open={pytestPreviewModal}
          onClose={() => {
            setPytestPreviewModal(false);
          }}>
          {[...Array(10)].map((_, index) => (
            <Typography key={index} variant="body2">
              Line {index + 1}: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </Typography>
          ))}
          <Box
            display="flex"
            position="absolute"
            justifyContent="end"
            bottom="0"
            width="100%">
            <Button
              sx={{ marginX: "40px", marginY: "20px" }}
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
