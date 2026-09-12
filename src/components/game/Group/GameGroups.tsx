import { useEffect, useState } from "react";

import GroupSelector from "./GroupSelector";

import EmojiQuestion from "../EmojiQuestion";
import AnswerForm from "../AnswerForm";
import HintPanel from "../HintPanel";
import ScoreBoard from "../ScoreBoard";

import type { GameConfig } from "../../../types/GameConfig";
import type { Personaje } from "../../../types/Character";

interface GameGroupsProps {
  config: GameConfig;
  personaje: Personaje;
  ronda: number;
  puntosPorGrupo: Record<string, number>;
  onPuntosChange: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSiguienteRonda: () => void;
}

const GameGroups = ({
  config,
  personaje,
  ronda,
  puntosPorGrupo,
  onPuntosChange,
  onSiguienteRonda,
}: GameGroupsProps) => {
  const grupos = config.grupos ?? [];
  const [grupoActivo, setGrupoActivo] = useState(grupos[0] ?? "");

  const [respuesta, setRespuesta] = useState("");
  const [pistasMostradas, setPistasMostradas] = useState(0);

  const [intentosPorGrupo, setIntentosPorGrupo] = useState<
    Record<string, number>
  >(() => {
    const intentosIniciales: Record<string, number> = {};

    grupos.forEach((grupo) => {
      intentosIniciales[grupo] = 3;
    });

    return intentosIniciales;
  });

  const [mensajeIntentos, setMensajeIntentos] = useState(false);
  const [acierto, setAcierto] = useState<boolean | null>(null);

  // Reiniciar estado cada vez que cambia la ronda
  useEffect(() => {
    const intentosIniciales: Record<string, number> = {};

    grupos.forEach((grupo) => {
      intentosIniciales[grupo] = 3;
    });

    setIntentosPorGrupo(intentosIniciales);
    setRespuesta("");
    setPistasMostradas(0);
    setMensajeIntentos(false);
    setAcierto(null);

    if (grupos.length > 0) {
      setGrupoActivo((actual) =>
        grupos.includes(actual) ? actual : grupos[0],
      );
    }
  }, [ronda]);

  // Normalizar texto para poder comparar sin tildes ni mayúsculas
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
    }
  };

  // Comprobar respuesta
  const comprobarRespuesta = () => {
    const grupo = grupoActivo;
    const intentosActuales = intentosPorGrupo[grupo] ?? 3;

    // El grupo no tiene oportunidades
    if (intentosActuales <= 0) {
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

      // 3 puntos al primer intento
      const puntos = intentosActuales;

      onPuntosChange((actuales) => ({
        ...actuales,
        [grupo]: (actuales[grupo] ?? 0) + puntos,
      }));

      setTimeout(() => {
        onSiguienteRonda();
      }, 1500);

      return;
    }

    // RESPUESTA INCORRECTA
    setAcierto(false);

    const nuevosIntentos = Math.max(0, intentosActuales - 1);

    const nuevosIntentosPorGrupo = {
      ...intentosPorGrupo,
      [grupo]: nuevosIntentos,
    };

    setIntentosPorGrupo(nuevosIntentosPorGrupo);

    // Este grupo se ha quedado sin intentos
    if (nuevosIntentos <= 0) {
      setAcierto(null);
      setMensajeIntentos(true);
    }

    // Comprobar si TODOS los grupos se han quedado sin intentos
    const todosSinIntentos = grupos.every(
      (grupo) => (nuevosIntentosPorGrupo[grupo] ?? 3) <= 0,
    );

    if (todosSinIntentos) {
      setTimeout(() => {
        onSiguienteRonda();
      }, 1500);
    }
  };

  return (
    <>
      {/* MARCADOR */}
      <ScoreBoard
        ronda={ronda}
        jugadores={grupos.map((grupo) => ({
          nombre: grupo,
          puntos: puntosPorGrupo[grupo] ?? 0,
          activo: grupo === grupoActivo,
        }))}
      />
      <section className="game-card game-main-card mx-auto">
        <EmojiQuestion emojis={personaje.emojis} />

        {/* TARJETA PRINCIPAL */}
        <div className="row g-4 mt-2">
          {/* FORMULARIO */}
          <div className="col-12 col-lg-8">
            <div className="attempts-card h-100">
              <GroupSelector
                grupos={grupos}
                grupoActivo={grupoActivo}
                onSelect={setGrupoActivo}
              />

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
                  Ya no puedes seguir intentándolo. Dale la oportunidad a otros
                  grupos.
                </div>
              )}
            </div>
          </div>

          {/* OPORTUNIDADES */}
          <div className="col-12 col-lg-4">
            <div className="attempts-card attempts-blue-card h-100">
              <h3 className="section-title">Oportunidades</h3>

              <hr />

              {grupos.map((grupo) => (
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
              <hr className="mt-5"/>
              <p>
                ¡Piensa bien antes de responder!
              </p>
              <p className="small">En cada ronda podrás conseguir
                un máximo de 3 puntos. Pero ten cuidado, cada fallo te restará
                1 punto del total que puedes ganar en esta ronda. ¡¡No gastes
                tus oportunidades a la ligera!!</p>
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

export default GameGroups;
