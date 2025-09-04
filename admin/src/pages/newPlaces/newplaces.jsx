import "./newplaces.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { placeInputs } from "../../formSource";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categoryOptions = [
  { label: "Cultural", value: "cultural" },
  { label: "Natural", value: "natural" },
  { label: "Historical", value: "historical" },
  { label: "Adventure", value: "adventure" },
  { label: "Religious", value: "religious" },
];

const NewPlace = () => {
  const [files, setFiles] = useState(null);
  const [info, setInfo] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!info.name || !info.address || !info.city || !info.category) {
      alert("Please fill in all required fields.");
      return;
    }

    const lat = parseFloat(info.latitude);
    const lng = parseFloat(info.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid numbers for latitude and longitude.");
      return;
    }

    let photoUrls = [];
    if (files && files.length > 0) {
      try {
        photoUrls = await Promise.all(
          Array.from(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");

            const res = await axios.post(
              "https://api.cloudinary.com/v1_1/doqbzwm1o/image/upload",
              data
            );
            return res.data.url;
          })
        );
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("One or more image uploads failed!");
        return;
      }
    }

    const newPlace = {
      ...info,
      img: photoUrls[0] || "", // Assuming a single image for display
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    // Remove raw latitude and longitude fields
    delete newPlace.latitude;
    delete newPlace.longitude;

    try {
      await axios.post("/place", newPlace);
      alert("Place created successfully!");
      navigate("/place");
    } catch (err) {
      console.error("Place creation failed:", err.response?.data || err.message);
      alert("Failed to create place: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Place</h1>
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
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Images: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {placeInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Category</label>
                <select id="category" defaultValue="" onChange={handleChange} required>
                  <option value="" disabled>
                    -- Select a category --
                  </option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Latitude</label>
                <input
                  id="latitude"
                  type="text"
                  placeholder="27.7172"
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Longitude</label>
                <input
                  id="longitude"
                  type="text"
                  placeholder="85.3240"
                  onChange={handleChange}
                />
              </div>

              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPlace;
