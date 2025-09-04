import "./NewExchange.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { moneyexchangeInputs } from "../../formSource";

const NewExchange = ({ title }) => {
    const [info, setInfo] = useState({});
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const isMounted = useRef(true);

    // Prevent memory leaks
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let val = value;

        // Handle boolean and number fields
        if (name === "isActive") {
            val = value === "true";
        }

        setInfo((prev) => ({ ...prev, [name]: val }));
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).slice(0, 3);
        setFiles(selected);
    };

    const uploadToCloudinary = async () => {
        const urls = [];

        for (let f of files) {
            const formData = new FormData();
            formData.append("file", f);
            formData.append("upload_preset", "upload");

            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/doqbzwm1o/image/upload",
                formData
            );
            urls.push(res.data.secure_url);
        }

        return urls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrls = [];
            if (files.length > 0) {
                imageUrls = await uploadToCloudinary();
            }

            const newExchange = {
                ...info,
                lat: info.lat ? parseFloat(info.lat) : undefined,
                lng: info.lng ? parseFloat(info.lng) : undefined,
                images: imageUrls,
            };

            await axios.post("http://localhost:8800/api/money-exchange", newExchange, {
                withCredentials: true,
            });

            if (!isMounted.current) return;
            alert("Exchange Center created successfully!");
            navigate("/money-exchange");
        } catch (err) {
            if (!isMounted.current) return;
            console.error("Create error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to create Exchange Center.");
        } finally {
            if (isMounted.current) setUploading(false);
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title || "Add New Exchange Center"}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                files && files.length > 0
                                    ? URL.createObjectURL(files[0])
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt="Preview"
                        />
                    </div>
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Upload Images (Max 3):{" "}
                                    <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {moneyexchangeInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label htmlFor={input.id}>{input.label}</label>
                                    <input
                                        id={input.id}
                                        name={input.id}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        onChange={handleChange}
                                        required={input.required}
                                        step={input.step}
                                        min={input.min}
                                        max={input.max}
                                    />
                                </div>
                            ))}

                            {/* Add boolean input for isActive */}
                            <div className="formInput">
                                <label htmlFor="isActive">Is Active?</label>
                                <select
                                    id="isActive"
                                    name="isActive"
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>

                            <button type="submit" disabled={uploading}>
                                {uploading ? "Uploading..." : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewExchange;
