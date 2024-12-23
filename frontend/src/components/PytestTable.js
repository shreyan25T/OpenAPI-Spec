import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Tooltip,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PytestDataTable = ({
  handleEdit,
  handleDelete,
  handleIndividualPreview,
  values,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const truncateText = (text, limit = 20) => {
    if (text.length > limit) {
      return (
        <Tooltip title={text}>
          <span>{text.substring(0, limit)}...</span>
        </Tooltip>
      );
    }
    return text;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Endpoint</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status Code</TableCell>
              <TableCell>Timeout</TableCell>
              <TableCell>Headers</TableCell>
              <TableCell>Payload</TableCell>
              <TableCell>Response</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.endpoint}</TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell>{row.statusCode}</TableCell>
                  <TableCell>{row.timeout}</TableCell>
                  <TableCell>{truncateText(row.headers)}</TableCell>
                  <TableCell>{truncateText(row.payload)}</TableCell>
                  <TableCell>{truncateText(row.response)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(index)}
                      sx={{ marginRight: 1 }}>
                      Edit
                    </Button>
                    <IconButton
                      color="secondary"
                      size="small"
                      sx={{
                        marginRight: 1,
                        borderColor: "#ED8109",
                        borderRadius: "100%",
                        borderWidth: "4px",
                      }}
                      onClick={() => {
                        handleIndividualPreview(index);
                      }}>
                      <VisibilityIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(index)}
                      sx={{ marginRight: 1 }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={values.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default PytestDataTable;
