"use client"
import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Upload, User, Mail, MapPin, Phone, Lock } from "lucide-react"
import axios from "axios"

import "./register.css"
import { AuthContext } from "../../context/AuthContext"
import Navbar from "../../components/navbar/Navbar"

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        country: "",
        city: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [localError, setLocalError] = useState("")

    const { loading, error, dispatch } = useContext(AuthContext)
    const navigate = useNavigate()

    const CLOUD_NAME = "doqbzwm1o"
    const UPLOAD_PRESET = "upload"

    const countries = ["Nepal", "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "Brazil", "India", "China", "Mexico", "Italy", "Spain", "Netherlands", "Sweden", "Norway", "Denmark", "Finland"]

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return ""
        const data = new FormData()
        data.append("file", imageFile)
        data.append("upload_preset", UPLOAD_PRESET)
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data)
            return res.data.secure_url
        } catch (err) {
            console.error("Image upload failed:", err)
            return ""
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError("")

        // Client-side validations
        if (formData.password !== formData.confirmPassword) {
            setLocalError("Passwords do not match.")
            return
        }
        if (formData.password.length < 8) {
            setLocalError("Password must be at least 8 characters long.")
            return
        }

        dispatch({ type: "LOGIN_START" })

        // Upload image if selected
        const imageUrl = await uploadImageToCloudinary()

        try {
            // Send registration request
            await axios.post("http://localhost:8800/api/auth/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                city: formData.city,
                country: formData.country,
                img: imageUrl
            })

            // Auto-login after registration
            const loginRes = await axios.post("http://localhost:8800/api/auth/login", {
                username: formData.username,
                password: formData.password
            })

            dispatch({ type: "LOGIN_SUCCESS", payload: loginRes.data.details })
            localStorage.setItem("token", loginRes.data.token || "")
            alert("Registration and login successful!")
            navigate("/")
        } catch (err) {
            const msg = err.response?.data?.message || err.message
            if (msg.toLowerCase().includes("username")) {
                setLocalError("Username is already taken.")
            } else if (msg.toLowerCase().includes("email")) {
                setLocalError("Email is already registered.")
            } else {
                dispatch({ type: "LOGIN_FAILURE", payload: { message: msg } })
            }
        }
    }

    return (
        <div>
            <Navbar />
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-description">Fill in your information to register for an account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        {/* Profile Image */}
                        <div className="profile-upload-container">
                            <div className="profile-image-wrapper">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" className="profile-image" />
                                ) : (
                                    <div className="profile-placeholder">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                                <label htmlFor="img" className="profile-upload-button">
                                    <Upload size={16} />
                                </label>
                                <input
                                    id="img"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="profile-upload-input"
                                />
                            </div>
                            <label htmlFor="img" className="profile-upload-label">
                                <Upload size={16} /> Upload Profile Image
                            </label>
                        </div>

                        {/* Username & Email */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="username" className="form-label"><User size={16} /> Username *</label>
                                <input id="username" type="text" placeholder="Enter your username" value={formData.username} onChange={handleChange} required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label"><Mail size={16} /> Email *</label>
                                <input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required className="form-input" />
                            </div>
                        </div>

                        {/* Country & City */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="country" className="form-label"><MapPin size={16} /> Country *</label>
                                <select id="country" value={formData.country} onChange={handleChange} required className="form-select">
                                    <option value="">Select your country</option>
                                    {countries.map(country => <option key={country} value={country}>{country}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="city" className="form-label"><MapPin size={16} /> City *</label>
                                <input id="city" type="text" placeholder="Enter your city" value={formData.city} onChange={handleChange} required className="form-input" />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label"><Phone size={16} /> Phone Number *</label>
                            <input id="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required className="form-input" />
                        </div>

                        {/* Password & Confirm */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label"><Lock size={16} /> Password *</label>
                                <div className="password-container">
                                    <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleChange} required minLength={8} className="form-input" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label"><Lock size={16} /> Confirm Password *</label>
                                <div className="password-container">
                                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required minLength={8} className="form-input" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Errors */}
                        {localError && <div className="error-text">{localError}</div>}
                        {error && <div className="error-text">{error.message}</div>}

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="submit-button">
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        <div className="login-link-container">
                            Already have an account?{" "}
                            <a href="/login" onClick={e => { e.preventDefault(); navigate("/login") }} className="login-link">Sign in here</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage