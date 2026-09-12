interface GameModeSelectorProps {
    tipo: "nino" | "adulto" | null;
    onSelect: (tipo: "nino" | "adulto") => void;
}

const GameModeSelector = ({
    tipo,
    onSelect,
}: GameModeSelectorProps) => {
    return (
        <div className="text-center">
            <h2 className="section-title">
                ¿Quién va a jugar?
            </h2>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                    type="button"
                    className={`btn ${
                        tipo === "nino"
                            ? "btn-game-primary"
                            : "btn-outline-game"
                    }`}
                    onClick={() => onSelect("nino")}
                >
                    👦🏻 Niño
                </button>

                <button
                    type="button"
                    className={`btn ${
                        tipo === "adulto"
                            ? "btn-game-primary"
                            : "btn-outline-game"
                    }`}
                    onClick={() => onSelect("adulto")}
                >
                    👨🏻 Adulto
                </button>
            </div>
        </div>
    );
};

export default GameModeSelector;