import React, { useState } from 'react';
import {
  Button,
  MenuItem,
  Select,
  TextField,
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
import CustomModal from './modal/CustomModal';
import RightSidebar from './sidebar/RightSidebar';
import '../assests/style.css';
import client from '../client';
import SeleniumTable from './SeleniumTable';
import SeleniumEdit from './SeleniumEdit';
import ActionChainEdit from './ActionChainEdit';

const initialValues = {
  actionChainFlag: false,
  byWait: '',
  by: 'NAME',
  byInput: '',
  action: 'get_text',
  actionInput: '',
};

const actionChainInitValues = {
  byWait: '',
  by: 'NAME',
  byInput: '',
  action: 'click',
  actionInput: '',
};

const Selenium = () => {
  const [url, setUrl] = useState('');
  const [pathDriver, setPathDriver] = useState('');
  const [driver, setDriver] = useState('Windows');
  const [rowData, setRowData] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [editorAction, setEditorAction] = useState('ADD');
  const [activeOperation, setActiveOperation] = useState(initialValues);
  const [activeOperationId, setActiveOperationId] = useState();
  const [editActionChain, setEditActionChain] = useState(false);
  const [activeActionChainId, setActiveActionChainId] = useState();
  const [activeActionChain, setActiveActionChain] = useState(
    actionChainInitValues
  );
  const [previewData, setPreviewData] = useState('');
  const [previewModal, setPreviewModal] = useState(false);

  const handleDelete = (index) => {
    const updatedData = rowData.filter((_, i) => i !== index);
    setRowData(updatedData);
  };
  const handleActionChainDelete = (index, i) => {
    const copiedRows = [...rowData];
    const updatedArr = copiedRows[index].actionChains?.filter(
      (_, n) => n !== i
    );
    if (updatedArr.length === 0) {
      setRowData((rowData) => rowData.filter((_, n) => n !== index));
    } else {
      copiedRows[index].actionChains = updatedArr;
      setRowData(copiedRows);
    }
  };

  const handleNewEditorOpen = () => {
    setOpenSidebar(true);
    setEditActionChain(false);
    setEditorAction('ADD');
    setActiveOperation(initialValues);
  };

  const createActionChain = () => {
    setOpenSidebar(true);
    setEditActionChain(true);
    setEditorAction('CREATE');
    setActiveActionChain(actionChainInitValues);
  };

  const handleActionChainEditorOpen = (index) => {
    setOpenSidebar(true);
    setEditActionChain(true);
    setEditorAction('ADD');
    setActiveOperationId(index);
    setActiveOperation(initialValues);
    setActiveActionChain(actionChainInitValues);
  };

  const handleRowDataEdit = (index) => {
    setEditActionChain(false);
    setEditorAction('EDIT');
    setActiveOperationId(index);
    setActiveOperation(rowData[index]);
    setOpenSidebar(true);
  };

  const handleActionChainEdit = (index, i) => {
    setEditActionChain(true);
    setEditorAction('EDIT');
    setActiveActionChainId(i);
    setActiveOperationId(index);
    setActiveActionChain(rowData[index].actionChains[i]);
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

  const handleActionChainSubmit = (values) => {
    if (editorAction === 'CREATE') {
      setRowData((rowData) => [
        ...rowData,
        { actionChainFlag: true, actionChains: [values] },
      ]);
    } else if (editorAction === 'ADD') {
      rowData[activeOperationId].actionChains.push(values);
    } else {
      rowData[activeOperationId].actionChains[activeActionChainId] = values;
    }
    setOpenSidebar(false);
  };

  return (
    <React.Fragment>
      <Navbar />
      <div
        className="grid grid-cols-1 gap-2 justify-items-center mt-6"
        style={{ padding: '10px' }}>
        <div className=" flex md:flex-row flex-col w-full items-strech gap-3">
          <TextField
            label="Add your local driver path here"
            value={pathDriver}
            onChange={(e) => setPathDriver(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ flex: 6 }}
          />
          <Box
            sx={{
              flex: 6,
              backgroundColor: 'rgba(247, 144, 29, 0.1)',
              p: 2,
              paddingX: 4,
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
        <div className=" w-full flex flex-col md:flex-row mt-3 gap-3">
          <TextField
            label="Add Site URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ flex: 3.5 }}
          />
          <FormControl style={{ flex: 1.5, height: '45px' }}>
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
            style={{ flex: 1.2 }}>
            Add Operation
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={createActionChain}
            startIcon={<AddIcon />}
            style={{ flex: 1.2 }}>
            Create Action Chain
          </Button>
        </div>
        <RightSidebar
          title="Edit Operation"
          isOpen={openSidebar}
          onClose={() => setOpenSidebar(false)}>
          {!editActionChain ? (
            <SeleniumEdit
              initialValues={activeOperation}
              handleSubmit={handleSubmit}
            />
          ) : (
            <ActionChainEdit
              initialValues={activeActionChain}
              handleSubmit={handleActionChainSubmit}></ActionChainEdit>
          )}
        </RightSidebar>
        {rowData.length > 0 && (
          <SeleniumTable
            handleDelete={handleDelete}
            handleEdit={handleRowDataEdit}
            handleActionChainEdit={handleActionChainEdit}
            handleActionChainDelete={handleActionChainDelete}
            handleActionChainEditorOpen={handleActionChainEditorOpen}
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
