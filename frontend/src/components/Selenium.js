import React, { useState, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import Navbar from "./navbar/Navbar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import "../assests/style.css";

const Selenium = () => {
  const gridRef = useRef();
  const [url, setUrl] = useState("");
  const [rowData, setRowData] = useState([
    {
      id: 1,
      by: "NAME",
      byInput: "email",
      action: "send_keys",
      actionInput: "exampleInput",
    },
    {
      id: 2,
      by: "ID",
      byInput: "exampleInputPassword1",
      action: "send_keys",
      actionInput: "password",
    },
  ]);

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
      const response = await fetch("http://127.0.0.1:8000/selenium/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(url),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
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
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddRow}
          startIcon={<AddIcon />}
        >
          Add Row
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={onTestButtonClick}
          style={{ marginTop: "5px" }}
        >
          Test Button
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Selenium;
