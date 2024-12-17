import axios from "axios";

export async function getEquipos() {
  try {
    const response = await axios.get('http://localhost:5000/get-data');
    const data = response.data;
    console.log('Datos recibidos getEquipos', data);

    const mappedData = [];
    for (const sede in data) {
      for (const nombre in data[sede]) {
        const equipo = data[sede][nombre];
        mappedData.push({
          Sede: sede,
          Marca: equipo.marca,
          Nombre: nombre,
          ComandoEstado: equipo.binaryOutput,
          Estado: equipo.binaryInput,
          Velocidad: equipo.multiStateInput,
          Temperatura: equipo.analogInput,
          Setpoint: equipo.analogValue,
          Error: equipo.malfunctionCode,
        });
      }
    }
    console.log(mappedData)
    return mappedData;
  } catch (error) {
    console.error('Error fetching equipos data:', error);
    return [];
  }
}

export async function updateEstado(equipos, nuevoEstado) {
  try {
    const requests = equipos.map(equipo => {
      return fetch('http://localhost:5000/set-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipo: equipo,
          estado: nuevoEstado,
        }),
      });
    });

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map(res => res.json()));

    console.log('Estados actualizados', data);
    return data;
  } catch (error) {
    console.error('Error updating estado:', error);
    throw error;
  }
}

export async function updateSetpoint(equipos, nuevoSetpoint) {
  try {
    const requests = equipos.map(equipo => {
      return fetch('http://localhost:5000/set-setpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipo: equipo,
          setpoint: nuevoSetpoint,
        }),
      });
    });

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map(res => res.json()));

    console.log('Setpoints actualizados', data);
    return data;
  } catch (error) {
    console.error('Error updating setpoint:', error);
    throw error;
  }
}

/*
  export async function updateEstado(equipo, nuevoEstado) {
    try {
      const response = await fetch('http://localhost:5000/set-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipo: equipo,
          estado: nuevoEstado,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating estado: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Estado actualizado', data);
      return data;
    } catch (error) {
      console.error('Error updating estado:', error);
      throw error;
    }
  }

  export async function updateSetpoint(equipo, nuevoSetpoint) {
    try {
      const response = await fetch('http://localhost:5000/set-setpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipo: equipo,
          setpoint: nuevoSetpoint,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating setpoint: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Setpoint actualizado', data);
      return data;
    } catch (error) {
      console.error('Error updating setpoint:', error);
      throw error;
    }
  }

*/
  export async function updateVelocidad(equipo, nuevaVelocidad) {
    try {
      const response = await fetch('http://localhost:5000/set-speed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipo: equipo,
          velocidad: nuevaVelocidad,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating setpoint: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Velocidad actualizada', data);
      return data;
    } catch (error) {
      console.error('Error updating velocidad:', error);
      throw error;
    }
  }
    

  // Función para cambiar estado y temperatura de varios equipos
  export async function updateGlobal(equipos, nuevoEstado = null, nuevoSetpoint = null) {
    const promises = equipos.map(async (equipo) => {
      try {
        // Si se ha pasado un nuevo estado, actualiza el estado
        if (nuevoEstado !== null) {
          await updateEstado(equipo, nuevoEstado);
          console.log(`Estado actualizado en el equipo ${equipo}`);
        }
  
        // Si se ha pasado un nuevo setpoint válido, actualiza la temperatura
        if (nuevoSetpoint !== null && nuevoSetpoint !== "") {
          await updateSetpoint(equipo, nuevoSetpoint);
          console.log(`Setpoint actualizado en el equipo ${equipo}`);
        }
  
      } catch (error) {
        console.error(`Error actualizando el equipo ${equipo}:`, error);
      }
    });
  
    // Ejecutar todas las promesas en paralelo
    await Promise.all(promises);
    console.log('Todos los equipos han sido actualizados.');
  }