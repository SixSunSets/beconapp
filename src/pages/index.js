import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import TopBar from "./components/TopBar";
import { useTheme, useMediaQuery, Button } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Tabla from "../pages/components/Tabla";
import TextField from "@mui/material/TextField";
import socket from "./socket";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setOpenModal] = useState(false);
  const [datos, setDatos] = useState([]);
  const [selectedData, setSelectedData] = useState([]); // Tabla <- Callback
  console.log(selectedData);
  /*
  useEffect(() => {
    socket.on("actualizar_equipo", (data) => {
      setDatos((prevDatos) => {
        const updatedRows = [...prevDatos];
        data.forEach(({ row_id, values }) => {
          const index = updatedRows.findIndex((row) => row.row_id === row_id);
          if (index !== -1) {
            updatedRows[index] = { ...updatedRows[index], ...values };
          } else {
            updatedRows.push({ row_id, ...values });
          }
        });

        updatedRows.sort((a, b) => a.row_id - b.row_id);

        return updatedRows;
      });
    });

    return () => {
      socket.off("actualizar_equipo");
    };
  }, []);
  */

  useEffect(() => {
    const fetchDatos = async () => {
      const response = await fetch("/datos_simulados.json");
      const data = await response.json();
      setDatos(data);
    };

    fetchDatos();
  }, []);

  const handleOpenModal = (row) => {
    //setCurrentRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    //setCurrentRow(null);
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

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-6 ${inter.className}`}
    >
      <TopBar appname="AC Smart 5" />
      <TopBar appname="AC Smart 5" />
      <header className="w-full flex items-center mt-10">
        <div className={`${isMobile ? "flex" : "flex-1"}`}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={isMobile ? 90 : 130}
            height={isMobile ? 90 : 130}
          />
        </div>
        <div
          className={`flex-1 flex ${
            isMobile ? "justify-start" : "justify-center"
          }`}
        >
          <p
            className="font-bold text-lg md:text-xl lg:text-2xl"
            style={{ color: "#165b8d" }}
          >
            Control de equipos
          </p>
        </div>
        {!isMobile && <div className="flex-1"></div>}
      </header>
      <div className="mt-4 w-full p-4 bg-gray-100 flex items-center justify-between rounded-tl-md rounded-tr-md">
        <p className="text-lg">Lista de equipos</p>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleOpenModal(datos)}
          disabled={selectedData.length === 0}
        >
          Control Grupal
        </Button>
      </div>
      <Tabla datos={datos} onSelectionChange={setSelectedData} />
      {/* Modal de Control Grupal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Controlar Equipos ({selectedData.length} seleccionados)
        </DialogTitle>
        <DialogContent>
          <p>
            <strong>Equipos seleccionados:</strong>
          </p>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Sede</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedData.map((row) => (
                  <TableRow key={row.row_id}>
                    <TableCell>{row.row_id}</TableCell>
                    <TableCell>{row.NOMBRE}</TableCell>
                    <TableCell>{row.SEDE}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-4">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Propiedades</TableCell>
                    <TableCell>Controlar Equipo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>ESTADO</TableCell>
                    <TableCell>
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        fullWidth
                        defaultValue=""
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
                    <TableCell>
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        fullWidth
                        defaultValue=""
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
                    <TableCell>SETPOINT</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        fullWidth
                        defaultValue=""
                        inputProps={{ step: 0.5, min: 0 }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleCommand}>
            Comandar
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
