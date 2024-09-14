import Image from 'next/image';
import { Inter } from "next/font/google";
import { useState } from 'react';
import TableEquipos from '../pages/components/TableEquipos';
import { useTheme, useMediaQuery } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const equipos = [
    { Sede: "Angamos", Nombre: "AC_01", Estado: "active", Velocidad:"MED", Temperatura:"21.0", Setpoint:"21.0"},

  ];

  return (
    <main className={`flex min-h-screen flex-col items-center justify-start p-6 ${inter.className}`}>
      <header className="w-full flex items-center mt-10">
            <div className={`${isMobile ? 'flex' : 'flex-1'}`}>
                <Image src="/images/logo.png" alt="Logo" width={isMobile ? 90 : 130}  height={isMobile ? 90 : 130} />
            </div>
            <div className={`flex-1 flex  ${isMobile ? 'justify-start' : 'justify-center'}`}>
                <p className="font-bold text-lg md:text-xl lg:text-2xl" style={{ color: "#165b8d" }}>AC SMART</p>
            </div>
            {!isMobile &&(
            <div className="flex-1">
            </div>
            )}
      </header>
      <div className="mt-4 w-full p-4 bg-gray-100 flex items-center justify-between rounded-tl-md rounded-tr-md">
        <div>
          <p className="text-lg">Lista de equipos</p>
        </div>
        <div className="flex space-x-2"></div>
      </div>      
      <TableEquipos
          equipos={equipos}
      />
 
    </main>
  );
}
