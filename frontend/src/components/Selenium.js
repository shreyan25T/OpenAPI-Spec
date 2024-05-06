import React, { useState ,useCallback,useRef} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import Navbar from './navbar/Navbar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import "../assests/style.css";

const Selenium = () => {
   const gridRef = useRef();
    const [url, setUrl] = useState('');
    const [rowData, setRowData] = useState([
        { id: 1, by: 'NAME', byInput: 'email', action: 'send_keys', actionInput: 'exampleInput' },
        { id: 2, by: 'ID', byInput: 'exampleInputPassword1', action: 'send_keys', actionInput: 'password' }
    ]);


    const handleAddRow = () => {
        const newRow = { id: rowData.length + 1, by: 'NAME', byInput: '', action: 'send_keys', actionInput: '' };
        setRowData([...rowData, newRow]);
    };

    const onRemoveSelected = useCallback(() => {
      var selectedRowData = gridRef.current.api.getSelectedRows();
      gridRef.current.api.applyTransaction({ remove: selectedRowData });
    }, [setRowData]);

    const onTestButtonClick = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/selenium/test', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(rowData),
          });
          const data = await response.json();
          console.log(data);
      } catch (error) {
          console.error('Error:', error);
      }
  };

    const actionOptions = ['send_keys', 'clear', 'wait time', 'click'];

    const columns = [
        { headerName: 'By', field: 'by',checkboxSelection:true,headerCheckboxSelection:true, width: 150, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['NAME', 'ID', 'XPATH', 'CSS_SELECTOR', 'CLASS_NAME'] } },
        { headerName: 'ByInput', field: 'byInput', width: 200, editable: true },
        { headerName: 'Action', field: 'action', width: 150, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: actionOptions } },
        { headerName: 'ActionInput', field: 'actionInput', width: 200, editable: true },
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
                style={{ marginBottom: '10px' }}
            />
            <div className="ag-theme-quartz" style={{ width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    ref={gridRef}
                    columnDefs={columns}
                    domLayout='autoHeight'
                    suppressMenu={true}
                    suppressCellSelection={true}
                    rowHeight={35}
                    rowSelection={"multiple"}
                    suppressRowClickSelection={true}
                    defaultColDef={{ flex: 1, editable: true }}
                />
            </div>
            <Button variant="contained" color="secondary" onClick={handleAddRow} startIcon={<AddIcon />}>
                Add Row
            </Button>
            <Button variant="contained" color="secondary" onClick={onRemoveSelected} startIcon={<DeleteIcon />} style={{ marginTop: '5px' }}>
                Delete Row
            </Button>
            <Button variant="contained" color="secondary" onClick={onTestButtonClick} style={{ marginTop: '5px' }}>
                    Test Button
                </Button>
        </div>
        </React.Fragment>
    );
};

export default Selenium;
