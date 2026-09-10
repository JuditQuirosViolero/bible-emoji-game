interface HintPanelProps {
    pistas: string[];
    pistasMostradas: number;
    onRevelar: () => void;
}

const HintPanel = ({
    pistas,
    pistasMostradas,
    onRevelar,
}: HintPanelProps) => {
    const puedeRevelar =
        pistasMostradas < pistas.length &&
        pistasMostradas < 2;

    return (
        <div className="hint-panel mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="section-title mb-0">
                    Pergamino de pistas
                </h3>

                <button
                    type="button"
                    className="btn btn-game-secondary btn-sm"
                    onClick={onRevelar}
                    disabled={!puedeRevelar}
                >
                    Revelar pista
                </button>
            </div>

            {pistasMostradas === 0 ? (
                <p className="small mb-0">
                    Todavía no has revelado ninguna pista.
                </p>
            ) : (
                pistas
                    .slice(0, pistasMostradas)
                    .map((pista, index) => (
                        <p
                            key={index}
                            className="mb-2"
                        >
                            <strong>
                                Pista {index + 1}:
                            </strong>{" "}
                            {pista}
                        </p>
                    ))
            )}
        </div>
    );
};

export default HintPanel;