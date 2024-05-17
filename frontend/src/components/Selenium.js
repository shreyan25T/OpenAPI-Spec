import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, MenuItem, Select, TextField, Snackbar } from "@mui/material";
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
      byWait:"",
      by: "NAME",
      byInput: "email",
      action: "send_keys",
      actionInput: "exampleInput",
    },
    {
      id: 2,
      byWait:"",
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
      byInput: "Enter here",
      action: "send_keys",
      actionInput: "Enter here",
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

      const response = await axios.post("http://127.0.0.1:8000/selenium/test", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      setGeneratedUuid(data.uuid);
      console.log(generatedUuid)
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
        const response = await axios.get(`http://127.0.0.1:8000/selenium/download-zip?unique_session_id=${encodeURIComponent(generatedUuid)}`, {
            responseType: "blob",
        });

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
        values: ["","element_to_be_clickable", "visibility_of_element_located", "presence_of_element_located", "invisibility_of_element_located"],
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
      cellEditorParams: { values: actionOptions },
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
      <div className="grid grid-cols-1 gap-2 justify-items-center mt-20">
        <TextField
          label="Add driver.get URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "10px" }}
        />
        <div className="row-flex">
          <Select
            label="Select your driver"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="Windows">Windows</MenuItem>
            <MenuItem value="Linux">Linux</MenuItem>
            <MenuItem value="Mac">Mac</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddRow}
            startIcon={<AddIcon />}
            style={{ marginLeft: "10px" }}
          >
            Add Row
          </Button>
        </div>


        <div className="ag-theme-quartz" style={{ width: "100%" }}>
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

        <div className="row-flex">
          <Button
            variant="contained"
            color="secondary"
            onClick={onTestButtonClick}
            style={{ marginTop: "5px",marginBottom:"10px" ,marginRight: "10px" }}
          >
            Test Button
          </Button>
          {isFileUploaded && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadZip}
              style={{ marginTop: "5px",marginBottom:"10px" }}
            >
              Download Zip
            </Button>
          )}
        </div>

        {/* Snackbar for displaying messages */}
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
