import { useState } from "react";
import axios from "axios";
import { Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./forgot-password.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            const res = await axios.post(
                "/api/auth/forgot-password", 
                { email }
            );
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="brand-header">
                    <h2>Reset Your Password</h2>
                    <p>Enter your email to receive a password reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <Mail className="icon" />
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="spinner" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>

                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}

                    <div className="back-to-login">
                        Remember your password?{" "}
                        <button 
                            type="button" 
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;