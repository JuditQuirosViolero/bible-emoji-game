import personajes from "../data/Character.json";
import type { Personaje } from "../types/Character";

type Dificultad = "normal" | "facil" | "medio" | "dificil";

const obtenerNivel = (
    tipo: "nino" | "adulto",
    dificultad: Dificultad
) => {
    if (tipo === "nino") {
        return dificultad === "normal"
            ? "facil"
            : "medio";
    }

    return dificultad;
};

export const obtenerPersonajes = (): Personaje[] => {
    return personajes as Personaje[];
};

// Personajes que han aparecido recientemente
const historialPersonajes: string[] = [];

// Máximo de personajes que recordamos
const MAX_HISTORIAL = 20;

export const obtenerPersonajeAleatorio = (
    tipo: "nino" | "adulto",
    dificultad: Dificultad
): Personaje => {
    const nivel = obtenerNivel(tipo, dificultad);

    const personajesDisponibles = obtenerPersonajes().filter(
        (personaje) => personaje.niveles.includes(nivel)
    );

    if (personajesDisponibles.length === 0) {
        throw new Error(
            `No hay personajes disponibles para el nivel ${nivel}`
        );
    }

    // Evitamos personajes que hayan aparecido recientemente
    let personajesSinRepetir = personajesDisponibles.filter(
        (personaje) => !historialPersonajes.includes(personaje.personaje)
    );

    // Si no quedan personajes disponibles, permitimos
    // reutilizar los más antiguos del historial
    if (personajesSinRepetir.length === 0) {
        const historialReciente = historialPersonajes.slice(
            -Math.floor(MAX_HISTORIAL / 2)
        );

        personajesSinRepetir = personajesDisponibles.filter(
            (personaje) => !historialReciente.includes(personaje.personaje)
        );
    }

    const indiceAleatorio = Math.floor(
        Math.random() * personajesSinRepetir.length
    );

    const personajeElegido = personajesSinRepetir[indiceAleatorio];

    // Guardamos el personaje
    historialPersonajes.push(personajeElegido.personaje);

    // Limitamos el tamaño del historial
    if (historialPersonajes.length > MAX_HISTORIAL) {
        historialPersonajes.shift();
    }

    return personajeElegido;
};