import { useState } from "react";

import { obtenerPersonajeAleatorio } from "../../services/CharacterService";

import type { GameConfig } from "../../types/GameConfig";
import type { Personaje } from "../../types/Character";

interface SkipCharacterButtonProps {
  config: GameConfig;
  onSkip: (personaje: Personaje) => void;
}

const SkipCharacterButton = ({
  config,
  onSkip,
}: SkipCharacterButtonProps) => {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const saltarPersonaje = () => {
    try {
      const nuevoPersonaje = obtenerPersonajeAleatorio(
        config.tipo,
        config.dificultad,
      );

      setMostrarConfirmacion(false);
      onSkip(nuevoPersonaje);
    } catch (err) {
      console.error(err);
    }
  };

  if (mostrarConfirmacion) {
    return (
      <div className="game-skip-confirmation hint-panel text-center w-100">
        <p className="mb-2">
          <strong>¿Seguro que quieres saltar este personaje?</strong>
        </p>

        <p className="mb-3">
          Al pasar el personaje no se contarán puntos.
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn-game-secondary"
            onClick={() => setMostrarConfirmacion(false)}
          >
            No
          </button>

          <button
            className="btn-game-primary"
            onClick={saltarPersonaje}
          >
            Sí, saltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="btn-game-secondary"
      onClick={() => setMostrarConfirmacion(true)}
    >
      Saltar personaje
    </button>
  );
};

export default SkipCharacterButton;