
export default function Navbar(user, onLogout){
    return(
        <nav className="navbar">
            <div className="logo">Mi logo</div>
            <ul className="menu">
                <li>Inicio</li>
                <li>Servicio</li>
                <li>Contacto</li>
            </ul>
            <div className="usuario">
                {user?.usuario ?(
                    <>
                        <spam style={{margin:8}}>😨 {user.usuario}</spam>
                        <button onClick={onLogout}>Cerrar sesión </button>
                    </>
                ): null}
            </div>
        </nav>
    );
}