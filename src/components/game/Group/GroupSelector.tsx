interface GroupSelectorProps {
    grupos: string[];
    grupoActivo: string;
    onSelect: (grupo: string) => void;
}

const GroupSelector = ({
    grupos,
    grupoActivo,
    onSelect,
}: GroupSelectorProps) => {
    if (grupos.length === 0) {
        return null;
    }

    return (
        <div className="mt-3">
            <label className="form-label fw-bold">
                Contesta el grupo:
            </label>

            <div className="d-flex flex-wrap gap-2">
                {grupos.map((grupo) => (
                    <button
                        key={grupo}
                        type="button"
                        className={`btn ${
                            grupoActivo === grupo
                                ? "btn-game-primary"
                                : "btn-outline-game"
                        }`}
                        onClick={() => onSelect(grupo)}
                    >
                        {grupo}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GroupSelector;