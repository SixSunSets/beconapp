import Image from 'next/image';
import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
import TableEquipos from '../pages/components/TableEquipos';
import TopBar from './components/TopBar';
import { useTheme, useMediaQuery } from "@mui/material";
import { updateGlobal, getEquipos } from "../pages/api/dataEquipos";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const equipos = [
    { Sede: "Angamos", Nombre: "AC_01", Estado: "active", ComandoEstado:"active", Velocidad:2, Temperatura:"21.0", Setpoint:"21.0"},
    { Sede: "Angamos", Nombre: "AC_02", Estado: "active", ComandoEstado:"active", Velocidad:2, Temperatura:"21.5", Setpoint:"22.0"},
    { Sede: "Angamos", Nombre: "AC_03", Estado: "inactive", ComandoEstado:"inactive", Velocidad:1, Temperatura:"22.0", Setpoint:"22.0"},
  ];

/*
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getEquipos();
      setEquipos(data);
      console.log(data)
    };
    getData();
  }, []);
  */

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null); // Estado para ON/OFF
  const [newTemperature, setNewTemperature] = useState(""); // Estado para la temperatura
  const [filteredEquiposNames, setFilteredEquiposNames] = useState([]); // Estado para equipos filtrados

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleTemperatureChange = (e) => {
    const value = e.target.value;
  
    // Verificar si el valor es un número o un decimal válido
    if (/^\d*\.?\d*$/.test(value) && value < 25) {
      setNewTemperature(value); // Solo actualiza el estado si el valor es válido
    }
  };

  const handleSaveChanges = async () => {
    const validTemperature = newTemperature !== "" && newTemperature > 15;
  
    if (selectedState !== null || validTemperature) {
      console.log("Equipos filtrados:", filteredEquiposNames);
      console.log("Estado seleccionado:", selectedState !== null ? selectedState : "No se cambiará");
      console.log("Nueva temperatura:", validTemperature ? newTemperature : "No se cambiará");
  
      try {
        // Enviar los cambios al backend
        await updateGlobal(
          filteredEquiposNames,
          selectedState !== null ? selectedState : null,
          validTemperature ? newTemperature : null
        );
        console.log("Cambios guardados con éxito.");
  
        // Recargar los datos actualizados del backend
        const updatedEquipos = await getEquipos();  // Asume que `getEquipos` ya está definida
        setEquipos(updatedEquipos); // Actualiza la tabla con los datos nuevos
  
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      }
    }
  };
  
  

  return (
    <main className={`flex min-h-screen flex-col items-center justify-start p-6 ${inter.className}`}>
      <TopBar appname="AC Smart 5" />
      <header className="w-full flex items-center mt-10">
        <div className={`${isMobile ? 'flex' : 'flex-1'}`}>
          <Image src="/images/logo.png" alt="Logo" width={isMobile ? 90 : 130} height={isMobile ? 90 : 130} />
        </div>
        <div className={`flex-1 flex ${isMobile ? 'justify-start' : 'justify-center'}`}>
          <p className="font-bold text-lg md:text-xl lg:text-2xl" style={{ color: "#165b8d" }}>Control de dispositivo</p>
        </div>
        {!isMobile && <div className="flex-1"></div>}
      </header>
      <div className="mt-4 w-full p-4 bg-gray-100 flex items-center justify-between rounded-tl-md rounded-tr-md">
        <div>
          <p className="text-lg">Lista de equipos</p>
        </div>
        {isFilterActive && (
          <div className="relative bg-gray-200 hover:bg-gray-300 p-2 border rounded ">
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <h2 className="text-lg mr-2">Comandos Globales</h2>
              <ExpandMoreIcon />
            </div>
            {open && (
          <div className="absolute left-0 mt-2 p-4 border rounded bg-gray-100 z-10" style={{ width: "fit-content" }}>
            <div className="flex flex-col space-y-6">
              {/* Comandar Estado */}
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Comandar Estado</p>
                <div className="flex items-center">
                  <button
                    className={`py-2 px-4 rounded-l ${
                      selectedState === "ON"
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-300"
                    } hover:bg-cyan-600`}
                    onClick={() => setSelectedState("ON")}
                  >
                    ON
                  </button>
                  <button
                    className={`py-2 px-4 rounded-r ${
                      selectedState === "OFF"
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-300"
                    } hover:bg-cyan-600`}
                    onClick={() => setSelectedState("OFF")}
                  >
                    OFF
                  </button>
                </div>
              </div>

              {/* Ajustar Temperatura */}
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Ajustar Temperatura</p>
                <input
                  id="tempInput"
                  placeholder="00"
                  value={newTemperature}
                  className="p-2 border rounded text-center"
                  style={{ maxWidth: "80px" }}
                  onChange={handleTemperatureChange}
                />
              </div>

              {/* Botón de Guardar Cambios */}
              <div className="flex justify-center">
                <button
                  className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600"
                  onClick={handleSaveChanges}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
          </div>
        )}
      </div>
      <TableEquipos equipos={equipos} onFilterActive={setIsFilterActive} onFilteredNames={setFilteredEquiposNames} />
    </main>
  );
}
