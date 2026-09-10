interface TeamFormProps {
    grupos: string[];
    numeroGrupos: number;
    onNumeroGruposChange: (numero: number) => void;
    onGruposChange: (grupos: string[]) => void;
}

const TeamForm = ({
    grupos,
    numeroGrupos,
    onNumeroGruposChange,
    onGruposChange,
}: TeamFormProps) => {
    const cambiarNumeroGrupos = (numero: number) => {
        const nuevosGrupos = Array.from(
            { length: numero },
            (_, index) => grupos[index] ?? ""
        );

        onNumeroGruposChange(numero);
        onGruposChange(nuevosGrupos);
    };

    const cambiarNombreGrupo = (
        index: number,
        nombre: string
    ) => {
        const nuevosGrupos = [...grupos];
        nuevosGrupos[index] = nombre;

        onGruposChange(nuevosGrupos);
    };

    return (
        <div className="mt-4">
            <h2 className="section-title text-center">
                ¿Cuántos grupos vais a ser?
            </h2>

            <div className="d-flex justify-content-center gap-2 mb-4">
                {[2, 3, 4, 5].map((numero) => (
                    <button
                        key={numero}
                        type="button"
                        className={`btn ${
                            numeroGrupos === numero
                                ? "btn-game-primary"
                                : "btn-outline-game"
                        }`}
                        onClick={() =>
                            cambiarNumeroGrupos(numero)
                        }
                    >
                        {numero}
                    </button>
                ))}
            </div>

            <div className="row g-3">
                {grupos.map((grupo, index) => (
                    <div
                        className="col-12 col-md-6"
                        key={index}
                    >
                        <label
                            htmlFor={`grupo-${index}`}
                            className="form-label"
                        >
                            Nombre del grupo {index + 1}
                        </label>

                        <input
                            id={`grupo-${index}`}
                            type="text"
                            className="form-control game-input"
                            placeholder={`Grupo ${index + 1}`}
                            value={grupo}
                            onChange={(event) =>
                                cambiarNombreGrupo(
                                    index,
                                    event.target.value
                                )
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamForm;