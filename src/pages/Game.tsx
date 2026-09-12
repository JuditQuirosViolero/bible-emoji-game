import { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SkipCharacterButton from "../components/game/SkipCharacterButton";
import GameGroups from "../components/game/Group/GameGroups";
import GameSolo from "../components/game/Solo/GameSolo";
import GroupEndModal from "../components/game/Group/GroupEndModal";
import SoloEndModal from "../components/game/Solo/SoloEndModal";

import { obtenerPersonajeAleatorio } from "../services/CharacterService";

import type { GameConfig } from "../types/GameConfig";
import type { Personaje } from "../types/Character";

const Game = () => {
  //Inicialización de todo
  const location = useLocation();
  const navigate = useNavigate();

  const [mostrarConfirmacionSalir, setMostrarConfirmacionSalir] =
    useState(false);

  const volverAlInicio = () => {
    navigate("/");
  };

  const config = location.state?.config as GameConfig | undefined;

  const [personaje, setPersonaje] = useState<Personaje | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [ronda, setRonda] = useState(1);
  const [partidaTerminada, setPartidaTerminada] = useState(false);

  // Puntuación de los grupos
  const [puntosPorGrupo, setPuntosPorGrupo] = useState<Record<string, number>>(
    {},
  );
  // Puntuación Solitario
  const [puntosSolo, setPuntosSolo] = useState(0);
  const registrarPuntosSolo = (puntosRonda: number) => {
    setPuntosSolo((actual) => actual + puntosRonda);
  };

  // Obtener personaje inicial
  useEffect(() => {
    if (!config) {
      return;
    }

    try {
      const personajeElegido = obtenerPersonajeAleatorio(
        config.tipo,
        config.dificultad,
      );

      setPersonaje(personajeElegido);
    } catch (err: any) {
      setError(err.message);
    }
  }, [config]);

  // Pasar a la siguiente ronda
  const siguienteRonda = () => {
    if (ronda >= 5) {
      setPartidaTerminada(true);
      return;
    }

    setRonda((actual) => actual + 1);

    try {
      const nuevoPersonaje = obtenerPersonajeAleatorio(
        config!.tipo,
        config!.dificultad,
      );

      setPersonaje(nuevoPersonaje);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Empezar otra partida
  const seguirJugando = () => {
    setPartidaTerminada(false);
    setRonda(1);

    // Reiniciamos las puntuaciones de los grupos
    setPuntosPorGrupo({});

    try {
      const nuevoPersonaje = obtenerPersonajeAleatorio(
        config!.tipo,
        config!.dificultad,
      );

      setPersonaje(nuevoPersonaje);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Si no hay configuración, volvemos al inicio
  if (!config) {
    return <Navigate to="/" replace />;
  }

  // Error al obtener personaje
  if (error) {
    return (
      <div className="container py-4 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // Mientras carga el personaje
  if (!personaje) {
    return (
      <div className="container py-4 text-center">Cargando personaje...</div>
    );
  }

  // Ganador de grupos
  const ganador =
    config.grupos?.reduce((ganadorActual, grupo) => {
      const puntosActuales = puntosPorGrupo[grupo] ?? 0;
      const puntosGanador = puntosPorGrupo[ganadorActual] ?? 0;

      return puntosActuales > puntosGanador ? grupo : ganadorActual;
    }, config.grupos?.[0] ?? "") ?? "";

  return (
    <div className="app-container">
      <Header />

      <main className="container py-4 flex-grow-1">
        <section className="game-main-card mx-auto">
          {/* MODO GRUPOS */}
          {config.modo === "grupos" && (
            <GameGroups
              config={config}
              personaje={personaje}
              ronda={ronda}
              puntosPorGrupo={puntosPorGrupo}
              onPuntosChange={setPuntosPorGrupo}
              onSiguienteRonda={siguienteRonda}
            />
          )}

          {/* MODO SOLO */}
          {config.modo === "solitario" && (
            <GameSolo
              config={config}
              personaje={personaje}
              ronda={ronda}
              puntosTotales={puntosSolo}
              onRondaTerminada={registrarPuntosSolo}
              onSiguienteRonda={siguienteRonda}
            />
          )}

          <div className="game-modal-buttons mt-3">
            <SkipCharacterButton config={config} onSkip={setPersonaje} />
            <button
              className="btn-game-primary"
              onClick={() => setMostrarConfirmacionSalir(true)}
            >
              Volver al inicio
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* MODAL CONFIRMACIÓN DE SALIDA AL MENÚ PRINCIPAL*/}
      {mostrarConfirmacionSalir && (
        <div className="game-modal-overlay">
          <div className="game-modal">
            <h2>¿Volver al inicio?</h2>

            <p>
              Al volver al inicio saldrás de esta partida y ya no podrás volver
              a recuperarla.
            </p>

            <div className="game-modal-buttons">
              <button
                className="btn-game-secondary"
                onClick={() => setMostrarConfirmacionSalir(false)}
              >
                Cancelar
              </button>

              <button className="btn-game-primary" onClick={volverAlInicio}>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FINAL DE GRUPOS */}
      {partidaTerminada && config.modo === "grupos" && (
        <GroupEndModal
          grupos={config.grupos ?? []}
          puntosPorGrupo={puntosPorGrupo}
          ganador={ganador}
          onSeguirJugando={seguirJugando}
          onVolverInicio={volverAlInicio}
        />
      )}

      {/* MODAL FINAL DE SOLITARIO */}
      {partidaTerminada && config.modo === "solitario" && (
        <SoloEndModal
          puntos={puntosSolo}
          onSeguirJugando={seguirJugando}
          onVolverInicio={volverAlInicio}
        />
      )}
    </div>
  );
};

export default Game;
