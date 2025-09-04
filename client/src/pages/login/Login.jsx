import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import Navbar from "../../components/navbar/Navbar";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const { loading, error, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await axios.post("http://localhost:8800/api/auth/login", credentials, {
                withCredentials: true,
            });

            localStorage.setItem("user", JSON.stringify(res.data.details));
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            
            // Show success alert
            alert("Login successful! Welcome back!");
            
            navigate("/");
        } catch (err) {
            dispatch({
                type: "LOGIN_FAILURE",
                payload: err.response?.data || { message: "Login failed." },
            });
            
            // Show error alert for invalid credentials
            alert("Invalid username or password. Please try again.");
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div>
            <Navbar />
            <div className="login-container">
                <div className="login-box">
                    <div className="brand-section">
                        <div className="brand-tagline">
                            <MapPin className="icon-small" />
                            <span>Discover the Beauty of Nepal</span>
                        </div>
                    </div>

                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to your YatraNepal account to continue your journey</p>
                        </div>

                        <form onSubmit={handleClick} className="login-form">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={credentials.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="toggle-password"
                                    >
                                        {showPassword ? <EyeOff className="icon-small" /> : <Eye className="icon-small" />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    Remember me
                                </label>
                                <button type="button" className="forgot-link" onClick={handleForgotPassword}>
                                    Forgot password?
                                </button>
                            </div>

                            <button type="submit" disabled={loading} className="submit-button">
                                {loading ? (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                            {error && <span className="error-text">{error.message}</span>}
                        </form>

                        <div className="signup-link">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="link-button"
                            >
                                Sign up here
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;