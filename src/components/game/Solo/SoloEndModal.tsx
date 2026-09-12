interface SoloEndModalProps {
  puntos: number;
  onSeguirJugando: () => void;
  onVolverInicio: () => void;
}

const SoloEndModal = ({
  puntos,
  onSeguirJugando,
  onVolverInicio,
}: SoloEndModalProps) => {
  return (
    <div className="game-modal-overlay">
      <div className="game-modal">
        <div className="game-modal-trophy">🏆</div>

        <h2>¡Partida terminada!</h2>

        <p className="game-modal-subtitle">
          ¡Has completado las 5 rondas!
        </p>

        <div className="winner-card">
          <span className="winner-medal">⭐</span>

          <h3>Puntuación final</h3>

          <strong>{puntos} pts</strong>
        </div>

        <div className="game-modal-buttons">
          <button className="btn-game-primary" onClick={onSeguirJugando}>
            Seguir Jugando
          </button>

          <button className="btn-game-secondary" onClick={onVolverInicio}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoloEndModal;