import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { Inter } from "next/font/google";
import TopBar from './components/TopBar';
import { useTheme, useMediaQuery, Button } from "@mui/material";
import Tabla from "../pages/components/Tabla"
import socket from "./socket";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openModal, setOpenModal] = useState(false);
  const [datos, setDatos] = useState([]);
  const [selectedData, setSelectedData] = useState([]); // Tabla <- Callback
  console.log(selectedData)
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
    <main className={`flex min-h-screen flex-col items-center justify-start p-6 ${inter.className}`}>
      <TopBar appname="AC Smart 5" />
      <TopBar appname="AC Smart 5" />
      <header className="w-full flex items-center mt-10">
        <div className={`${isMobile ? 'flex' : 'flex-1'}`}>
          <Image src="/images/logo.png" alt="Logo" width={isMobile ? 90 : 130} height={isMobile ? 90 : 130} />
        </div>
        <div className={`flex-1 flex ${isMobile ? 'justify-start' : 'justify-center'}`}>
          <p className="font-bold text-lg md:text-xl lg:text-2xl" style={{ color: "#165b8d" }}>Control de equipos</p>
        </div>
        {!isMobile && <div className="flex-1"></div>}
      </header>
      <div className="mt-4 w-full p-4 bg-gray-100 flex items-center justify-between rounded-tl-md rounded-tr-md">
        <p className="text-lg">Lista de equipos</p>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleOpenModal(datos)}
        >
          Control Grupal
        </Button>
      </div>
      <Tabla datos={datos} onSelectionChange={setSelectedData}/>
      {/* Modal de Control Grupal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Control Grupal</DialogTitle>
        <DialogContent>
          {selectedData.map((row) => (
            <div key={row.row_id} className="my-4">
              <p><strong>Sede:</strong> {row.SEDE}</p>
              <p><strong>Marca:</strong> {row.MARCA}</p>
              <p><strong>Nombre:</strong> {row.NOMBRE}</p>
              {/* Agrega controles aquí según lo que necesites */}
            </div>
          ))}
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
