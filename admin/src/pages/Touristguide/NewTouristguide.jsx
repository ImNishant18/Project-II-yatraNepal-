import "./Touristguide.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { touristguideInputs } from "../../formSource";

const NewTouristGuide = ({ title, isAdmin }) => {
    const [info, setInfo] = useState({});
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, multiple, options } = e.target;

        if (multiple) {
            // Collect all selected options as an array
            const selectedOptions = Array.from(options)
                .filter((option) => option.selected)
                .map((option) => option.value);

            setInfo((prev) => ({ ...prev, [name]: selectedOptions }));
        } else {
            setInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
    };

    const uploadToCloudinary = async () => {
        if (!file) return "";
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "upload");

        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/doqbzwm1o/image/upload",
            formData
        );

        return res.data.secure_url;
    };

    const isFormValid = () => {
        const requiredFields = touristguideInputs
            .filter((input) => input.required)
            .map((input) => input.id);

        if (isAdmin) {
            requiredFields.push("email");
        }

        return requiredFields.every((field) => {
            const value = info[field];
            if (Array.isArray(value)) {
                return value.length > 0; // For multiple selects, must select at least one
            }
            return value?.toString().trim() !== "";
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploading) return;

        if (!isFormValid()) {
            alert("Please fill all required fields.");
            return;
        }

        setUploading(true);

        try {
            let imageUrl = "";
            if (file) {
                imageUrl = await uploadToCloudinary();
            }

            const newGuide = {
                ...info,
                experience: Number(info.experience),
                img: imageUrl,
            };

            await axios.post(
                "http://localhost:8800/api/touristguide/register",
                newGuide,
                { withCredentials: true }
            );

            if (!isMounted.current) return;
            alert("Tourist guide created successfully!");
            setFile(null);
            setInfo({});
            navigate("/touristguide");
        } catch (err) {
            if (!isMounted.current) return;
            console.error("Create error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to create tourist guide.");
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
                    <h1>{title || "Add New Tourist Guide"}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt="Preview"
                        />
                    </div>
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Upload Profile Image{" "}
                                    <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {isAdmin && (
                                <div className="formInput">
                                    <label htmlFor="email">User Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        onChange={handleChange}
                                        value={info.email || ""}
                                        required
                                    />
                                </div>
                            )}

                            {touristguideInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label htmlFor={input.id}>{input.label}</label>
                                    {input.type === "select" ? (
                                        <select
                                            id={input.id}
                                            name={input.id}
                                            onChange={handleChange}
                                            value={info[input.id] || (input.multiple ? [] : "")}
                                            multiple={input.multiple || false}
                                            required={input.required}
                                        >
                                            {!input.multiple && (
                                                <option value="">{`-- ${input.placeholder} --`}</option>
                                            )}
                                            {input.options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            id={input.id}
                                            name={input.id}
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            onChange={handleChange}
                                            value={info[input.id] || ""}
                                            required={input.required}
                                            step={input.step}
                                            min={input.min}
                                            max={input.max}
                                        />
                                    )}
                                </div>
                            ))}

                            <button type="submit" disabled={uploading || !isFormValid()}>
                                {uploading ? "Uploading..." : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewTouristGuide;
