import * as React from 'react';
import { useState, useEffect,  useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableRowEquipos from './TableRowEquipos';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const TableEquipos = ({ equipos = [], onFilterActive, onFilteredNames }) => {
  const columns = equipos && equipos.length > 0 ? Object.keys(equipos[0]) : [];

  // Estado para almacenar los valores de filtro por columna
  const [filters, setFilters] = useState(
    columns.reduce((acc, column) => ({ ...acc, [column]: "" }), {})
  );

  const prevFilteredNamesRef = useRef([]);

  // Actualizar el filtro cuando el usuario escribe en los campos de filtro
  const handleFilterChange = (column, value) => {
    const updatedFilters = { ...filters, [column]: value };
    setFilters(updatedFilters);
  };

  const formatValue = (key, value) => {
    if (key === 'Estado' || key === 'ComandoEstado') {
      return value === 'active' ? 'ON' : value === 'inactive' ? 'OFF' : value;
    }
    if (key === 'Velocidad') {
      switch (value) {
        case 1:
          return 'Baja';
        case 2:
          return 'Media';
        case 3:
          return 'Alta';
        default:
          return value; 
      }
    }
    return value; 
  };

  // Filtrar los datos en función de los valores de filtro
  const filteredEquipos = equipos.filter((equipo) =>
    columns.every((column) => {
      const columnValue = equipo[column];
      const filterValue = filters[column];

      if (filterValue === undefined || filterValue === null || filterValue === "") {
        return true; // No hay filtro aplicado para esta columna
      }

      if (columnValue === undefined || columnValue === null) {
        return false;
      }

      // Utilizar la función de formateo para comparar
      const formattedValue = formatValue(column, columnValue);  
      return formattedValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    })
  );

  // Extraer los nombres de los equipos filtrados
  const filteredNames = filteredEquipos.map(equipo => equipo.Nombre);

  // Verificar si algún filtro está activo y si hay resultados filtrados
  useEffect(() => {
    const isAnyFilterActive = Object.values(filters).some(val => val !== "");
    onFilterActive(isAnyFilterActive && filteredEquipos.length > 0);

    // Solo pasar los nombres filtrados si estos han cambiado
    if (JSON.stringify(prevFilteredNamesRef.current) !== JSON.stringify(filteredNames)) {
      onFilteredNames(filteredNames);
      prevFilteredNamesRef.current = filteredNames; // Actualizar la referencia de los nombres filtrados
    }
  }, [filters, filteredEquipos, onFilterActive, filteredNames, onFilteredNames]);

  return (
    <div className="w-full p-4 bg-white">
      <div className="mt-0 w-full max-h-screen overflow-y-auto overflow-x-auto">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index}>
                    {column.toUpperCase()}
                    <br />
                    {/* Campo de entrada para el filtro */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={filters[column]}
                        onChange={(e) => handleFilterChange(column, e.target.value)}
                      />
                      <FilterAltOutlinedIcon />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Renderizar solo las filas que coinciden con los filtros */}
              {filteredEquipos.map((row, index) => (
                <TableRowEquipos key={index} data={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default TableEquipos;
