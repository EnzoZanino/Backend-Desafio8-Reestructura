//! INICIO SIN IMPORTS
//* EXPORTS hacia PRODUCTS DATA

/* const data = [
    {
        name: "Teclado Midi - Arturia Micro Freak",
        price: 250,
        id: 1,
    },
    {
        name: "Auriculares AKG240",
        price: 210,
        id: 2,
    },
    {
        name: "Monitores KRK",
        price: 457,
        id: 3,
    },
    {
        name: "Microfono Hyperx",
        price: 89,
        id: 4,
    },
    {
        name: "Placa de sonido Focus Ride Scarlett",
        price: 140,
        id: 5,
    },
    {
        name: "Korg Ms20 Mini Sintetizador Analógico",
        price: 590,
        id: 6,
    },
]; */

// Metodos 
// recuperarDatos, guardarDato, deleById

export const recuperarDatos = () => {
    // Logica
    return data;
}

export const guardarDato = (dato) => {
    // Logica de validacion
    data.push(dato)
    return dato;
}


export const deleById = () => {
    // logica
    // desarrollar logica de JS para: 
    // - Buscar por el id y luego eliminar el dato
}