import "../styles/Encabezado.css"

function Encabezado() {
    return (
        <>
            <header className="encabezado">
                <nav className="nav">
                    <ul className="nav-list">
                        <li> <a href="#">Home</a></li>
                        <li> <a href="#">Movies</a></li>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Encabezado;