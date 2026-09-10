import { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import EmojiDisplay from "../components/game/EmojiDisplay";
import GroupSelector from "../components/game/GroupSelector";
import AnswerForm from "../components/game/AnswerForm";
import HintPanel from "../components/game/HintPanel";

import { obtenerPersonajeAleatorio } from "../services/CharacterService";

import type { GameConfig } from "../types/GameConfig";
import type { Personaje } from "../types/Character";

const Game = () => {
  //Inicialización de todo
  const location = useLocation();
  const navigate = useNavigate();

  const volverAlInicio = () => {
    navigate("/");
  };

  const config = location.state?.config as GameConfig | undefined;

  const [personaje, setPersonaje] = useState<Personaje | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [respuesta, setRespuesta] = useState("");
  const [pistasMostradas, setPistasMostradas] = useState(0);

  const [grupoActivo, setGrupoActivo] = useState(config?.grupos?.[0] ?? "");

  const [intentosPorGrupo, setIntentosPorGrupo] = useState<
    Record<string, number>
  >({});

  const [mensajeIntentos, setMensajeIntentos] = useState(false);

  const [puntosPorGrupo, setPuntosPorGrupo] = useState<Record<string, number>>(
    {},
  );

  const [acierto, setAcierto] = useState<boolean | null>(null);

  const [ronda, setRonda] = useState(1);
  const [partidaTerminada, setPartidaTerminada] = useState(false);

  //Obtiene personaje aleatorio
  useEffect(() => {
    if (config) {
      try {
        const personajeElegido = obtenerPersonajeAleatorio(
          config.tipo,
          config.dificultad,
        );

        setPersonaje(personajeElegido);
      } catch (err: any) {
        setError(err.message);
      }
    }
  }, [config]);

  //Comprobación de errores
  if (!config) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <div className="container py-4 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!personaje) {
    return (
      <div className="container py-4 text-center">Cargando personaje...</div>
    );
  }

  //Para que pase todo a minusculas y sin tildes para comprobarla
  const normalizarTexto = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  //PISTAS
  const revelarPista = () => {
    if (pistasMostradas < personaje.pistas.length && pistasMostradas < 2) {
      setPistasMostradas((actual) => actual + 1);
    }
  };

  // COMPROBACIÓN RESPUESTA, GESTIÓN INTENTOS Y PUNTOS
  const comprobarRespuesta = () => {
    const grupo = grupoActivo;
    const intentosActuales = intentosPorGrupo[grupo] ?? 3;

    // Si el grupo ya no tiene oportunidades, no puede responder
    // Si el grupo ya no tiene oportunidades, no puede responder
    if (intentosActuales <= 0) {
      setMensajeIntentos(true);
      return;
    }

    setMensajeIntentos(false);

    const respuestaNormalizada = normalizarTexto(respuesta);
    const personajeNormalizado = normalizarTexto(personaje.personaje);

    const esCorrecta = respuestaNormalizada === personajeNormalizado;

    if (esCorrecta) {
      setAcierto(true);

      // 3 puntos al primer intento, 2 al segundo y 1 al tercero
      const puntos = intentosActuales;

      setPuntosPorGrupo((actuales) => ({
        ...actuales,
        [grupo]: (actuales[grupo] ?? 0) + puntos,
      }));

      // La ronda termina porque un grupo ha acertado
      setTimeout(() => {
        siguienteRonda();
      }, 1500);
    } else {
      setAcierto(false);

      // Restamos una oportunidad, pero nunca bajamos de 0
      const nuevosIntentos = Math.max(0, intentosActuales - 1);

      setIntentosPorGrupo((actuales) => ({
        ...actuales,
        [grupo]: nuevosIntentos,
      }));

      if (nuevosIntentos <= 0) {
        setAcierto(null);
        setMensajeIntentos(true);
      }

      // Comprobar si todos los grupos se han quedado sin oportunidades
      const todosSinIntentos = config.grupos?.every(
        (grupo) =>
          (intentosPorGrupo[grupo] ?? 3) - (grupo === grupoActivo ? 1 : 0) <= 0,
      );


      //TO DO: Que salga un modal y avise de que ya no tienen oportunidades y se pasa a la siguiente ronda 
      if (todosSinIntentos) {
        setTimeout(() => {
          siguienteRonda();
        }, 1500);
      }
    }
  };

  // CONTROL DE RONDAS
  const siguienteRonda = () => {
    // Si hemos terminado las 5 rondas
    if (ronda >= 5) {
      setPartidaTerminada(true);
      return;
    }

    // Pasamos a la siguiente ronda
    setRonda((actual) => actual + 1);

    // Reiniciamos los intentos
    const intentosIniciales: Record<string, number> = {};

    config.grupos?.forEach((grupo) => {
      intentosIniciales[grupo] = 3;
    });

    setIntentosPorGrupo(intentosIniciales);

    // Reiniciamos el estado de la ronda
    setAcierto(null);
    setRespuesta("");
    setPistasMostradas(0);
    setMensajeIntentos(false);

    // Nuevo personaje
    const nuevoPersonaje = obtenerPersonajeAleatorio(
      config.tipo,
      config.dificultad,
    );

    setPersonaje(nuevoPersonaje);
  };

  // BOTÓN SEGUIR JUGANDO
  const seguirJugando = () => {
    setPartidaTerminada(false);
    setRonda(1);

    // Reiniciamos los intentos
    const intentosIniciales: Record<string, number> = {};

    config.grupos?.forEach((grupo) => {
      intentosIniciales[grupo] = 3;
    });

    setIntentosPorGrupo(intentosIniciales);

    setAcierto(null);
    setRespuesta("");
    setPistasMostradas(0);

    // Nuevo personaje
    const nuevoPersonaje = obtenerPersonajeAleatorio(
      config.tipo,
      config.dificultad,
    );

    setPersonaje(nuevoPersonaje);
  };

  //CALCULAR GANADOR
  // CALCULAR GANADOR
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
        {/* Marcador */}
        {config.modo === "grupos" && (
          <section className="mb-4">
            <h2 className="section-title">
              Ronda: {ronda}/5. Marcador de los grupos
            </h2>

            <div className="row g-2">
              {config.grupos?.map((grupo) => (
                <div key={grupo} className="col-6 col-md">
                  <div
                    className={`score-card ${
                      grupo === grupoActivo ? "active" : ""
                    }`}
                  >
                    <strong>GRUPO</strong>
                    <hr />

                    <h3>{grupo}</h3>
                    <div className="score fs-2">
                      {puntosPorGrupo[grupo] ?? 0} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tarjeta principal */}
        <section className="game-card game-main-card mx-auto">
          <div className="text-center">
            <p className="question-title">
              ¿QUÉ PERSONAJE DESCRIBEN ESTOS SÍMBOLOS?
            </p>

            <EmojiDisplay emojis={personaje.emojis} />

            <p className="mt-2">Adivina al personaje!!</p>
          </div>

          {/* Selector + formulario + intentos */}
          <div className="row g-4 mt-2">
            {/* Formulario */}
            <div className="col-12 col-lg-8">
              <div className="attempts-card h-100">
                {config.modo === "grupos" && (
                  <GroupSelector
                    grupos={config.grupos ?? []}
                    grupoActivo={grupoActivo}
                    onSelect={setGrupoActivo}
                  />
                )}

                <div className="mt-3">
                  <AnswerForm
                    respuesta={respuesta}
                    onRespuestaChange={setRespuesta}
                    onComprobar={comprobarRespuesta}
                    deshabilitado={
                      acierto === true ||
                      (intentosPorGrupo[grupoActivo] ?? 3) <= 0
                    }
                  />
                </div>

                {acierto !== null && (
                  <div
                    className={`alert ${
                      acierto ? "alert-success" : "alert-danger"
                    } mt-3`}
                  >
                    {acierto
                      ? "¡Correcto! Pasamos al siguiente!!"
                      : "No es correcto. ¡Inténtalo de nuevo!"}
                  </div>
                )}

                {mensajeIntentos && (
                  <div className="alert alert-info mt-3">
                    <strong>¡Has acabado tus intentos!</strong>
                    <br />
                    Ya no puedes seguir intentándolo. Dale la oportunidad a
                    otros grupos.
                  </div>
                )}
              </div>
            </div>

            {/* Intentos */}
            <div className="col-12 col-lg-4">
              <div className="attempts-card attempts-blue-card h-100">
                <h3 className="section-title">Oportunidades </h3>
                <hr></hr>
                {config.grupos?.map((grupo) => (
                  <div
                    key={grupo}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span>{grupo}</span>

                    <strong className="attempts-number">
                      {intentosPorGrupo[grupo] ?? 3}/3
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Pistas debajo de las dos columnas */}
            <div className="col-12">
              <HintPanel
                pistas={personaje.pistas}
                pistasMostradas={pistasMostradas}
                onRevelar={revelarPista}
              />
            </div>
          </div>
          <div className="game-modal-buttons mt-4">
              <button className="btn-game-primary" onClick={volverAlInicio}>
                Volver al inicio
              </button>
            </div>
        </section>
      </main>

      <Footer />

      {/* Modal de partida terminada */}
      {partidaTerminada && (
        <div className="game-modal-overlay">
          <div className="game-modal">
            <div className="game-modal-trophy">🏆</div>

            <h2>¡Partida terminada!</h2>

            <p className="game-modal-subtitle">¡Tenemos un ganador!</p>

            <div className="winner-card">
              <span className="winner-medal">🥇</span>

              <h3>{ganador}</h3>

              <strong>{puntosPorGrupo[ganador] ?? 0} pts</strong>
            </div>

            <div className="final-scores">
              {config.grupos?.map((grupo) => (
                <div
                  key={grupo}
                  className={`final-score ${grupo === ganador ? "winner" : ""}`}
                >
                  <span>{grupo}</span>
                  <strong>{puntosPorGrupo[grupo] ?? 0} pts</strong>
                </div>
              ))}
            </div>

            <div className="game-modal-buttons">
              <button className="btn-game-primary" onClick={seguirJugando}>
                Seguir jugando
              </button>

              <button className="btn-game-secondary" onClick={volverAlInicio}>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
