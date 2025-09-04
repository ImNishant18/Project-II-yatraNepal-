import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./editEntity.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const EditEntity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/")[1];

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/${path}/${id}`, { withCredentials: true });
                setFormData(res.data);
            } catch (err) {
                console.error("Failed to fetch:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, path]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/${path}/${id}`, formData, { withCredentials: true });
            alert("Updated successfully!");
            navigate(`/${path}`);
        } catch (err) {
            alert("Update failed.");
            console.error(err);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <div className="new">
                <Sidebar />
                <div className="newContainer">
                    <Navbar />
                    <div className="editEntity">
                        <h2>Edit {path.slice(0, -1)}</h2>
                        <form onSubmit={handleSubmit}>
                            {Object.keys(formData).map((key) =>
                                key === "_id" || key === "__v" ? null : (
                                    <div key={key} className="form-group">
                                        <input
                                            type="text"
                                            name={key}
                                            value={formData[key] || ""}
                                            onChange={handleChange}
                                            placeholder=" "
                                        />
                                        <label>{key}</label>
                                    </div>
                                )
                            )}
                            <button type="submit" className="submit-btn">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditEntity;