"use client";

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, Phone, Edit, Save, X, LogOut, Camera, Eye, EyeOff, Lock, Calendar, FlagTriangleRight } from "lucide-react";
import { IoMdDoneAll } from "react-icons/io";
import axios from "axios";
import "./profile.css";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar"; 

import "./profile.css"; 
const UserProfile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState({
        personal: false,
        security: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [formData, setFormData] = useState({
        personal: {
            username: "",
            email: "",
            country: "",
            city: "",
            phone: "",
            img: ""
        },
        security: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const CLOUD_NAME = "doqbzwm1o";
    const UPLOAD_PRESET = "upload";

    const countries = [
        "United States", "Canada", "United Kingdom", "Australia", "Germany",
        "France", "Japan", "Brazil", "India", "China", "Mexico", "Italy",
        "Spain", "Netherlands", "Sweden", "Norway", "Denmark", "Finland"
    ];

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        setFormData({
            personal: {
                username: user.username || "",
                email: user.email || "",
                country: user.country || "",
                city: user.city || "",
                phone: user.phone || "",
                img: user.img || ""
            },
            security: {
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }
        });
        setImagePreview(user.img || null);
    }, [user, navigate]);

    const handleChange = (e, formType) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [formType]: {
                ...prev[formType],
                [id]: value
            }
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB");
            return;
        }
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return null;

        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                data
            );
            return res.data.secure_url;
        } catch (err) {
            console.error("Image upload failed:", err);
            setError("Failed to upload image. Please try again.");
            return null;
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Validate required fields
        if (!formData.personal.username || !formData.personal.email) {
            setError("Username and email are required");
            return;
        }

        setIsLoading(true);

        try {
            let imageUrl = formData.personal.img;
            if (imageFile) {
                imageUrl = await uploadImageToCloudinary();
                if (!imageUrl) {
                    setIsLoading(false);
                    return;
                }
            }

            const response = await axios.put(
                "/api/users/update",
                {
                    ...formData.personal,
                    img: imageUrl
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
            setSuccessMessage("Profile updated successfully!");
            setEditMode({ ...editMode, personal: false });
        } catch (err) {
            const errorMsg = err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to update profile. Please try again.";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        // Validate password fields
        if (formData.security.newPassword !== formData.security.confirmPassword) {
            setError("New passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.security.newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            await axios.put(
                "/api/users/change-password",
                {
                    currentPassword: formData.security.currentPassword,
                    newPassword: formData.security.newPassword
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuccessMessage("Password updated successfully!");
            setFormData({
                ...formData,
                security: {
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }
            });
            setEditMode({ ...editMode, security: false });
        } catch (err) {
            const errorMsg = err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to update password. Please try again.";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("token");
        navigate("/login");
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const cancelEdit = (formType) => {
        setEditMode(prev => ({ ...prev, [formType]: false }));
        setImageFile(null);
        if (user) {
            setFormData(prev => ({
                ...prev,
                [formType]: formType === "personal" ? {
                    username: user.username || "",
                    email: user.email || "",
                    country: user.country || "",
                    city: user.city || "",
                    phone: user.phone || "",
                    img: user.img || ""
                } : {
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }
            }));
            setImagePreview(user.img || null);
        }
        setError("");
        setSuccessMessage("");
    };

    if (!user) {
        return (
            <div className="profile-container">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                <div className="profile-content">
                    <div className="profile-sidebar">
                        <div className="profile-image-container">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="profile-image" />
                            ) : (
                                <div className="profile-image-placeholder">
                                    <User size={48} />
                                </div>
                            )}
                            {(editMode.personal || editMode.security) && (
                                <>
                                    <label htmlFor="profile-image-upload" className="edit-image-btn">
                                        <Camera size={18} />
                                        <span>Change Photo</span>
                                    </label>
                                    <input
                                        id="profile-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden-file-input"
                                    />
                                </>
                            )}
                        </div>

                        <h2>{user.username}</h2>
                        <p className="user-email">{user.email}</p>

                        <div className="account-info">
                            <div className="info-item">
                                <Calendar size={16} />
                                <span>Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            {user.lastLogin && (
                                <div className="info-item">
                                    <Lock size={16} />
                                    <span>Last login: {new Date(user.lastLogin).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-main-content">
                        <div className="tab-navigation">
                            <button
                                className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
                                onClick={() => setActiveTab("personal")}
                            >
                                Personal Info
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
                                onClick={() => setActiveTab("security")}
                            >
                                Security
                            </button>
                        </div>

                        {error && (
                            <div className="alert-message error">
                                <FlagTriangleRight size={18} />
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert-message success">
                                <IoMdDoneAll size={18} />
                                {successMessage}
                            </div>
                        )}

                        {activeTab === "personal" && (
                            <div className="profile-section">
                                <div className="section-header">
                                    <h2>Personal Information</h2>
                                    {!editMode.personal ? (
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditMode({ ...editMode, personal: true })}
                                        >
                                            <Edit size={16} /> Edit Profile
                                        </button>
                                    ) : null}
                                </div>

                                {!editMode.personal ? (
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <div className="info-label"><User size={16} /> Username</div>
                                            <div className="info-value">{user.username}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label"><Mail size={16} /> Email</div>
                                            <div className="info-value">{user.email}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label"><MapPin size={16} /> Country</div>
                                            <div className="info-value">{user.country || "Not specified"}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label"><MapPin size={16} /> City</div>
                                            <div className="info-value">{user.city || "Not specified"}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label"><Phone size={16} /> Phone</div>
                                            <div className="info-value">{user.phone || "Not specified"}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleProfileUpdate} className="edit-form">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="username"><User size={16} /> Username*</label>
                                                <input
                                                    id="username"
                                                    type="text"
                                                    value={formData.personal.username}
                                                    onChange={(e) => handleChange(e, "personal")}
                                                    required
                                                    minLength={3}
                                                    maxLength={30}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email"><Mail size={16} /> Email*</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={formData.personal.email}
                                                    onChange={(e) => handleChange(e, "personal")}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="country"><MapPin size={16} /> Country</label>
                                                <select
                                                    id="country"
                                                    value={formData.personal.country}
                                                    onChange={(e) => handleChange(e, "personal")}
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map(country => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="city"><MapPin size={16} /> City</label>
                                                <input
                                                    id="city"
                                                    type="text"
                                                    value={formData.personal.city}
                                                    onChange={(e) => handleChange(e, "personal")}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone"><Phone size={16} /> Phone</label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    value={formData.personal.phone}
                                                    onChange={(e) => handleChange(e, "personal")}
                                                    pattern="[0-9]{10,15}"
                                                    title="Phone number should be 10-15 digits"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="cancel-btn"
                                                onClick={() => cancelEdit("personal")}
                                                disabled={isLoading}
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                            <button type="submit" className="save-btn" disabled={isLoading}>
                                                {isLoading ? (
                                                    <span className="loading-spinner-btn"></span>
                                                ) : (
                                                    <>
                                                        <Save size={16} /> Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="profile-section">
                                <div className="section-header">
                                    <h2>Security Settings</h2>
                                    {!editMode.security && (
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditMode({ ...editMode, security: true })}
                                        >
                                            <Edit size={16} /> Change Password
                                        </button>
                                    )}
                                </div>

                                {!editMode.security ? (
                                    <div className="security-info">
                                        <p>Last password change: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "Never"}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePasswordUpdate} className="edit-form">
                                        <div className="form-group">
                                            <label htmlFor="currentPassword"><Lock size={16} /> Current Password*</label>
                                            <div className="password-input">
                                                <input
                                                    id="currentPassword"
                                                    type={passwordVisibility.current ? "text" : "password"}
                                                    value={formData.security.currentPassword}
                                                    onChange={(e) => handleChange(e, "security")}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-password"
                                                    onClick={() => togglePasswordVisibility("current")}
                                                >
                                                    {passwordVisibility.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="newPassword"><Lock size={16} /> New Password*</label>
                                            <div className="password-input">
                                                <input
                                                    id="newPassword"
                                                    type={passwordVisibility.new ? "text" : "password"}
                                                    value={formData.security.newPassword}
                                                    onChange={(e) => handleChange(e, "security")}
                                                    required
                                                    minLength={8}
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-password"
                                                    onClick={() => togglePasswordVisibility("new")}
                                                >
                                                    {passwordVisibility.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword"><Lock size={16} /> Confirm Password*</label>
                                            <div className="password-input">
                                                <input
                                                    id="confirmPassword"
                                                    type={passwordVisibility.confirm ? "text" : "password"}
                                                    value={formData.security.confirmPassword}
                                                    onChange={(e) => handleChange(e, "security")}
                                                    required
                                                    minLength={8}
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-password"
                                                    onClick={() => togglePasswordVisibility("confirm")}
                                                >
                                                    {passwordVisibility.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="password-requirements">
                                            <p><strong>Password Requirements:</strong></p>
                                            <ul>
                                                <li>Minimum 8 characters</li>
                                                <li>Must match confirmation</li>
                                            </ul>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="cancel-btn"
                                                onClick={() => cancelEdit("security")}
                                                disabled={isLoading}
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                            <button type="submit" className="save-btn" disabled={isLoading}>
                                                {isLoading ? (
                                                    <span className="loading-spinner-btn"></span>
                                                ) : (
                                                    "Update Password"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;