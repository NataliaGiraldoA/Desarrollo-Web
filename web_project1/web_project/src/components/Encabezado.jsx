import "../styles/Encabezado.css"
import logo from "../images/logo.png"
import user from "../images/usuario.png"

function Encabezado() {
    return (
        <>
            <header className="encabezado">
                <nav className="nav">
                    <img className="logo" src={logo} alt="Logo" />
                    <div className="nav-center">
                        <ul className="nav-list">
                            <li> <a href="#">Home</a></li>
                            <li> <a href="#">Movies</a></li>
                        </ul>
                    </div>
                    <img className="user-logo" src={user} alt="User Logo" />
                </nav>
            </header>
        </>
    );
}

export default Encabezado;