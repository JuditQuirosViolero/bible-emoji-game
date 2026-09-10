interface DifficultySelectorProps {
    tipo: "nino" | "adulto";
    dificultad:
        | "normal"
        | "facil"
        | "medio"
        | "dificil"
        | null;
    onSelect: (
        dificultad:
            | "normal"
            | "facil"
            | "medio"
            | "dificil"
    ) => void;
}

const DifficultySelector = ({
    tipo,
    dificultad,
    onSelect,
}: DifficultySelectorProps) => {
    const dificultades =
        tipo === "nino"
            ? [
                  { value: "normal", label: "Normal" },
                  { value: "dificil", label: "Difícil" },
              ]
            : [
                  { value: "facil", label: "Fácil" },
                  { value: "medio", label: "Medio" },
                  { value: "dificil", label: "Difícil" },
              ];

    return (
        <div className="text-center mt-4">
            <h2 className="section-title">
                ¿Qué dificultad?
            </h2>

            <div className="d-flex justify-content-center gap-2 flex-wrap">
                {dificultades.map((opcion) => (
                    <button
                        key={opcion.value}
                        type="button"
                        className={`btn ${
                            dificultad === opcion.value
                                ? "btn-game-primary"
                                : "btn-outline-game"
                        }`}
                        onClick={() =>
                            onSelect(opcion.value as
                                | "normal"
                                | "facil"
                                | "medio"
                                | "dificil")
                        }
                    >
                        {opcion.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DifficultySelector;