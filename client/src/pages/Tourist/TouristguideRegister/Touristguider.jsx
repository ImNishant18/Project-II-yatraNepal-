import React, { useState } from "react";
import axios from "axios";
import "./Touristguider.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

const categoryOptions = [
    "Adventure",
    "Cultural",
    "Historical",
    "Wildlife",
    "Religious",
    "Eco-tourism",
    "Trekking",
    "Local Experience",
];

const licenseNumberPattern = /^TCB\/TG\([A-Z\/_]+\)-\d{2}\/\d{4,5}$/;

const TouristGuideForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        language: "",
        experience: "",
        contactNumber: "",
        licenseNumber: "",
        category: [],
        pricePerDay: "",
        maxGroupSize: 5,
        img: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        const updated = checked
            ? [...formData.category, value]
            : formData.category.filter((cat) => cat !== value);
        setFormData((prev) => ({ ...prev, category: updated }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const uploadToCloudinary = async () => {
        if (!imageFile) return "";
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "upload");

        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/doqbzwm1o/image/upload",
            data
        );

        return res.data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const licenseTrimmed = formData.licenseNumber.trim();
        if (!licenseNumberPattern.test(licenseTrimmed)) {
            alert("Invalid license number format");
            return;
        }

        if (formData.category.length === 0) {
            alert("Select at least one category");
            return;
        }

        if (!formData.pricePerDay) {
            alert("Price per day is required");
            return;
        }

        setUploading(true);

        try {
            let imageUrl = "";
            if (imageFile) {
                imageUrl = await uploadToCloudinary();
            }

            const payload = {
                ...formData,
                experience: Number(formData.experience),
                pricePerDay: Number(formData.pricePerDay),
                maxGroupSize: Number(formData.maxGroupSize),
                img: imageUrl,
            };

            await axios.post("http://localhost:8800/api/touristguide", payload, {
                withCredentials: true,
            });

            alert("Tourist guide registered successfully!");
            navigate("/touristguide-dashboard");

            setFormData({
                name: "",
                location: "",
                language: "",
                experience: "",
                contactNumber: "",
                licenseNumber: "",
                category: [],
                pricePerDay: "",
                maxGroupSize: 5,
                img: "",
            });
            setImageFile(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Navbar />
            <form className="tourist-guide-form" onSubmit={handleSubmit}>
                <h2>Create Tourist Guide Account</h2>

                <div className="tourist-form-row">
                    <div className="tourist-form-group">
                        <label>Upload Profile Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {preview && <img src={preview} alt="Preview" className="image-preview" />}
                    </div>

                    <div className="tourist-form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                    </div>
                </div>

                <div className="tourist-form-row">
                    <div className="tourist-form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            required
                            onChange={handleInputChange}
                            value={formData.location}
                        />
                    </div>

                    <div className="tourist-form-group">
                        <label>Language</label>
                        <input
                            type="text"
                            name="language"
                            required
                            onChange={handleInputChange}
                            value={formData.language}
                        />
                    </div>

                    <div className="tourist-form-group">
                        <label>Experience (years)</label>
                        <input
                            type="number"
                            name="experience"
                            required
                            min={0}
                            onChange={handleInputChange}
                            value={formData.experience}
                        />
                    </div>
                </div>

                <div className="tourist-form-row">
                    <div className="tourist-form-group">
                        <label>Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            required
                            onChange={handleInputChange}
                            value={formData.contactNumber}
                        />
                    </div>

                    <div className="tourist-form-group">
                        <label>License Number</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            required
                            onChange={handleInputChange}
                            value={formData.licenseNumber}
                        />
                    </div>

                    <div className="tourist-form-group">
                        <label>Price per Day (Rs.)</label>
                        <input
                            type="number"
                            name="pricePerDay"
                            required
                            min={0}
                            onChange={handleInputChange}
                            value={formData.pricePerDay}
                        />
                    </div>

                    <div className="tourist-form-group">
                        <label>Max Group Size</label>
                        <input
                            type="number"
                            name="maxGroupSize"
                            min={1}
                            onChange={handleInputChange}
                            value={formData.maxGroupSize}
                        />
                    </div>
                </div>

                <div className="tourist-form-row">
                    <div className="tourist-form-group">
                        <label>Select Categories</label>
                        <div className="tourist-category-checkboxes">
                            {categoryOptions.map((cat) => (
                                <label key={cat}>
                                    <input
                                        type="checkbox"
                                        value={cat}
                                        checked={formData.category.includes(cat)}
                                        onChange={handleCategoryChange}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Create Guide"}
                </button>
            </form>
            <Footer />
        </>
    );
};

export default TouristGuideForm;