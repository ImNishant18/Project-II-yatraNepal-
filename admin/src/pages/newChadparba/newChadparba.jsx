import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { chadParbaInputs } from "../../formSource";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./newChadparba.scss";
const NewChadParba = () => {
    const [info, setInfo] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setInfo((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/chadparba", info);
            alert("ChadParba event created successfully!");
            navigate("/chadparba");
        } catch (err) {
            console.error("Error creating ChadParba:", err.response?.data || err.message);
            alert("Failed to create ChadParba: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="newChadParba">
            <Sidebar />
            <div className="newChadParbaContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New ChadParba Event</h1>
                </div>
                <div className="bottom">
                    <form>
                        {chadParbaInputs.map((input) => (
                            <div className="formInput" key={input.id}>
                                <label>{input.label}</label>
                                {input.type === "select" ? (
                                    <select
                                        id={input.id}
                                        onChange={handleChange}
                                        required={input.required}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>{input.placeholder}</option>
                                        {input.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : input.type === "textarea" ? (
                                    <textarea
                                        id={input.id}
                                        placeholder={input.placeholder}
                                        onChange={handleChange}
                                        required={input.required}
                                    />
                                ) : (
                                    <input
                                        id={input.id}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        onChange={handleChange}
                                        required={input.required}
                                        min={input.min}
                                        max={input.max}
                                    />
                                )}
                            </div>
                        ))}

                        <button type="submit" onClick={handleClick}>
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewChadParba;
