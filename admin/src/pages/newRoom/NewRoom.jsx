import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState("");
  const [rooms, setRooms] = useState("");
  const { data, loading } = useFetch("/hotels");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!hotelId) {
      alert("Please select a hotel");
      return;
    }

    const roomNumbers = rooms
      .split(",")
      .map((room) => room.trim())
      .filter((room) => room !== "")
      .map((room) => ({ number: room }));

    try {
      await axios.post(`/rooms/${hotelId}`, { ...info, roomNumbers });
      alert("Room created successfully!");
            navigate("/rooms");

    } catch (err) {
      console.error("Error creating room:", err.response?.data || err.message);
      alert("Failed to create room: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
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
                <label>Room Numbers</label>
                <textarea
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="Enter Room Numbers (e.g. 101,102,103)"
                />
              </div>

              <div className="formInput">
                <label>Choose a Hotel</label>
                <select
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  <option value="">Select a hotel</option>
                  {loading
                    ? <option disabled>Loading...</option>
                    : data.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                </select>
              </div>

              <button type="submit" onClick={handleClick}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;