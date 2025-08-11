import "../styles/Encabezado.css"

function Encabezado() {
    return (
        <>
            <header className="encabezado">
                <nav className="nav">
                    <ul className="nav-list">
                        <li> <a href="#">Inicio</a></li>
                        <li> <a href="#">Peliculas</a></li>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Encabezado;