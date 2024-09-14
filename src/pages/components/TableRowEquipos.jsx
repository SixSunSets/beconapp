import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const TableRowEquipos = ({ data }) => {

    return (
        <TableRow>
          {Object.values(data).map((value, index) => (
            <TableCell key={index}>
              {value}
            </TableCell>
          ))}
        </TableRow>
    );
}

export default TableRowEquipos;
