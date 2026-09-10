import personajes from "../data/Character.json";
import type { Personaje } from "../types/Character";

type Dificultad =  "normal" | "facil" | "medio" | "dificil";

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

// TO DO: comprobar que no salga 2 veces el mismo personaje en la misma ronda
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

    const indiceAleatorio = Math.floor(
        Math.random() * personajesDisponibles.length
    );

    return personajesDisponibles[indiceAleatorio];
};