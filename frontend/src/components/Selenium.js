import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Snackbar,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Navbar from "./navbar/Navbar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import "../assests/style.css";

const Selenium = () => {
  const gridRef = useRef();
  const [url, setUrl] = useState("");
  const [driver, setDriver] = useState("Windows");
  const [rowData, setRowData] = useState([
    {
      id: 1,
      byWait: "",
      by: "NAME",
      byInput: "email",
      action: "send_keys",
      actionInput: "exampleInput",
    },
    {
      id: 2,
      byWait: "",
      by: "ID",
      byInput: "exampleInputPassword1",
      action: "send_keys",
      actionInput: "password",
    },
  ]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [generatedUuid, setGeneratedUuid] = useState("");

  const handleAddRow = () => {
    const newRow = {
      id: rowData.length + 1,
      by: "NAME",
      byInput: "",
      action: "send_keys",
      actionInput: "",
    };
    setRowData([...rowData, newRow]);
  };

  const handleDelete = (rowDataToDelete) => {
    const updatedData = rowData.filter((row) => row !== rowDataToDelete);
    setRowData(updatedData);
  };

  const onTestButtonClick = async () => {
    try {
      const requestData = {
        url: url,
        driver: driver,
        data: rowData,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/selenium/test",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setGeneratedUuid(data.uuid);
      console.log(generatedUuid);
      setSnackbarMessage(data.message);
      setIsFileUploaded(true);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Error: Unable to generate Selenium script");
      setOpenSnackbar(true);
      console.error("Error:", error);
    }
  };

  const handleDownloadZip = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/selenium/download-zip?unique_session_id=${encodeURIComponent(
          generatedUuid
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

  const actionOptions = [
    "send_keys",
    "clear",
    "wait time",
    "click",
    "getText",
    "getAttribute",
    "isEnabled",
    "isSelected",
    "submit",
    "getCssValue",
    "switchTo",
    "executeScript",
    "dragAndDrop",
    "mouseMove",
    "doubleClick",
  ];

  const columns = [
    {
      headerName: "ByWait",
      field: "byWait",
      width: 150,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "",
          "element_to_be_clickable",
          "visibility_of_element_located",
          "presence_of_element_located",
          "invisibility_of_element_located",
        ],
      },
    },
    {
      headerName: "By",
      field: "by",
      width: 150,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["NAME", "ID", "XPATH", "CSS_SELECTOR", "CLASS_NAME"],
      },
    },
    { headerName: "ByInput", field: "byInput", width: 200, editable: true },
    {
      headerName: "Action",
      field: "action",
      width: 150,
      editable: true,
      cellEditor: "agSelectCellEditor",
      // cellEditorPopup: true,
      cellEditorParams: { values: actionOptions, valueListMaxHeight: 320 },
    },
    {
      headerName: "ActionInput",
      field: "actionInput",
      width: 200,
      editable: true,
    },
    {
      headerName: "Delete",
      field: "delete",
      pinned: "right",
      maxWidth: 150,
      cellRenderer: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.data)}
          startIcon={<DeleteIcon />}
        ></Button>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Navbar />
      <div
        className="grid grid-cols-1 gap-2 justify-items-center mt-20"
        style={{ padding: "10px" }}
      >
        <div className="row-flex" style={{ display: "flex", width: "100%" }}>
          <TextField
            label="Add Site URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{ style: { height: "45px" } }}
            style={{ flex: 7, marginRight: "10px" }}
          />
          <Select
            label="Select your driver"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            variant="outlined"
            style={{ flex: 3.3, height: "45px", marginRight: "7px" }}
          >
            <MenuItem value="Windows">Windows</MenuItem>
            <MenuItem value="Linux">Linux</MenuItem>
            <MenuItem value="Mac">Mac</MenuItem>
          </Select>
          <Tooltip title="Enter the URL for the driver">
            <TextField
              label="Add your local driver path here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ style: { height: "45px" } }}
              style={{ flex: 7, marginRight: "10px" }}
            />
          </Tooltip>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddRow}
            startIcon={<AddIcon />}
            style={{ height: "45px", flex: 0.7 }}
          >
            Add
          </Button>
        </div>

        <div
          className="ag-theme-quartz"
          style={{ width: "100%", marginTop: "10px" }}
        >
          <AgGridReact
            rowData={rowData}
            getRowNodeId={(data) => data.id}
            ref={gridRef}
            columnDefs={columns}
            domLayout="autoHeight"
            suppressMenu={true}
            suppressCellSelection={true}
            rowHeight={50}
            animateRows={true}
            suppressRowClickSelection={true}
            defaultColDef={{ flex: 1 }}
          />
        </div>

        <div
          className="row-flex"
          style={{ display: "flex", marginTop: "10px" }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={onTestButtonClick}
            style={{ marginRight: "10px" }}
          >
            Test Button
          </Button>
          {isFileUploaded && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadZip}
            >
              Download Zip
            </Button>
          )}
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />
      </div>
    </React.Fragment>
  );
};

export default Selenium;
