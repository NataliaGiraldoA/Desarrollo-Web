import { useState } from "react";
import "../styles/Form.css";

export default function Form() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [adress, setAddress] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && email && message && adress) {
            const userResponse = {
                name,
                email,
                message,
                adress
            };
            localStorage.setItem("formResponse", JSON.stringify(userResponse));
            setSubmitted(true);
            setName("");
            setEmail("");
            setMessage("");
            setAddress("");
        } else {
            alert("Please fill in all fields.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Contact Us</h2>
            {submitted && <p className="success-message">Thank you for your message!</p>}
            <div className="form-group">
                <input className="form-input"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input className="form-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input className="form-input"
                    type="text"
                    placeholder="Address"
                    value={adress}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <textarea className="form-input"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    );

}