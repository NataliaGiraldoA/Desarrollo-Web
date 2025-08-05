import "./Encabezado.css";

function Encabezado() {
    const titulo = "Hola Valerie"

    return (
        <>
            <header className="encabezado">
                <h1>{titulo}</h1>
                <p>Hola kevin</p>
            </header>
        </>
    );
}

export default Encabezado;