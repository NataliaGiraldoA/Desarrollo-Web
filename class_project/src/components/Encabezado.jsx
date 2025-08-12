import "./Encabezado.css";

function Encabezado() {
    const titulo = "React + Vite";
    return (
        <>
            <header className="encabezado">
                <h1>{titulo}</h1>
                <p>Parrafo</p>
            </header>
        </>
    );
}
export default Encabezado;