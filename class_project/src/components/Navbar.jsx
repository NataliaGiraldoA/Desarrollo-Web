
export default function Navbar({user, onLogout, theme, toggleTheme}) {
    return(
        <nav className="navbar">
            <div className="logo">Mi logo</div>
            <ul className="menu">
                <li>Inicio</li>
                <li>Servicio</li>
                <li>Contacto</li>
            </ul>
            <div className="usuario">
                <button onClick={toggleTheme} aria-label="Cambiar tema">{theme === "light" ? "🌞" : "🌜"}</button>
                {user?.usuario ?(
                    <>
                        <span style={{margin:8}}>😨 {user.usuario}</span>
                        <button onClick={onLogout}>Cerrar sesión </button>
                    </>
                ): null}
            </div>
        </nav>
    );
}