import React, { useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DialogContentText, MenuItem } from "@mui/material";
import { Height } from "@mui/icons-material";

const Tabla = ({ datos = [], onSelectionChange }) => {
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({
    row_id: "",
    SEDE: "",
    MARCA: "",
    NOMBRE: "",
    ESTADO: "",
    VELOCIDAD: "",
    TEMPERATURA: "",
    SETPOINT: "",
    ERROR: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    onSelectionChange(newSelected.map((id) => datos.find((row) => row.row_id === id))); // Callback -> index
  };

  const handleFilterChange = (event, column) => {
    setFilters({
      ...filters,
      [column]: event.target.value,
    });
  };

  const handleOpenModal = (row) => {
    setCurrentRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentRow(null);
  };

  const handleCommand = () => {
    /*
    if (currentRow) {
      socket.emit("comandar_equipo", currentRow);
      handleCloseModal();
    }*/
  };

  const handleChangeField = (field, value) => {
    setCurrentRow({
      ...currentRow,
      [field]: value,
    });
  };

  const filteredData = datos.filter((row) =>
    Object.keys(filters).every((key) =>
      row[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  return (
    <div className="w-full p-4 bg-white">
      <div className="mt-0 w-full max-h-screen overflow-y-auto overflow-x-auto">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>ID</TableCell>
                <TableCell>Sede</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Velocidad</TableCell>
                <TableCell>Temperatura</TableCell>
                <TableCell>Setpoint</TableCell>
                <TableCell>Error</TableCell>
                <TableCell>Control</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                {Object.keys(filters).map((key) => (
                  <TableCell key={key}>
                    <TextField
                      label={`Filtrar por ${key}`}
                      size="small"
                      value={filters[key]}
                      onChange={(event) => handleFilterChange(event, key)}
                    />
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => {
                const isItemSelected = selected.includes(row.row_id);
                return (
                  <TableRow
                    key={row.row_id}
                    hover
                    onClick={(event) => handleClick(event, row.row_id)}
                    sx={{ cursor: "pointer" }}
                    role="checkbox"
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{row.row_id}</TableCell>
                    <TableCell>{row.SEDE}</TableCell>
                    <TableCell>{row.MARCA}</TableCell>
                    <TableCell>{row.NOMBRE}</TableCell>
                    <TableCell>{row.ESTADO}</TableCell>
                    <TableCell>{row.VELOCIDAD}</TableCell>
                    <TableCell>{row.TEMPERATURA}</TableCell>
                    <TableCell>{row.SETPOINT}</TableCell>
                    <TableCell>{row.ERROR}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleOpenModal(row)}
                      >
                        Control
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Controlar equipo</DialogTitle>
        <DialogContent>
          {currentRow && (
            <>
            <p className="mb-3"><strong>Equipo seleccionado:</strong> {currentRow.row_id || ""}, {currentRow.NOMBRE || ""}</p>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Propiedades</TableCell>
                      <TableCell>Valor Actual</TableCell>
                      <TableCell>Controlar Equipo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    <TableRow>
                      <TableCell>SEDE</TableCell>
                      <TableCell>{currentRow.SEDE || ""}</TableCell>
                      <TableCell>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MARCA</TableCell>
                      <TableCell>{currentRow.MARCA || ""}</TableCell>
                      <TableCell>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>NOMBRE</TableCell>
                      <TableCell>{currentRow.NOMBRE || ""}</TableCell>
                      <TableCell>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ESTADO</TableCell>
                      <TableCell>{currentRow.ESTADO || ""}</TableCell>
                      <TableCell>
                        <TextField
                          select
                          variant="outlined"
                          size="small"
                          defaultValue={currentRow.ESTADO || ""}
                          fullWidth
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option value="" disabled>
                            Seleccione
                          </option>
                          <option value="Encendido">Encendido</option>
                          <option value="Apagado">Apagado</option>
                        </TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>VELOCIDAD</TableCell>
                      <TableCell>{currentRow.VELOCIDAD || ""}</TableCell>
                      <TableCell>
                        <TextField
                          select
                          variant="outlined"
                          size="small"
                          defaultValue={currentRow.VELOCIDAD || ""}
                          fullWidth
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option value="" disabled>
                            Seleccione
                          </option>
                          <option value="Baja">Baja</option>
                          <option value="Media">Media</option>
                          <option value="Alta">Alta</option>
                        </TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TEMPERATURA</TableCell>
                      <TableCell>{currentRow.TEMPERATURA || ""}</TableCell>
                      <TableCell>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>SETPOINT</TableCell>
                      <TableCell>{currentRow.SETPOINT || ""}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          defaultValue={currentRow.SETPOINT || ""}
                          fullWidth
                          inputProps={{ step: 0.5, min: 0 }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ERROR</TableCell>
                      <TableCell>{currentRow.ERROR || ""}</TableCell>
                      <TableCell>

                      </TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleCommand}>
            Comandar
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
};

export default Tabla;
