interface AnswerFormProps {
    respuesta: string;
    onRespuestaChange: (respuesta: string) => void;
    onComprobar: () => void;
    deshabilitado?: boolean;
}

const AnswerForm = ({
    respuesta,
    onRespuestaChange,
    onComprobar,
    deshabilitado = false,
}: AnswerFormProps) => {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onComprobar();
            }}
        >
            <label
                htmlFor="respuesta"
                className="form-label"
            >
                Introduce el nombre del personaje:
            </label>

            <input
                id="respuesta"
                type="text"
                className="form-control game-input"
                placeholder="Escribe el nombre del personaje"
                value={respuesta}
                onChange={(event) =>
                    onRespuestaChange(event.target.value)
                }
                disabled={deshabilitado}
            />

            <button
                type="submit"
                className="btn btn-game-primary w-100 mt-3"
                disabled={
                    deshabilitado ||
                    respuesta.trim() === ""
                }
            >
                Comprobar respuesta
            </button>
        </form>
    );
};

export default AnswerForm;