import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/Register/register";
import Profile from "./pages/profile/profile";
import Stays from "./pages/stays/stays";
import Flights from "./pages/flights/flights";
import MoneyExchange from "./pages/money-exchange/money-exchange";
import TouristGuide from "./pages/Tourist/TouristGuideMain/touristguide";
import TouristGuideForm from "./pages/Tourist/TouristguideRegister/Touristguider";
import UserDashboard from "./pages/Tourist/Touristuser/touristuser";
import ChatPage from "./pages/chat/chat";
import TouristGuideDashboard from "./pages/Tourist/Touristguidedashboard/TouristGuidedashboard";
import Places from "./pages/place/place";
import TravellersChoice from "./pages/Discover/TravellerChoise/TravellersChoice";
import TravelStories from "./pages/Discover/TravellersStories/TravellersStories";
import Trips from "./pages/Trips/trips";
import WriteReview from "./pages/ReviewAll/writereview/writereview";
import AllReviewsPage from "./pages/ReviewAll/viewreview/viewreview";
import Createblog from "./pages/blog/Createblog/createblog";
import Viewblog from "./pages/blog/Viewblog/viewblog";
import FullBlog from "./pages/blog/FullBlog/fullblog";
import ChadParbaList from "./pages/Events/allevents/allevents";
import ChadParbaDetail from "./pages/Events/viewbyid/viewbyid";
import Bookings from "./pages/booked/booked";
import PlaceDetails from "./pages/place/placedetails";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NepaliCalendar from "./pages/calender/calender";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentFailure from "./pages/Payment/PaymentFailure";
import GuideProfile from "./pages/Tourist/Touristuser/GuideProfile";
import BookingDetails from "./pages/Tourist/Touristuser/BookingDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public and user-facing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stays" element={<Stays />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/money-exchange" element={<MoneyExchange />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/touristguide" element={<TouristGuide />} />
        <Route path="/create-tourist-guide" element={<TouristGuideForm />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/touristguide-dashboard" element={<TouristGuideDashboard />} />
        <Route path="/places" element={<Places />} />
        <Route path="/calendar" element={<NepaliCalendar />} />
        <Route path="/placedetails/:id" element={<PlaceDetails />} />
        <Route path="/travellers-choice" element={<TravellersChoice />} />
        <Route path="/travel-stories" element={<TravelStories />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/write-review" element={<WriteReview />} />
        <Route path="/reviews" element={<AllReviewsPage />} />
        <Route path="/write-blog" element={<Createblog />} />
        <Route path="/blog" element={<Viewblog />} />
        <Route path="/blog/:blogId" element={<FullBlog />} />
        <Route path="/events" element={<ChadParbaList />} />
        <Route path="/events/:id" element={<ChadParbaDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/guide/:id" element={<GuideProfile />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;