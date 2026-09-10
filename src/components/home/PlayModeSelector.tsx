interface PlayModeSelectorProps {
    modo: "solitario" | "grupos" | null;
    onSelect: (modo: "solitario" | "grupos") => void;
}

const PlayModeSelector = ({
    modo,
    onSelect,
}: PlayModeSelectorProps) => {
    return (
        <div className="text-center mt-4">
            <h2 className="section-title">
                ¿Cómo queréis jugar?
            </h2>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                    type="button"
                    className={`btn ${
                        modo === "solitario"
                            ? "btn-game-primary"
                            : "btn-outline-game"
                    }`}
                    onClick={() => onSelect("solitario")}
                >
                    👤 Solitario
                </button>

                <button
                    type="button"
                    className={`btn ${
                        modo === "grupos"
                            ? "btn-game-primary"
                            : "btn-outline-game"
                    }`}
                    onClick={() => onSelect("grupos")}
                >
                    👥 Competición en grupos
                </button>
            </div>
        </div>
    );
};

export default PlayModeSelector;