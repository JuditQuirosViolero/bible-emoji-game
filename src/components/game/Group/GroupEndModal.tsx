interface GroupEndModalProps {
  grupos: string[];
  puntosPorGrupo: Record<string, number>;
  ganador: string;
  onSeguirJugando: () => void;
  onVolverInicio: () => void;
}

const GroupEndModal = ({
  grupos,
  puntosPorGrupo,
  ganador,
  onSeguirJugando,
  onVolverInicio,
}: GroupEndModalProps) => {
  return (
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
          {grupos.map((grupo) => (
            <div
              key={grupo}
              className={`final-score ${
                grupo === ganador ? "winner" : ""
              }`}
            >
              <span>{grupo}</span>

              <strong>{puntosPorGrupo[grupo] ?? 0} pts</strong>
            </div>
          ))}
        </div>

        <div className="game-modal-buttons">
          <button className="btn-game-primary" onClick={onSeguirJugando}>
            Seguir jugando
          </button>

          <button className="btn-game-secondary" onClick={onVolverInicio}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupEndModal;