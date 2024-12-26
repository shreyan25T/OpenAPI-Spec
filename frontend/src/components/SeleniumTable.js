import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const SeleniumTable = ({ handleEdit, handleDelete, values }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableHeaders = [
    'By Wait',
    'By',
    'By Input',
    'Command',
    'Command Input',
    'Actions',
  ];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((heading) => (
                <TableCell sx={{ fontWeight: 600, background: '#f7901d' }}>
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.byWait}</TableCell>
                  <TableCell>{row.by}</TableCell>
                  <TableCell>{row.byInput}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.actionInput}</TableCell>
                  <TableCell>
                    <EditIcon
                      onClick={() => handleEdit(index)}
                      sx={{
                        color: '#f7901d',
                        marginRight: 1,
                        cursor: 'pointer',
                      }}
                    />
                    <DeleteIcon
                      onClick={() => handleDelete(index)}
                      sx={{ color: '#f7901d', cursor: 'pointer' }}
                    />
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

export default SeleniumTable;
