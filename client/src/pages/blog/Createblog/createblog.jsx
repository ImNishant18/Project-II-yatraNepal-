"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    FaUpload,
    FaCheck,
    FaSpinner,
    FaPenAlt,
    FaUserEdit,
    FaHeading,
    FaFont,
    FaTextHeight,
    FaImage,
    FaTags
} from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";

import "./createblog.css";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

const FONT_FAMILIES = [
    { label: "Default", value: "" },
    { label: "Arial", value: "arial" },
    { label: "Georgia", value: "georgia" },
    { label: "Courier New", value: "courier-new" },
    { label: "Times New Roman", value: "times-new-roman" },
    { label: "Verdana", value: "verdana" },
];

const FONT_SIZES = [
    { label: "Small", value: "small" },
    { label: "Normal", value: "normal" },
    { label: "Large", value: "large" },
    { label: "Huge", value: "huge" },
];

const quillModules = {
    toolbar: [
        [{ font: FONT_FAMILIES.filter(f => f.value).map(f => f.value) }],
        [{ header: [2, 3, 4, false] }],
        [{ size: FONT_SIZES.map(s => s.value) }],
        [{ align: [] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};

const quillFormats = [
    "font",
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "list",
    "bullet",
];

const CreateBlog = () => {
    // All hooks at the very top (no hooks after returns!)
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    const [title, setTitle] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fontFamily, setFontFamily] = useState("");
    const [fontSize, setFontSize] = useState("normal");

    // Load user info from localStorage & init authorName
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUser(parsedUser);
        setAuthChecked(true);
        if (parsedUser?.name) setAuthorName(parsedUser.name);
    }, []);

    // Auth checks with early returns AFTER hooks
    if (!authChecked) return <p>Checking authentication...</p>;
    if (!user) {
        window.location.href = "/login";
        return null;
    }

    // Handle image selection & preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Upload image to Cloudinary
    const handleImageUpload = async () => {
        if (!imageFile) return "";

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "upload");

        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/doqbzwm1o/image/upload",
                formData
            );
            return res.data.secure_url;
        } catch (err) {
            console.error("Image upload failed:", err);
            setMessage({ text: "Image upload failed", type: "error" });
            return "";
        }
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        if (!title || !content || !authorName) {
            setMessage({ text: "Title, content, and author name are required", type: "error" });
            setIsSubmitting(false);
            return;
        }

        let imgUrl = "";
        if (imageFile) {
            imgUrl = await handleImageUpload();
            if (!imgUrl) {
                setIsSubmitting(false);
                return;
            }
        }

        try {
            const res = await axios.post(
                "http://localhost:8800/api/blogs",
                {
                    title,
                    content,
                    name: authorName,
                    img: imgUrl,
                    tags: tags.split(",").map((tag) => tag.trim()),
                    fontFamily,
                    fontSize,
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                setMessage({ text: "Blog created successfully!", type: "success" });
                setTimeout(() => navigate("/blog"), 2000);
            } else {
                setMessage({ text: "Something went wrong", type: "error" });
            }
        } catch (err) {
            console.error("Create Blog Error:", err.response?.data || err.message);
            setMessage({ text: "Failed to create blog", type: "error" });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="create-blog-page">
            <Navbar />
            <Header type="list" />

            <main className="blog-editor-container">
                <div className="editor-header">
                    <h1>
                        <FaPenAlt className="header-icon" />
                        Create New Blog Post
                    </h1>
                    <p>Share your thoughts and experiences with the community</p>
                </div>

                {message.text && (
                    <div className={`alert-message ${message.type}`}>
                        {message.type === "success" ? (
                            <FaCheck className="alert-icon" />
                        ) : (
                            <FiAlertTriangle className="alert-icon" />
                        )}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="blog-editor-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                <FaHeading className="input-icon" />
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter your blog title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaUserEdit className="input-icon" />
                                Author Name
                            </label>
                            <input
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaFont className="input-icon" />
                                Font Family
                            </label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="styled-select"
                            >
                                {FONT_FAMILIES.map(({ label, value }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <FaTextHeight className="input-icon" />
                                Font Size
                            </label>
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                                className="styled-select"
                            >
                                {FONT_SIZES.map(({ label, value }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>
                                <FaImage className="input-icon" />
                                Featured Image
                            </label>
                            <div className="image-upload-container">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input"
                                />
                                <label htmlFor="image-upload" className="upload-label">
                                    {previewImage ? (
                                        <div className="image-preview">
                                            <img src={previewImage} alt="Preview" />
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <FaUpload className="upload-icon" />
                                            <span>Choose an image</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>
                                <FaTags className="input-icon" />
                                Tags
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="tech, design, web (comma separated)"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Content</label>
                            <div className="quill-editor-container">
                                <ReactQuill
                                    value={content}
                                    onChange={setContent}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Write your amazing content here..."
                                    theme="snow"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="spin" />
                                Publishing...
                            </>
                        ) : (
                            "Publish Blog"
                        )}
                    </button>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default CreateBlog;