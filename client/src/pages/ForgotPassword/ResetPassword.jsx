import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import "./ResetPassword.css";
function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(
                `http://localhost:8800/api/auth/reset-password/${token}`,
                { password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setMessage(res.data.message);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message ||
                "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="header">
                    <h2>Reset Your Password</h2>
                    <p>Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="form-group">
                        <label htmlFor="password">
                            <Lock className="icon" />
                            New Password
                        </label>
                        <div className="password-input-container">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <Lock className="icon" />
                            Confirm Password
                        </label>
                        <div className="password-input-container">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading || success}>
                        {isLoading ? (
                            <>
                                <Loader2 className="spinner" />
                                Resetting...
                            </>
                        ) : success ? (
                            <>
                                <CheckCircle className="success-icon" />
                                Password Reset!
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;