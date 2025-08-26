import "../styles/Encabezado.css"
import logo from "../images/logo.png"

function Encabezado({user, onLogout, theme, toggleTheme}) {
    return (
        <>
            <header className="encabezado">
                <nav className="nav">
                    <img className="logo" src={logo} alt="Logo" />
                    <div className="nav-center">
                        <ul className="nav-list">
                            <li> <a href="#">Home</a></li>
                            <li> <a href="#">Movies</a></li>
                            <li> <a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="nav-user">
                        <button onClick={toggleTheme} aria-label="Toggle theme">{theme === "light" ? "🌞" : "🌜"}</button>
                        {user?.user ? (
                            <>
                                <span className="user-name">👤 {user.user}</span>
                                <button className="logout-button" onClick={onLogout}>Logout</button>
                            </>
                        ) : null}
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Encabezado;