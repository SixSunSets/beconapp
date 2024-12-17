import * as React from 'react';
import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { updateEstado, updateSetpoint, updateVelocidad } from "../api/dataEquipos";

const TableRowEquipos = ({ data = [] }) => {
  const [loadingSetPoint, setLoadingSetpoint] = useState(false);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [setpoint, setSetpoint] = useState(data?.Setpoint || 0);
  const [estado, setEstado] = useState(data?.Estado || 'inactive');
  const [velocidad, setVelocidad] = useState(data?.Velocidad || 1);

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

  const handleSetpointChange = async (change) => {
    setLoadingSetpoint(true);
    const newSetpoint = parseFloat((setpoint + change).toFixed(1));

    try {
      const equipo = data.Nombre; 
      
      if (!equipo) {
        throw new Error('Nombre del equipo no encontrado');
      }
      
      await updateSetpoint(equipo, newSetpoint); 
      setSetpoint(newSetpoint);
    } catch (error) {
      console.error('Error al actualizar el setpoint:', error);
    } finally {
      setLoadingSetpoint(false);
    }
  };

  const handleEstadoToggle = async () => {
    setLoadingEstado(true);
    const newEstado = estado === 'active' ? 'inactive' : 'active';
    
    try {
      const equipo = data.Nombre; 
      
      if (!equipo) {
        throw new Error('Nombre del equipo no encontrado');
      }
      
      await updateEstado(equipo, newEstado); 
      setEstado(newEstado);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    } finally {
      setLoadingEstado(false);
    }
  };
  
  
  const handleVelocidadChange = async (velocidadValue) => {
    const newVelocidad = velocidadValue

    try {
      //setLoadingVelocidad(true);
      const equipo = data.Nombre; 
      
      if (!equipo) {
        throw new Error('Nombre del equipo no encontrado');
      }
      
      await updateVelocidad(equipo, newVelocidad); 
      setVelocidad(newVelocidad);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    } finally {
      //setLoadingVelocidad(false);
    }
  };
  
  

  return (
    <TableRow>
      {Object.entries(data).map(([key, value], index) => (
        <TableCell key={index}>
          {key === 'Setpoint' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => handleSetpointChange(-0.5)}
                disabled={loadingSetPoint}
              >
                <RemoveIcon />
              </IconButton>

              {loadingSetPoint ? (
                <CircularProgress size={24} />
              ) : (
                <span className="mx-2">{formatValue(key, value)} °C</span>
              )}

              <IconButton
                onClick={() => handleSetpointChange(0.5)}
                disabled={loadingSetPoint}
              >
                <AddIcon />
              </IconButton>
            </div>
          ) : key === 'ComandoEstado' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={handleEstadoToggle}
                disabled={loadingEstado}
              >
                <PowerSettingsNewIcon />
              </IconButton>

              {loadingEstado ? (
                <CircularProgress size={24} />
              ) : (
                <span className="mx-2">{formatValue(key, value)}</span>
              )}
            </div>
          ) : key === 'Velocidad' ? (
            <select value={value} onChange={(e) => handleVelocidadChange(e.target.value)}>
              <option value={1}>{formatValue(key, 1)}</option>
              <option value={2}>{formatValue(key, 2)}</option>
              <option value={3}>{formatValue(key, 3)}</option>
            </select>
          ) : key === 'Temperatura' ? (
            formatValue(key, value) + ' °C'
          ) : (
            formatValue(key, value)
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowEquipos;
