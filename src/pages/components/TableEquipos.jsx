import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableRowEquipos from './TableRowEquipos';

const TableEquipos = ({ equipos }) => {
    const columns = equipos.length > 0 ? Object.keys(equipos[0]) : [];

    return (
        <div className="w-full p-4 bg-white">
          <div className="mt-0 w-full max-h-screen overflow-y-auto overflow-x-auto ">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell key={index}>
                        {column.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {/* Cuerpo de la tabla */}
                <TableBody>
                  {equipos.map((row, index) => (
                    <TableRowEquipos
                      key={index}
                      data={row}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
    );
}

export default TableEquipos;
