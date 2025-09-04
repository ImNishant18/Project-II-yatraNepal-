import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./imageSlider.scss";

const NewImageSlider = ({ inputs = [], title }) => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!info.name || info.name.trim() === "") {
      alert("Please enter an image title");
      return;
    }
    if (!file) {
      alert("Please select an image file");
      return;
    }

    let imageUrl = "";
    let imageType = file.type;

    // Upload image to Cloudinary
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload"); 

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/doqbzwm1o/image/upload",
        data
      );

      imageUrl = uploadRes.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      alert("Image upload failed");
      return;
    }

    // Prepare data to send to backend
    const sliderData = {
      name: info.name,
      imageType,
      imagePath: imageUrl,
    };

    try {
      await axios.post("http://localhost:8800/api/imageslider", sliderData);
      alert("Image slider added successfully!");
      navigate("/imageslider");
    } catch (err) {
      console.error("Failed to create image slider:", err);
      alert("Error saving data");
    }
  };

  return (
    <div className="imageslider">
      <Sidebar />
      <div className="imagesliderContainer">
        <Navbar />
        <div className="imagesliderTop">
          <h1>{title || "Add New Slider Image"}</h1>
        </div>
        <div className="imagesliderBottom">
          <div className="imagesliderPreview">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
              }
              alt="preview"
              className="imagesliderPreviewImage"
            />
          </div>
          <div className="imagesliderFormContainer">
            <form className="imagesliderForm" onSubmit={handleClick}>
              <div className="imagesliderFormGroup">
                <label htmlFor="file" className="imagesliderUploadLabel">
                  <DriveFolderUploadOutlinedIcon className="imagesliderUploadIcon" />
                  <span>Choose Slider Image</span>
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="imagesliderFileInput"
                />
                {file && <p className="imagesliderFileName">{file.name}</p>}
              </div>

              {inputs.map((input) => (
                <div className="imagesliderFormGroup" key={input.id}>
                  <label htmlFor={input.id}>{input.label}</label>
                  {input.type === "textarea" ? (
                    <textarea
                      id={input.id}
                      placeholder={input.placeholder}
                      onChange={handleChange}
                      required={input.required}
                      className="imagesliderTextarea"
                    />
                  ) : (
                    <input
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleChange}
                      required={input.required}
                      className="imagesliderInput"
                    />
                  )}
                </div>
              ))}

              <button type="submit" className="imagesliderSubmitButton">
                Upload Slider Image
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewImageSlider;