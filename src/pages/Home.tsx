import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../src/components/Header";
import Footer from "../components/Footer";
import GameModeSelector from "../components/home/GameModeSelector";
import DifficultySelector from "../components/home/DifficultySelector";
import PlayModeSelector from "../components/home/PlayModeSelector";
import TeamForm from "../components/home/TeamForm";

import type { GameConfig } from "../types/GameConfig";

const Home = () => {
  const navigate = useNavigate();

  const [empezar, setEmpezar] = useState(false);
  const [tipo, setTipo] = useState<"nino" | "adulto" | null>(null);

  const [dificultad, setDificultad] = useState<
    "normal" | "facil" | "medio" | "dificil" | null
  >(null);

  const [modo, setModo] = useState<"solitario" | "grupos" | null>(null);
  const [nombreJugador, setNombreJugador] = useState("");
  const [numeroGrupos, setNumeroGrupos] = useState(2);
  const [grupos, setGrupos] = useState<string[]>(["", ""]);

  const seleccionarTipo = (nuevoTipo: "nino" | "adulto") => {
    setTipo(nuevoTipo);

    // Al cambiar de tipo, reiniciamos lo que depende de él
    setDificultad(null);
    setModo(null);
  };

  const seleccionarDificultad = (
    nuevaDificultad: "normal" | "facil" | "medio" | "dificil",
  ) => {
    setDificultad(nuevaDificultad);

    // Si cambia la dificultad, todavía no ha elegido modo
    setModo(null);
  };

  const seleccionarModo = (nuevoModo: "solitario" | "grupos") => {
    setModo(nuevoModo);

    if (nuevoModo === "grupos") {
      setNumeroGrupos(2);
      setGrupos(["", ""]);
    }
  };

  const puedeEmpezar = () => {
    if (!tipo || !dificultad || !modo) {
      return false;
    }

    if (modo === "solitario") {
      return nombreJugador.trim() !== "";
    }

    return (
      grupos.length === numeroGrupos &&
      grupos.every((grupo) => grupo.trim() !== "")
    );
  };

  const empezarPartida = () => {
    if (!tipo || !dificultad || !modo) {
      return;
    }

    const config: GameConfig = {
      tipo,
      dificultad,
      modo,
    };

    if (modo === "solitario") {
      config.nombreJugador = nombreJugador.trim();
    } else {
      config.grupos = grupos.map((grupo) => grupo.trim());
    }

    console.log("Configuración de la partida:", config);

    navigate("/game", {
      state: {
        config,
      },
    });
  };

  return (
    <div className="app-container">
      <Header />

      <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-4">
        <div className="game-card p-4 w-75">
          {!empezar ? (
            <div className="text-center">
              <div className="welcome-icon">🏺</div>

              <h2 className="home-title">¡Prepárate para jugar!</h2>

              <p>Pon a prueba tus conocimientos bíblicos a través de emojis.</p>

              <button
                type="button"
                className="btn btn-game-primary btn-lg px-5"
                onClick={() => setEmpezar(true)}
              >
                <i className="bi bi-play-fill pe-2"></i>
                Jugar
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="d-flex align-items-center mb-3">
                  <button
                    type="button"
                    className="btn btn-link text-dark p-0 me-3"
                    onClick={() => setEmpezar(false)}
                    aria-label="Volver atrás"
                    title="Volver atrás"
                  >
                    <i className="bi bi-arrow-left fs-4"></i>
                  </button>

                  <h2 className="home-title mb-0">Configura tu partida</h2>
                </div>

                <p className="home-text mb-0">
                  Elige las opciones para comenzar.
                </p>
              </div>

              <GameModeSelector tipo={tipo} onSelect={seleccionarTipo} />

              {tipo && (
                <DifficultySelector
                  tipo={tipo}
                  dificultad={dificultad}
                  onSelect={seleccionarDificultad}
                />
              )}

              {tipo && dificultad && (
                <PlayModeSelector modo={modo} onSelect={seleccionarModo} />
              )}

              {modo === "solitario" && (
                <div className="mt-4">
                  <label htmlFor="nombreJugador" className="form-label">
                    ¿Cómo te llamas?
                  </label>

                  <input
                    id="nombreJugador"
                    type="text"
                    className="form-control game-input"
                    placeholder="Escribe tu nombre"
                    value={nombreJugador}
                    onChange={(event) => setNombreJugador(event.target.value)}
                  />
                </div>
              )}

              {modo === "grupos" && (
                <TeamForm
                  grupos={grupos}
                  numeroGrupos={numeroGrupos}
                  onNumeroGruposChange={setNumeroGrupos}
                  onGruposChange={setGrupos}
                />
              )}

              {modo && (
                <div className="text-center mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-game-primary btn-lg px-5"
                    disabled={!puedeEmpezar()}
                    onClick={empezarPartida}
                  >
                    <i className="bi bi-play-fill pe-2"></i>
                    ¡Empezar a jugar!
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
