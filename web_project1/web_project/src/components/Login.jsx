import { useState } from "react";
import "../styles/Login.css";   
export default function Login({onLogin}) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [registering, setRegistering] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Register new user
        if (registering) {
            localStorage.setItem("user", JSON.stringify({ user, password }));
            setMessage("User registered. You can now log in");
            setRegistering(false);
            setPassword("");
            return;
        }
        // Login
        const data = JSON.parse(localStorage.getItem("user") || "null");
        if (data && data.user === user && data.password === password) {
            localStorage.setItem("Session", "active");
            setMessage("Welcome to the website " + user);
            // Notify parent component (App) that login was successful
            onLogin?.();
        } 
        else{
            setMessage("Incorrect username or password");
        }
    };
    return(
        <div className="login-container">
            <h1>{registering ? "Register" : "Log In"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input type="text"
                        placeholder="Username"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required>
                    </input>
                </div>
                <div className="input-container">
                    <input type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                    </input>
                </div>
                <button type="submit">
                    {registering ? "Register" : "Log In"}
                </button>
            </form>
            <button onClick={() => {
                setRegistering(!registering);
                setMessage("");
            }}>
                {registering ? "Already have an account? Log In" : "New user? Register"}
            </button>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
}