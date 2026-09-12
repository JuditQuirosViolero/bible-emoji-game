import { useEffect, useState } from "react";

import AnswerForm from "../AnswerForm";
import HintPanel from "../HintPanel";
import ScoreBoard from "../ScoreBoard";
import EmojiQuestion from "../EmojiQuestion";

import type { GameConfig } from "../../../types/GameConfig";
import type { Personaje } from "../../../types/Character";

interface GameSoloProps {
  config: GameConfig;
  personaje: Personaje;
  ronda: number;
  puntosTotales: number;
  onRondaTerminada: (puntosRonda: number) => void;
  onSiguienteRonda: () => void;
}

const GameSolo = ({
  config,
  personaje,
  ronda,
  puntosTotales,
  onRondaTerminada,
  onSiguienteRonda,
}: GameSoloProps) => {
  const [respuesta, setRespuesta] = useState("");
  const [pistasMostradas, setPistasMostradas] = useState(0);

  // 5 oportunidades por ronda
  const [intentos, setIntentos] = useState(5);

  // Puntos internos de la ronda
  const [puntos, setPuntos] = useState(10);

  const [acierto, setAcierto] = useState<boolean | null>(null);

  const [mensajeIntentos, setMensajeIntentos] = useState(false);

  // Reiniciar la ronda
  useEffect(() => {
    setRespuesta("");
    setPistasMostradas(0);
    setIntentos(5);
    setPuntos(10);
    setAcierto(null);
    setMensajeIntentos(false);
  }, [ronda]);

  // Normalizar texto
  const normalizarTexto = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Mostrar pista
  const revelarPista = () => {
    if (pistasMostradas < personaje.pistas.length && pistasMostradas < 2) {
      setPistasMostradas((actual) => actual + 1);

      // Cada pista resta 1 punto
      setPuntos((actual) => Math.max(0, actual - 1));
    }
  };

  // Terminar ronda y guardar los puntos conseguidos
  const terminarRonda = (puntosFinales: number) => {
    onRondaTerminada(puntosFinales);

    setTimeout(() => {
      onSiguienteRonda();
    }, 1500);
  };

  // Comprobar respuesta
  const comprobarRespuesta = () => {
    // Si no quedan intentos
    if (intentos <= 0) {
      setMensajeIntentos(true);
      return;
    }

    setMensajeIntentos(false);

    const respuestaNormalizada = normalizarTexto(respuesta);
    const personajeNormalizado = normalizarTexto(personaje.personaje);

    const esCorrecta = respuestaNormalizada === personajeNormalizado;

    // RESPUESTA CORRECTA
    if (esCorrecta) {
      setAcierto(true);
      terminarRonda(puntos);
      return;
    }

    // RESPUESTA INCORRECTA
    setAcierto(false);

    const nuevosIntentos = Math.max(0, intentos - 1);
    const nuevosPuntos = Math.max(0, puntos - 2);

    setIntentos(nuevosIntentos);
    setPuntos(nuevosPuntos);

    // Se han acabado los intentos
    if (nuevosIntentos <= 0) {
      setMensajeIntentos(true);

      terminarRonda(nuevosPuntos);
    }
  };

  return (
    <>
      {/* MARCADOR SOLO */}
      <ScoreBoard
        ronda={ronda}
        jugadores={[
          {
            nombre: config.nombreJugador || "Jugador",
            puntos: puntosTotales,
            activo: true,
          },
        ]}
      />

      <section className="game-card game-main-card mx-auto">
        <EmojiQuestion emojis={personaje.emojis} />

        <div className="row g-4 mt-2">
          {/* FORMULARIO */}
          <div className="col-12 col-lg-8">
            <div className="attempts-card h-100">
              <AnswerForm
                respuesta={respuesta}
                onRespuestaChange={setRespuesta}
                onComprobar={comprobarRespuesta}
                deshabilitado={acierto === true || intentos <= 0}
              />

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
                  Pasamos a la siguiente ronda.
                </div>
              )}
            </div>
          </div>

          {/* OPORTUNIDADES */}
          <div className="col-12 col-lg-4">
            <div className="attempts-card attempts-blue-card h-100">
              <h3 className="section-title">Oportunidades</h3>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Restantes</span>

                <strong className="attempts-number">{intentos}/5</strong>
              </div>
              <hr className="mt-5" />

              <p>¡Piensa bien antes de responder!</p>
              <p className="small">
                En cada ronda podrás conseguir un máximo de 10 puntos. Pero ten
                cuidado, cada fallo te restará 2 punto del total que puedes
                ganar en esta ronda. ¡¡No gastes tus oportunidades a la ligera!!
              </p>
            </div>
          </div>

          {/* PISTAS */}
          <div className="col-12">
            <HintPanel
              pistas={personaje.pistas}
              pistasMostradas={pistasMostradas}
              onRevelar={revelarPista}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default GameSolo;
