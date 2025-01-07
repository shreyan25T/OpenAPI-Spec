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
  Collapse,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SeleniumTable = ({
  handleEdit,
  handleDelete,
  values,
  handleActionChainEdit,
  handleActionChainDelete,
  handleActionChainEditorOpen,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (index) => {
    if (open.includes(index)) {
      setOpen((val) => val.filter((item) => item !== index));
    } else setOpen((val) => [...val, index]);
  };

  const tableHeaders = [
    '',
    'By Wait',
    'By',
    'By Input',
    'Command',
    'Command Input',
    'Actions',
    'Action Chain',
  ];

  const withCustomStyled = (BaseTableCell) => {
    return ({ sx = {}, ...props }) => {
      const defaultStyles = {
        fontWeight: props?.isHeader ? 600 : 500,
        flex: 1,
        textAlign: 'left',
        width: `${100 / tableHeaders.length || 1}%`,
        overflowWrap: 'break-word',
      };

      return <BaseTableCell sx={{ ...defaultStyles, ...sx }} {...props} />;
    };
  };

  const StyledTableCell = withCustomStyled(TableCell);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((heading, i) => (
                <StyledTableCell isHeader>{heading}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <>
                  {row?.actionChainFlag ? (
                    <>
                      <TableRow key={index}>
                        <StyledTableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleChange(index)}>
                            {open.includes(index) ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.actionChains[0].byWait?.split('_').join(' ') ||
                            '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.actionChains[0].by?.split('_').join(' ')}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.actionChains[0].byInput || '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.actionChains[0].action?.split('_').join(' ')}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.actionChains[0].actionInput || '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 2,
                            }}>
                            <EditIcon
                              onClick={() => handleActionChainEdit(index, 0)}
                              sx={{
                                color: '#f7901d',
                                marginRight: 1,
                                cursor: 'pointer',
                              }}
                            />
                            <DeleteIcon
                              onClick={() => handleActionChainDelete(index, 0)}
                              sx={{ color: '#f7901d', cursor: 'pointer' }}
                            />
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          {row?.actionChains?.length === 1 && (
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleActionChainEditorOpen(index)}
                              style={{ flex: 1 }}>
                              Add
                            </Button>
                          )}
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={12} style={{ padding: 0 }}>
                          <Collapse
                            in={open.includes(index)}
                            timeout="auto"
                            unmountOnExit>
                            <Table>
                              <TableBody>
                                {row?.actionChains?.slice(1).map((val, i) => (
                                  <TableRow>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell>-</StyledTableCell>
                                    <StyledTableCell>
                                      {val.by?.split('_').join(' ')}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {val.byInput || '-'}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {val.action?.split('_').join(' ')}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {val.actionInput || '-'}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          gap: 2,
                                        }}>
                                        <EditIcon
                                          onClick={() =>
                                            handleActionChainEdit(index, i + 1)
                                          }
                                          sx={{
                                            color: '#f7901d',
                                            marginRight: 1,
                                            cursor: 'pointer',
                                          }}
                                        />
                                        <DeleteIcon
                                          onClick={() =>
                                            handleActionChainDelete(
                                              index,
                                              i + 1
                                            )
                                          }
                                          sx={{
                                            color: '#f7901d',
                                            cursor: 'pointer',
                                          }}
                                        />
                                      </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {i === row?.actionChains?.length - 2 && (
                                        <Button
                                          variant="contained"
                                          color="secondary"
                                          onClick={() =>
                                            handleActionChainEditorOpen(index)
                                          }
                                          style={{ flex: 1 }}>
                                          Add
                                        </Button>
                                      )}
                                    </StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow key={index}>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell>
                        {row.byWait?.split('_').join(' ') || '-'}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.by?.split('_').join(' ')}
                      </StyledTableCell>
                      <StyledTableCell>{row.byInput || '-'}</StyledTableCell>
                      <StyledTableCell>
                        {row.action?.split('_').join(' ')}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.actionInput || '-'}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 2,
                          }}>
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
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  )}
                </>
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
