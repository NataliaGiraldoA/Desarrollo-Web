import { useState } from "react";
import "../styles/Login.css";
export default function Login({ onLogin }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [registering, setRegistering] = useState(false);
    const [role, setRole] = useState("user");

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Register new user
        if (registering) {
            if (users.some(u => u.user === user)) {
                setMessage("Username already exists");
                return;
            }
            const newUsers = [...users, { user, password, role }];
            localStorage.setItem("users", JSON.stringify(newUsers));
            setMessage("User registered. You can now log in");
            setRegistering(false);
            setPassword("");
            return;
        }
        // Login

        const foundUser = users.find(u => u.user === user && u.password === password);

        if (foundUser) {
            localStorage.setItem("Session", "active");
            localStorage.setItem("usuario", JSON.stringify(foundUser)); 
            onLogin?.(foundUser); 
            setMessage("Welcome to the website " + foundUser.user);
            return;
        }
        else {
            setMessage("Incorrect username or password");
        }
    };
    return (
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
                {registering && (
                    <div className="input-container">
                        <label htmlFor="role">
                            <input
                                className="role-checkbox"
                                type="checkbox"
                                id="role"
                                checked={role === "admin"}
                                onChange={(e) => setRole(e.target.checked ? "admin" : "user")}
                            />
                            Admin
                        </label>
                    </div>
                )}
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