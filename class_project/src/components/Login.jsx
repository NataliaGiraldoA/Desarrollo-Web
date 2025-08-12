import { useState } from "react";

export default function Login({ onLogin }) {
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [registrando, setRegistrando] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Registrar usuario nuevo
        if (registrando) {
            localStorage.setItem("usuario", JSON.stringify({ usuario, clave }));
            setMensaje("Usuario registrado. Ya puede iniciar sesión");
            setRegistrando(false)
            setClave("");
            return;
        }
        // Intento de login 
        const datos = JSON.parse(localStorage.getItem("usuario") || "null");
        if (datos && datos.usuario === usuario && datos.clave === clave) {
            localStorage.setItem("Sesión", "activa");
            setMensaje("Bienvenido al sitio web" + usuario);
            // Avisar al componente padre (App) que el login fue exitoso 
            onLogin?.();
        }
        else {
            setMensaje("Usuario o contraseña incorrecta")
        }
    };
    return (
        <div style={{
            textAlign: "center",
            marginTop: "50px",
            fontFamily: "sans-serif"
        }}>
            <h1>{registrando ? "Registro" : "Inicio sesión"}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        style={{ padding: "8px", margin: "5px" }}
                        required>
                    </input>
                </div>
                <div>
                    <input type="password"
                        placeholder="Contraseña"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}>
                    </input>
                </div>
                <button type="submit" style={{ textAlign: "center", padding: "8px, 20px", marginTop: "10px", fontFamily: "sans-serif" }}>
                    {registrando ? "Registrar" : "Inicio sesión"}
                </button>
            </form>
            <button onClick={() => {
                setRegistrando(!registrando);
                setMensaje("");

            }}
                style={{ marginTop: "10px" }}
            >
                {registrando ? "Ya está registrado" : "Crear nueva cuenta"}
            </button>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}