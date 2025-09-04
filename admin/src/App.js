import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import New from "./pages/new/New";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";
import NewExchange from "./pages/NewExchange/NewExchange";
import NewTouristGuide from "./pages/Touristguide/NewTouristguide";
import NewPlace from "./pages/newPlaces/newplaces";
import NewChadparba from "./pages/newChadparba/newChadparba";
import AdminBookings from "./pages/Booking/booking";
import NewImageSlider from "./pages/ImageSlider/imageSlider";
import EditEntity from "./pages/Edit/EditEntity";

import {
  chadParbaInputs,
  imageSliderInputs,
  moneyexchangeInputs,
  placeInputs,
  touristguideInputs,
  userInputs,
} from "./formSource";

import {
  chadParbaColumns,
  hotelColumns,
  imageSliderColumns,
  moneyexchangeColumns,
  placeColumns,
  roomColumns,
  touristguideColumns,
  userColumns,
} from "./datatablesource";

import "./style/dark.scss";
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Users */}
            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={userColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <New inputs={userInputs} title="Add New User" />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Hotels */}
            <Route path="hotels">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={hotelColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewHotel />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Rooms */}
            <Route path="rooms">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={roomColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewRoom />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Money Exchange */}
            <Route path="money-exchange">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={moneyexchangeColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewExchange
                      inputs={moneyexchangeInputs}
                      title="Add New Exchange Center"
                    />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Tourist Guide */}
            <Route path="touristguide">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={touristguideColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewTouristGuide
                      inputs={touristguideInputs}
                      title="Add New Tourist Guide"
                      isAdmin={true}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Places */}
            <Route path="place">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={placeColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewPlace
                      inputs={placeInputs}
                      title="Add New Place"
                      isAdmin={true}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Chadparba */}
            <Route path="chadparba">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={chadParbaColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewChadparba
                      inputs={chadParbaInputs}
                      title="Add New ChadParba"
                      isAdmin={true}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Image Slider */}
            <Route path="imageslider">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={imageSliderColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <EditEntity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewImageSlider
                      inputs={imageSliderInputs}
                      title="Add New Slider Image"
                      isAdmin={true}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          {/* Bookings */}
          <Route path="/admin-booking" element={<AdminBookings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
