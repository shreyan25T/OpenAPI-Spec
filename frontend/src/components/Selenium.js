import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Snackbar,
  Typography,
  Link,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Navbar from './navbar/Navbar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RightSidebar from './sidebar/RightSidebar';
import '../assests/style.css';
import client from '../client';
import SeleniumTable from './SeleniumTable';
import SeleniumEdit from './SeleniumEdit';
import CustomModal from './modal/CustomModal';

const initialValues = {
  byWait: '',
  by: 'NAME',
  byInput: '',
  action: 'get_text',
  actionInput: '',
};

const Selenium = () => {
  const gridRef = useRef();
  const [url, setUrl] = useState('');
  const [pathDriver, setPathDriver] = useState('');
  const [driver, setDriver] = useState('Windows');
  const [rowData, setRowData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [generatedUuid, setGeneratedUuid] = useState('');
  const [openSidebar, setOpenSidebar] = useState(false);
  const [editorAction, setEditorAction] = useState('ADD');
  const [activeOperation, setActiveOperation] = useState(initialValues);
  const [activeOperationId, setActiveOperationId] = useState();
  const [previewData, setPreviewData] = useState('');
  const [previewModal, setPreviewModal] = useState(false);

  const handleDelete = (index) => {
    const updatedData = rowData.filter((_, i) => i !== index);
    setRowData(updatedData);
  };

  // const onTestButtonClick = async () => {
  //   try {
  //     const requestData = {
  //       url: url,
  //       pathDriver: pathDriver,
  //       driver: driver,
  //       data: rowData,
  //     };

  //     const response = await client.post('selenium/test', requestData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const data = response.data;
  //     setGeneratedUuid(data.uuid);
  //     console.log(generatedUuid);
  //     setSnackbarMessage(data.message);
  //     setIsFileUploaded(true);
  //     setOpenSnackbar(true);
  //   } catch (error) {
  //     setSnackbarMessage('Error: Unable to generate Selenium script');
  //     setOpenSnackbar(true);
  //     console.error('Error:', error);
  //   }
  // };

  const handleNewEditorOpen = () => {
    setOpenSidebar(true);
    setEditorAction('ADD');
    setActiveOperation(initialValues);
  };

  const handleRowDataEdit = (index) => {
    setEditorAction('EDIT');
    setActiveOperationId(index);
    setActiveOperation(rowData[index]);
    setOpenSidebar(true);
  };

  const generateScript = async () => {
    try {
      const response = await client.post(
        `selenium/download-zip`,
        {
          url: url,
          pathDriver: pathDriver,
          driver: driver,
          data: rowData,
        },
        {
          responseType: 'blob',
        }
      );

      const reader = new FileReader();
      reader.onload = () => {
        console.log('File content as text:', reader.result);
        setPreviewData(reader.result);
        setPreviewModal(true);
      };
      reader.readAsText(response.data);
    } catch (error) {
      console.error('Error downloading  file:', error);
    }
  };

  const downloadPythonFile = () => {
    const fileContent = previewData; // Get the content of the TextField
    const fileName = 'selenium_script.py'; // Desired file name

    // Create a Blob with the Python code and specify the MIME type
    const blob = new Blob([fileContent], { type: 'text/x-python' });

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (values) => {
    if (editorAction === 'ADD') {
      rowData.push(values);
    } else {
      rowData[activeOperationId] = values;
    }
    setOpenSidebar(false);
  };

  return (
    <React.Fragment>
      <Navbar />
      <div
        className="grid grid-cols-1 gap-2 justify-items-center mt-20"
        style={{ padding: '10px' }}>
        <div className="row-flex" style={{ display: 'flex', width: '100%' }}>
          <TextField
            label="Add your local driver path here"
            value={pathDriver}
            onChange={(e) => setPathDriver(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ flex: 6, marginRight: '10px' }}
          />
          <Box
            sx={{
              flex: 6,
              backgroundColor: 'rgba(247, 144, 29, 0.1)',
              p: 1,
              borderRadius: 2,
              boxShadow: 1,
              display: 'flex',
              alignItems: 'center',
            }}>
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              If the driver URL is not available, please{' '}
              <Link
                href="https://developer.chrome.com/docs/chromedriver/downloads"
                target="_blank"
                rel="noopener"
                sx={{ color: 'blue', textDecoration: 'underline' }}>
                click here
              </Link>{' '}
              to download it.
            </Typography>
          </Box>
        </div>
        <div
          className="row-flex"
          style={{ display: 'flex', width: '100%', paddingTop: '10px' }}>
          <TextField
            label="Add Site URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ flex: 4, marginRight: '10px' }}
          />
          <FormControl style={{ flex: 3, height: '45px', marginRight: '7px' }}>
            <InputLabel id="driver">Select your driver</InputLabel>
            <Select
              label="Select your driver"
              labelId="driver"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              variant="outlined">
              <MenuItem value="Windows">Windows</MenuItem>
              <MenuItem value="Linux">Linux</MenuItem>
              <MenuItem value="Mac">Mac</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleNewEditorOpen}
            startIcon={<AddIcon />}
            style={{ flex: 1 }}>
            Add Operation
          </Button>
        </div>
        <RightSidebar
          title="Edit Operation"
          isOpen={openSidebar}
          onClose={() => setOpenSidebar(false)}>
          <SeleniumEdit
            initialValues={activeOperation}
            handleSubmit={handleSubmit}
          />
        </RightSidebar>
        {rowData.length > 0 && (
          <SeleniumTable
            handleDelete={handleDelete}
            handleEdit={handleRowDataEdit}
            values={rowData}></SeleniumTable>
        )}

        <div
          className="row-flex"
          style={{ display: 'flex', marginTop: '10px' }}>
          {rowData.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={generateScript}
              style={{ marginRight: '10px' }}>
              Preview
            </Button>
          )}
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />
        <CustomModal
          title={<Typography variant="h6">Selenium Script Preview</Typography>}
          open={previewModal}
          onClose={() => {
            setPreviewModal(false);
          }}>
          <TextField
            multiline
            minRows={6}
            value={previewData}
            fullWidth
            InputProps={{
              style: { fontFamily: 'monospace' },
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
              sx={{ marginX: '40px', marginTop: '22px', marginBottom: '10px' }}
              variant="contained"
              color="secondary"
              onClick={downloadPythonFile}>
              Download
            </Button>
          </Box>
        </CustomModal>
      </div>
    </React.Fragment>
  );
};

export default Selenium;
