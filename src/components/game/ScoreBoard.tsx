interface ScoreBoardProps {
  ronda: number;
  jugadores: {
    nombre: string;
    puntos: number;
    activo?: boolean;
  }[];
}

const ScoreBoard = ({
  ronda,
  jugadores,
}: ScoreBoardProps) => {
  return (
    <section className="mb-4">
      <h2 className="section-title">
        Ronda: {ronda}/5. Marcador
      </h2>

      <div className="row g-2">
        {jugadores.map((jugador) => (
          <div key={jugador.nombre} className="col-6 col-md">
            <div
              className={`score-card ${
                jugador.activo ? "active" : ""
              }`}
            >
              <strong>
                {jugadores.length === 1 ? "PUNTUACIÓN" : "GRUPO"}
              </strong>

              <hr />

                <h3>{jugador.nombre}</h3>

              <div className="score fs-2">
                {jugador.puntos} pts
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScoreBoard;